<?php
/**
 * Proxy API para WooCommerce: expone /api/* usando la REST API de WooCommerce.
 * Las credenciales se configuran en WooCommerce > Ajustes > Avanzado > API REST.
 */

if (!defined('ABSPATH')) {
    exit;
}

class RoyRiff_API {

    private $base;
    private $ck;
    private $cs;

    public function __construct() {
        $this->base = rest_url('wc/v3/');
        $this->ck   = get_option('royriff_wc_consumer_key', '');
        $this->cs   = get_option('royriff_wc_consumer_secret', '');

        if (!$this->ck || !$this->cs) {
            $this->ck = defined('ROYRIFF_WC_CONSUMER_KEY') ? ROYRIFF_WC_CONSUMER_KEY : '';
            $this->cs = defined('ROYRIFF_WC_CONSUMER_SECRET') ? ROYRIFF_WC_CONSUMER_SECRET : '';
        }
    }

    private function auth_header() {
        if (!$this->ck || !$this->cs) {
            return array();
        }
        return array(
            'Authorization' => 'Basic ' . base64_encode($this->ck . ':' . $this->cs),
            'Content-Type'  => 'application/json',
        );
    }

    private function request($method, $path, $body = null) {
        $url = $this->base . ltrim($path, '/');
        $args = array(
            'method'  => $method,
            'headers' => $this->auth_header(),
            'timeout' => 30,
        );
        if ($body !== null && in_array($method, array('POST', 'PUT'), true)) {
            $args['body'] = is_string($body) ? $body : json_encode($body);
        }

        $response = wp_remote_request($url, $args);
        $code     = wp_remote_retrieve_response_code($response);
        $body_out = wp_remote_retrieve_body($response);

        return array(
            'code' => $code,
            'body' => $body_out,
        );
    }

    private function send_json($data, $status = 200) {
        status_header($status);
        header('Content-Type: application/json; charset=utf-8');
        echo is_string($data) ? $data : json_encode($data);
    }

    private function send_error($message, $status = 500) {
        $this->send_json(array('message' => $message), $status);
    }

    /**
     * Despacha la ruta /api/$path (GET/POST/PUT) al proxy WooCommerce.
     */
    public function dispatch($path) {
        $method = $_SERVER['REQUEST_METHOD'];
        $path   = trim($path, '/');

        // Debug: Log la ruta recibida (solo en desarrollo)
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('RoyRiff API: Ruta recibida: ' . $path);
        }

        if (!$this->ck || !$this->cs) {
            $this->send_error('API WooCommerce no configurada. Añade royriff_wc_consumer_key y royriff_wc_consumer_secret en opciones o define ROYRIFF_WC_CONSUMER_KEY y ROYRIFF_WC_CONSUMER_SECRET.', 503);
            return;
        }

        // Rutas que el frontend usa (igual que el backend Node)
        // GET  /api/products         -> wc/v3/products
        // GET  /api/products/:id     -> wc/v3/products/:id
        // GET  /api/products/slug/:slug -> wc/v3/products?slug=:slug
        // GET  /api/payment_gateways -> wc/v3/payment_gateways
        // GET  /api/shipping_methods -> wc/v3/shipping_methods (puede no existir en WC)
        // POST /api/orders           -> wc/v3/orders
        // PUT  /api/orders/:id       -> wc/v3/orders/:id
        // GET  /api/orders/:id       -> wc/v3/orders/:id

        $wc_path = '';
        $body    = null;

        if ($path === 'config') {
            $this->send_json(array('storeUrl' => home_url('/')));
            return;
        }

        $is_slug_lookup = false;
        if ($path === 'products') {
            $wc_path = 'products?' . http_build_query($_GET);
        } elseif (preg_match('#^products/slug/(.+)$#', $path, $m)) {
            $is_slug_lookup = true;
            $slug = rawurlencode($m[1]);
            // WooCommerce busca por slug exacto
            // Si el slug contiene palabras clave como "lola" o "cruiser", también buscar por nombre
            $wc_path = 'products?slug=' . $slug . '&status=publish&per_page=100';
        } elseif (preg_match('#^products/(\d+)$#', $path, $m)) {
            $wc_path = 'products/' . $m[1];
        } elseif (preg_match('#^products/(\d+)/variations$#', $path, $m)) {
            // Variaciones de un producto variable
            $queryString = !empty($_GET) ? ('?' . http_build_query($_GET)) : '';
            $wc_path = 'products/' . $m[1] . '/variations' . $queryString;
        } elseif ($path === 'payment_gateways') {
            $wc_path = 'payment_gateways';
        } elseif ($path === 'shipping_methods') {
            $wc_path = 'shipping_methods';
        } elseif ($path === 'shipping/calculate' && $method === 'POST') {
            // Endpoint personalizado para calcular envíos por código postal
            $this->calculate_shipping();
            return;
        } elseif ($path === 'orders' && $method === 'POST') {
            $wc_path = 'orders';
            $body = file_get_contents('php://input');
        } elseif (preg_match('#^orders/(\d+)$#', $path, $m)) {
            $wc_path = 'orders/' . $m[1];
            if ($method === 'PUT') {
                $body = file_get_contents('php://input');
            }
        } else {
            $this->send_error('Ruta no encontrada: ' . $path, 404);
            return;
        }

