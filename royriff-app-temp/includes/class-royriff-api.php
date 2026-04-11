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

    /** Nombre del nonce que el frontend debe enviar en el header X-RoyRiff-Nonce */
    const NONCE_ACTION = 'royriff_api';

    /** Máx. órdenes que una misma IP puede crear por ventana de tiempo */
    const ORDER_RATE_LIMIT     = 5;
    const ORDER_RATE_WINDOW_S  = 600; // 10 minutos

    public function __construct() {
        $this->base = rest_url('wc/v3/');
        $this->ck   = get_option('royriff_wc_consumer_key', '');
        $this->cs   = get_option('royriff_wc_consumer_secret', '');

        if (!$this->ck || !$this->cs) {
            $this->ck = defined('ROYRIFF_WC_CONSUMER_KEY') ? ROYRIFF_WC_CONSUMER_KEY : '';
            $this->cs = defined('ROYRIFF_WC_CONSUMER_SECRET') ? ROYRIFF_WC_CONSUMER_SECRET : '';
        }
    }

    /**
     * Verifica el nonce de WordPress enviado en el header X-RoyRiff-Nonce.
     * Devuelve true si es válido, false si no.
     */
    private function verify_nonce() {
        $nonce = '';
        if (isset($_SERVER['HTTP_X_ROYRIFF_NONCE'])) {
            $nonce = sanitize_text_field(wp_unslash($_SERVER['HTTP_X_ROYRIFF_NONCE']));
        }
        if ($nonce === '') {
            return false;
        }
        return wp_verify_nonce($nonce, self::NONCE_ACTION) !== false;
    }

    /**
     * Rate-limit por IP para creación de órdenes.
     * Usa un transient de WordPress (no requiere Redis ni memcached).
     */
    private function check_order_rate_limit() {
        $ip  = $this->get_client_ip();
        $key = 'royriff_rl_' . md5($ip);

        $data = get_transient($key);
        if ($data === false) {
            set_transient($key, array('count' => 1, 'first' => time()), self::ORDER_RATE_WINDOW_S);
            return true;
        }

        if (!is_array($data)) {
            $data = array('count' => 0, 'first' => time());
        }

        if ($data['count'] >= self::ORDER_RATE_LIMIT) {
            return false;
        }

        $data['count']++;
        set_transient($key, $data, self::ORDER_RATE_WINDOW_S);
        return true;
    }

    private function get_client_ip() {
        $headers = array('HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR');
        foreach ($headers as $h) {
            if (!empty($_SERVER[$h])) {
                $ip = strtok($_SERVER[$h], ',');
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
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
        // POST /api/orders           -> wc/v3/orders (payload saneado: envío y meta)
        // GET  /api/orders/:id       -> resumen público con ?order_key=
        // PUT/DELETE órdenes         -> no expuesto (403)

        $wc_path = '';
        $body    = null;

        if ($path === 'config') {
            $this->send_json(array(
                'storeUrl' => home_url('/'),
                'nonce'    => wp_create_nonce(self::NONCE_ACTION),
            ));
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
            if (!$this->verify_nonce()) {
                $this->send_error('Sesión expirada o token inválido.', 403);
                return;
            }
            $wc_path = 'payment_gateways';
        } elseif ($path === 'shipping_methods') {
            $wc_path = 'shipping_methods';
        } elseif ($path === 'shipping/calculate' && $method === 'POST') {
            if (!$this->verify_nonce()) {
                $this->send_error('Sesión expirada o token inválido.', 403);
                return;
            }
            $this->calculate_shipping();
            return;
        } elseif ($path === 'orders' && $method === 'POST') {
            // ── SEGURIDAD: nonce + rate-limit para creación de órdenes ──
            if (!$this->verify_nonce()) {
                $this->send_error('Sesión expirada o token inválido. Recargá la página e intentá de nuevo.', 403);
                return;
            }
            if (!$this->check_order_rate_limit()) {
                $this->send_error('Demasiados intentos. Esperá unos minutos antes de volver a intentar.', 429);
                return;
            }

            $wc_path = 'orders';
            $raw     = file_get_contents('php://input');
            $body    = $this->sanitize_order_create_payload($raw);
            if (is_wp_error($body)) {
                $this->send_error($body->get_error_message(), 400);
                return;
            }
        } elseif (preg_match('#^orders/(\d+)$#', $path, $m)) {
            $order_numeric_id = (int) $m[1];
            if ($method === 'GET') {
                $this->serve_public_order_summary($order_numeric_id);
                return;
            }
            if (in_array($method, array('PUT', 'DELETE', 'PATCH'), true)) {
                $this->send_error('Operación no permitida.', 403);
                return;
            }
            $this->send_error('Método no permitido.', 405);
            return;
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
     * GET /api/orders/{id}?order_key=... — solo datos mínimos si la clave coincide.
     */
    private function serve_public_order_summary($order_id) {
        $key = isset($_GET['order_key']) ? sanitize_text_field(wp_unslash($_GET['order_key'])) : '';
        if ($key === '') {
            $this->send_error('Se requiere order_key.', 403);
            return;
        }
        if (!function_exists('wc_get_order')) {
            $this->send_error('WooCommerce no está disponible.', 503);
            return;
        }
        $order = wc_get_order($order_id);
        if (!$order) {
            $this->send_error('Orden no encontrada.', 404);
            return;
        }
        if (!hash_equals((string) $order->get_order_key(), $key)) {
            $this->send_error('No autorizado.', 403);
            return;
        }
        $this->send_json(array(
            'id'             => $order->get_id(),
            'number'         => $order->get_order_number(),
            'status'         => $order->get_status(),
            'total'          => $order->get_total(),
            'payment_method' => $order->get_payment_method(),
            'billing'        => array(
                'email'      => $order->get_billing_email(),
                'first_name' => $order->get_billing_first_name(),
                'last_name'  => $order->get_billing_last_name(),
            ),
        ));
    }

    /**
     * Sanea el JSON de creación de orden: quita totales manipulables, fee_lines, meta interna;
     * recalcula el costo de envío en servidor.
     *
     * @param string $raw_json
     * @return string|\WP_Error JSON listo para reenviar a wc/v3/orders
     */
    private function sanitize_order_create_payload($raw_json) {
        $data = json_decode($raw_json, true);
        if (!is_array($data)) {
            return new \WP_Error('invalid_json', 'Cuerpo JSON inválido.');
        }

        // ── SEGURIDAD: campos que NUNCA deben venir del cliente ──────────
        // set_paid=true permitiría crear una orden "pagada" sin pago real.
        // status arbitrario permitiría saltar el flujo de pago (ej. "completed").
        $data['set_paid'] = false;

        // El status lo decide el servidor según el gateway de pago.
        // Para transferencia bancaria (bacs) → on-hold (WooCommerce envía datos de pago al cliente).
        // Para todo lo demás → pending (WooCommerce espera la confirmación del gateway externo).
        $pm = isset($data['payment_method']) ? (string) $data['payment_method'] : '';
        $is_bacs = $pm === 'bacs' || strpos($pm, 'bacs') !== false || strpos($pm, 'bank') !== false;
        $data['status'] = $is_bacs ? 'on-hold' : 'pending';

        unset(
            $data['fee_lines'],
            $data['coupon_lines'],
            $data['total'],
            $data['total_tax'],
            $data['discount_total'],
            $data['discount_tax'],
            $data['customer_id'],
            $data['prices_include_tax'],
            $data['cart_tax'],
            $data['shipping_tax'],
            $data['shipping_total']
        );

        if (!empty($data['line_items']) && is_array($data['line_items'])) {
            foreach ($data['line_items'] as &$li) {
                if (!is_array($li)) {
                    continue;
                }
                unset($li['subtotal'], $li['subtotal_tax'], $li['total'], $li['total_tax'], $li['price']);
            }
            unset($li);
        }

        $safe_meta = array();
        foreach ($data['meta_data'] ?? array() as $m) {
            if (!is_array($m)) {
                continue;
            }
            $k = isset($m['key']) ? (string) $m['key'] : '';
            if ($k === 'royriff_fulfillment') {
                $allowed_ff = array('store_pickup', 'door_delivery', 'carrier_branch_pickup', 'unknown');
                $vff          = isset($m['value']) ? (string) $m['value'] : '';
                if (in_array($vff, $allowed_ff, true)) {
                    $safe_meta[] = array(
                        'key'   => $k,
                        'value' => $vff,
                    );
                }
                continue;
            }
            if ($k !== '_react_return_url' && $k !== '_react_cancel_url') {
                continue;
            }
            $v = isset($m['value']) ? (string) $m['value'] : '';
            if ($v === '') {
                continue;
            }
            $validated = wp_validate_redirect($v, false);
            if (!$validated && defined('ROYRIFF_TRUSTED_REDIRECT_HOSTS') && is_string(ROYRIFF_TRUSTED_REDIRECT_HOSTS)) {
                $host = wp_parse_url($v, PHP_URL_HOST);
                if ($host) {
                    foreach (array_map('trim', explode(',', ROYRIFF_TRUSTED_REDIRECT_HOSTS)) as $allowed_host) {
                        if ($allowed_host !== '' && strcasecmp($host, $allowed_host) === 0) {
                            $validated = esc_url_raw($v);
                            break;
                        }
                    }
                }
            }
            if ($validated) {
                $safe_meta[] = array(
                    'key'   => $k,
                    'value' => esc_url_raw($validated),
                );
            }
        }
        $data['meta_data'] = $safe_meta;

        if (!empty($data['shipping_lines']) && is_array($data['shipping_lines'])) {
            $trusted = $this->apply_trusted_shipping_lines($data);
            if (is_wp_error($trusted)) {
                return $trusted;
            }
            $data = $trusted;
        }

        return wp_json_encode($data);
    }

    /**
     * Si el cliente envía method_id genérico "local_pickup", enlazar a la instancia WC (p. ej. local_pickup:3)
     * para que el admin y los informes muestren el método real configurado en zonas de envío.
     *
     * @return array{method_id: string, title: string}|null
     */
    private function resolve_wc_local_pickup_instance() {
        if (!class_exists('\WC_Shipping_Zones')) {
            return null;
        }
        $scan = function ($methods) {
            if (!is_array($methods)) {
                return null;
            }
            foreach ($methods as $method) {
                if (!is_object($method) || !isset($method->id)) {
                    continue;
                }
                if ((string) $method->id !== 'local_pickup') {
                    continue;
                }
                $iid = method_exists($method, 'get_instance_id') ? (int) $method->get_instance_id() : 0;
                if ($iid <= 0) {
                    continue;
                }
                $title = method_exists($method, 'get_title') ? (string) $method->get_title() : 'Retiro en el local';
                return array(
                    'method_id' => 'local_pickup:' . $iid,
                    'title'     => $title,
                );
            }
            return null;
        };

        foreach (\WC_Shipping_Zones::get_zones() as $zone) {
            if (!empty($zone['shipping_methods'])) {
                $found = $scan($zone['shipping_methods']);
                if ($found) {
                    return $found;
                }
            }
        }

        $zone0 = new \WC_Shipping_Zone(0);
        return $scan($zone0->get_shipping_methods());
    }

    /**
     * @param array $data Payload decodificado
     * @return array|\WP_Error
     */
    private function apply_trusted_shipping_lines(array $data) {
        if (empty($data['shipping_lines'][0]) || !is_array($data['shipping_lines'][0])) {
            return $data;
        }
        $method_id = isset($data['shipping_lines'][0]['method_id']) ? (string) $data['shipping_lines'][0]['method_id'] : '';
        if ($method_id === '') {
            return new \WP_Error('shipping', 'Falta method_id en envío.');
        }

        if ($method_id === 'local_pickup' || strpos($method_id, 'local_pickup:') === 0) {
            $data['shipping_lines'][0]['total'] = '0';
            if ($method_id === 'local_pickup') {
                $resolved = $this->resolve_wc_local_pickup_instance();
                if (is_array($resolved) && !empty($resolved['method_id'])) {
                    $data['shipping_lines'][0]['method_id'] = $resolved['method_id'];
                    $title                                  = isset($resolved['title']) ? (string) $resolved['title'] : '';
                    if ($title !== '' && empty($data['shipping_lines'][0]['method_title'])) {
                        $data['shipping_lines'][0]['method_title'] = $title;
                    }
                }
            }
            return $data;
        }

        $postcode = '';
        if (!empty($data['shipping']['postcode'])) {
            $postcode = preg_replace('/\D+/', '', (string) $data['shipping']['postcode']);
        }
        if ($postcode === '' && !empty($data['billing']['postcode'])) {
            $postcode = preg_replace('/\D+/', '', (string) $data['billing']['postcode']);
        }
        if ($postcode === '') {
            return new \WP_Error('shipping', 'Código postal requerido para calcular el envío.');
        }

        $city    = isset($data['shipping']['city']) ? (string) $data['shipping']['city'] : '';
        $state   = isset($data['shipping']['state']) ? (string) $data['shipping']['state'] : '';
        $country = isset($data['shipping']['country']) ? (string) $data['shipping']['country'] : 'AR';

        $pkg_items = array();
        foreach ($data['line_items'] ?? array() as $li) {
            if (!is_array($li)) {
                continue;
            }
            $pkg_items[] = array(
                'product_id'   => (int) ($li['product_id'] ?? 0),
                'variation_id' => (int) ($li['variation_id'] ?? 0),
                'quantity'     => max(1, (int) ($li['quantity'] ?? 1)),
            );
        }

        $options = $this->get_shipping_options_internal($postcode, $city, $state, $country, $pkg_items);
        if ($options === null) {
            return new \WP_Error('shipping', 'No se pudo calcular el envío.');
        }
        if (empty($options)) {
            return new \WP_Error('shipping', 'No hay métodos de envío disponibles para este código postal.');
        }

        $found = null;
        foreach ($options as $opt) {
            if ($opt['id'] === $method_id || $opt['method_id'] === $method_id) {
                $found = $opt;
                break;
            }
        }
        if (!$found) {
            $base = explode(':', $method_id, 2)[0];
            foreach ($options as $opt) {
                $ob = explode(':', $opt['id'], 2)[0];
                if ($ob === $base) {
                    $found = $opt;
                    break;
                }
            }
        }

        if (!$found) {
            return new \WP_Error('shipping', 'El método de envío seleccionado no es válido para esta compra.');
        }

        $decimals = function_exists('wc_get_price_decimals') ? wc_get_price_decimals() : 2;
        $data['shipping_lines'][0]['total'] = wc_format_decimal($found['cost'], $decimals);
        // Etiqueta exacta de la tarifa WC (domicilio vs sucursal Andreani, etc.) para el admin y emails
        if (!empty($found['title'])) {
            $data['shipping_lines'][0]['method_title'] = (string) $found['title'];
        }

        return $data;
    }

    /**
     * Motor compartido: tarifas WC para un CP y líneas (mismo criterio que /api/shipping/calculate).
     *
     * @param array $line_items Listas con product_id, variation_id, quantity
     * @return array|null null = WC no disponible; array vacío = sin productos válidos
     */
    private function get_shipping_options_internal($postcode, $city, $state, $country, $line_items) {
        if (!function_exists('WC') || !function_exists('wc_get_product')) {
            return null;
        }

        try {
            if (!WC()->session) {
                WC()->initialize_session();
            }
            if (!WC()->customer) {
                WC()->initialize_customer(get_current_user_id(), true);
            }
            WC()->customer->set_shipping_country($country);
            WC()->customer->set_shipping_state($state);
            WC()->customer->set_shipping_city($city);
            WC()->customer->set_shipping_postcode($postcode);
            WC()->customer->set_shipping_address('Temporal');
            WC()->customer->set_shipping_address_2('');
            WC()->customer->save();
        } catch (\Throwable $e) {
            // Continuar con el paquete manual
        }

        $contents            = array();
        $contents_cost_total = 0.0;
        foreach ($line_items as $idx => $item) {
            $product_id   = isset($item['product_id']) ? (int) $item['product_id'] : (isset($item['id']) ? (int) $item['id'] : 0);
            $variation_id = isset($item['variation_id']) ? (int) $item['variation_id'] : (isset($item['variationId']) ? (int) $item['variationId'] : 0);
            $qty          = isset($item['quantity']) ? (int) $item['quantity'] : 1;

            if ($product_id <= 0 || $qty <= 0) {
                continue;
            }

            $product = wc_get_product($variation_id > 0 ? $variation_id : $product_id);
            if (!$product) {
                continue;
            }

            $line_price = 0.0;
            try {
                $raw_price = $product->get_price();
                $line_price = is_numeric($raw_price) ? floatval($raw_price) : 0.0;
            } catch (\Throwable $e) {
                $line_price = 0.0;
            }
            $line_total = $line_price * $qty;
            $contents_cost_total += $line_total;

            $key              = $product_id . ':' . $variation_id . ':' . $idx;
            $contents[ $key ] = array(
                'data'          => $product,
                'quantity'      => $qty,
                'product_id'    => $product_id,
                'variation_id'  => $variation_id,
                'line_total'    => (string) $line_total,
                'line_subtotal' => (string) $line_total,
                'line_tax'      => '0',
            );
        }

        if (empty($contents)) {
            return array();
        }

        $package = array(
            'contents'        => $contents,
            'contents_cost'   => $contents_cost_total,
            'applied_coupons' => array(),
            'destination'     => array(
                'country'   => $country,
                'state'     => $state,
                'postcode'  => $postcode,
                'city'      => $city,
                'address'   => 'Temporal',
                'address_2' => '',
            ),
        );

        try {
            $shipping = WC()->shipping ? WC()->shipping : new \WC_Shipping();
            $shipping->calculate_shipping(array($package));
            $packages = $shipping->get_packages();

            $options = array();
            if (is_array($packages)) {
                foreach ($packages as $pkg) {
                    $pkgRates = isset($pkg['rates']) && is_array($pkg['rates']) ? $pkg['rates'] : array();
                    foreach ($pkgRates as $rate) {
                        if (!is_object($rate) || !method_exists($rate, 'get_id')) {
                            continue;
                        }
                        $id    = (string) $rate->get_id();
                        $title = (string) $rate->get_label();
                        $cost  = (float) $rate->get_cost();
                        $options[] = array(
                            'id'        => $id,
                            'method_id' => $id,
                            'title'     => $title,
                            'cost'      => $cost,
                        );
                    }
                }
            }

            return $options;
        } catch (\Throwable $e) {
            return null;
        }
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

        $postcode = preg_replace('/\D+/', '', (string) $body['postcode']);
        $city     = isset($body['city']) ? (string) $body['city'] : '';
        $state    = isset($body['state']) ? (string) $body['state'] : '';
        $country  = 'AR';

        $options = $this->get_shipping_options_internal($postcode, $city, $state, $country, $body['line_items']);
        if ($options === null) {
            $this->send_error('WooCommerce no está disponible para calcular envíos.', 503);
            return;
        }
        if (empty($options)) {
            $this->send_error('No se encontraron productos válidos para calcular el envío.', 400);
            return;
        }

        $this->send_json(array(
            'postcode' => $postcode,
            'options'  => $options,
        ));
    }
}