        if ($wc_path === 'shipping_methods') {
            // WooCommerce puede no exponer shipping_methods en REST; devolver array vacío o compatible
            $this->send_json(array());
            return;
        }

        $result = $this->request($method, $wc_path, $body);

        // Debug: Log la respuesta de WooCommerce (solo en desarrollo)
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('RoyRiff API: WooCommerce respondió con código: ' . $result['code']);
            if ($result['code'] >= 400) {
                error_log('RoyRiff API: Error body: ' . substr($result['body'], 0, 500));
            }
        }

        if ($result['code'] >= 200 && $result['code'] < 300) {
            if ($is_slug_lookup) {
                $decoded = json_decode($result['body'], true);
                if (is_array($decoded) && count($decoded) > 0) {
                    // Si hay múltiples resultados, buscar el que mejor coincida
                    $searchSlug = isset($m[1]) ? strtolower($m[1]) : '';
                    $bestMatch = null;
                    
                    if (count($decoded) === 1) {
                        $bestMatch = $decoded[0];
                    } else {
                        // Buscar coincidencia exacta primero
                        foreach ($decoded as $product) {
                            if (isset($product['slug']) && strtolower($product['slug']) === $searchSlug) {
                                $bestMatch = $product;
                                break;
                            }
                        }
                        // Si no hay exacta, buscar por coincidencia parcial
                        if (!$bestMatch) {
                            $searchKeywords = explode('-', $searchSlug);
                            foreach ($decoded as $product) {
                                $productSlug = isset($product['slug']) ? strtolower($product['slug']) : '';
                                $productName = isset($product['name']) ? strtolower($product['name']) : '';
                                
                                // Verificar si alguna palabra clave coincide
                                foreach ($searchKeywords as $keyword) {
                                    if (strlen($keyword) > 2 && 
                                        (strpos($productSlug, $keyword) !== false || 
                                         strpos($productName, $keyword) !== false)) {
                                        $bestMatch = $product;
                                        break 2;
                                    }
                                }
                            }
                        }
                        // Si aún no hay match, usar el primero
                        if (!$bestMatch && count($decoded) > 0) {
                            $bestMatch = $decoded[0];
                        }
                    }
                    
                    if ($bestMatch) {
                        $this->send_json($bestMatch);
                        return;
                    }
                }
                // Si no hay productos, puede ser que el slug no exista o esté mal escrito
                $this->send_error('Producto no encontrado con slug: ' . (isset($m[1]) ? $m[1] : 'desconocido'), 404);
                return;
            }
            $this->send_json($result['body'], $result['code']);
            return;
        }

        // Manejo mejorado de errores
        $err = json_decode($result['body'], true);
        $msg = isset($err['message']) ? $err['message'] : (isset($err['code']) ? $err['code'] : $result['body']);
        
        // Mensajes específicos para códigos comunes
        if ($result['code'] === 401) {
            $msg = 'Credenciales de WooCommerce inválidas. Verifica que las Consumer Key y Consumer Secret estén correctas en WordPress → Ajustes → Roy Riff App.';
        } elseif ($result['code'] === 404) {
            $msg = 'Recurso no encontrado en WooCommerce. Verifica que el producto exista y esté publicado.';
        }
        
        $this->send_error($msg, $result['code'] ?: 500);
    }

    /**
     * Calcular costos de envío basado en código postal y productos
     * POST /api/shipping/calculate
     * Body: { postcode: string, city?: string, state?: string, line_items: array }
     */
    private function calculate_shipping() {
        $body = json_decode(file_get_contents('php://input'), true);
        
        if (!$body || !isset($body['postcode'])) {
            $this->send_error('Código postal requerido', 400);
            return;
        }

        if (!isset($body['line_items']) || !is_array($body['line_items']) || empty($body['line_items'])) {
            $this->send_error('Productos requeridos (line_items)', 400);
            return;
        }

        // Crear una orden temporal en WooCommerce para que calcule los envíos
        // WooCommerce calculará automáticamente los métodos disponibles según las zonas de envío
        $order_data = array(
            'set_paid' => false,
            'status' => 'pending',
            'billing' => array(
                'country' => 'AR',
                'state' => $body['state'] ?? '',
                'city' => $body['city'] ?? '',
                'postcode' => $body['postcode'],
                'address_1' => 'Temporal',
            ),
            'shipping' => array(
                'country' => 'AR',
                'state' => $body['state'] ?? '',
                'city' => $body['city'] ?? '',
                'postcode' => $body['postcode'],
                'address_1' => 'Temporal',
            ),
            'line_items' => $body['line_items'],
            'shipping_lines' => array(), // Vacío para que WooCommerce calcule
        );

        // Crear orden temporal
        $order_result = $this->request('POST', 'orders', json_encode($order_data));
        
        if ($order_result['code'] < 200 || $order_result['code'] >= 300) {
            $this->send_error('Error al calcular envío: ' . $order_result['body'], $order_result['code'] ?: 500);
            return;
        }

        $order = json_decode($order_result['body'], true);
        $order_id = $order['id'] ?? null;

        if (!$order_id) {
            $this->send_error('No se pudo crear orden temporal', 500);
            return;
        }

        // Obtener la orden completa para ver los métodos de envío calculados
        $order_full_result = $this->request('GET', 'orders/' . $order_id);
        
        if ($order_full_result['code'] >= 200 && $order_full_result['code'] < 300) {
            $order_full = json_decode($order_full_result['body'], true);
            
            // Extraer métodos de envío disponibles
            // WooCommerce puede tener shipping_lines calculados o podemos usar shipping zones
            $shipping_options = array();
            
            // Si hay shipping_lines en la orden, usarlos
            if (isset($order_full['shipping_lines']) && is_array($order_full['shipping_lines'])) {
                foreach ($order_full['shipping_lines'] as $line) {
                    $shipping_options[] = array(
                        'id' => $line['method_id'] ?? '',
                        'title' => $line['method_title'] ?? 'Envío',
                        'cost' => floatval($line['total'] ?? 0),
                        'method_id' => $line['method_id'] ?? '',
                    );
                }
            }

            // Si no hay shipping_lines, intentar obtener métodos de las zonas de envío
            if (empty($shipping_options)) {
                // Obtener zonas de envío de WooCommerce
                $zones_result = $this->request('GET', 'shipping/zones');
                if ($zones_result['code'] >= 200 && $zones_result['code'] < 300) {
                    $zones = json_decode($zones_result['body'], true);
                    
                    // Buscar zona que coincida con el código postal
                    foreach ($zones as $zone) {
                        $zone_id = $zone['id'] ?? null;
                        if ($zone_id) {
                            // Obtener métodos de esta zona
                            $methods_result = $this->request('GET', 'shipping/zones/' . $zone_id . '/methods');
                            if ($methods_result['code'] >= 200 && $methods_result['code'] < 300) {
                                $methods = json_decode($methods_result['body'], true);
                                foreach ($methods as $method) {
                                    if (isset($method['enabled']) && $method['enabled']) {
                                        $cost = floatval($method['settings']['cost']['value'] ?? $method['cost'] ?? 0);
                                        $mid = $method['id'] ?? '';
                                        $instance_id = isset($method['instance_id']) ? (int) $method['instance_id'] : 0;
                                        $method_id_full = $instance_id ? $mid . ':' . $instance_id : $mid;
                                        $shipping_options[] = array(
                                            'id' => $method_id_full,
                                            'title' => $method['title'] ?? ($method['method_title'] ?? 'Envío'),
                                            'cost' => $cost,
                                            'method_id' => $method_id_full,
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Eliminar la orden temporal
            $this->request('DELETE', 'orders/' . $order_id . '?force=true');

            // Si aún no hay opciones, devolver opciones por defecto comunes en Argentina
            if (empty($shipping_options)) {
                $shipping_options = array(
                    array(
                        'id' => 'correo_argentino',
                        'title' => 'Correo Argentino',
                        'cost' => 0, // Se calculará con plugin o manualmente
                        'method_id' => 'correo_argentino',
                    ),
                    array(
                        'id' => 'andreani',
                        'title' => 'Andreani',
                        'cost' => 0,
                        'method_id' => 'andreani',
                    ),
                );
            }

            $this->send_json(array(
                'postcode' => $body['postcode'],
                'options' => $shipping_options,
            ));
        } else {
            // Eliminar orden temporal aunque haya error
            if ($order_id) {
                $this->request('DELETE', 'orders/' . $order_id . '?force=true');
            }
            $this->send_error('Error al obtener métodos de envío', 500);
        }
    }
}
