<?php
/**
 * Plugin Name: Roy Riff App
 * Description: Sirve la app React de Roy Riff (tienda, carrito, checkout) y expone la API para WooCommerce en el mismo dominio.
 * Version: 1.0.0
 * Author: Roy Riff
 * Text Domain: royriff-app
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ROYRIFF_APP_VERSION', '1.0.0');
define('ROYRIFF_APP_PATH', plugin_dir_path(__FILE__));
define('ROYRIFF_APP_URL', plugin_dir_url(__FILE__));
// Slug de la página de WordPress que contiene el shortcode [royriff_app]
// Cambiado a '' para que la SPA viva en la raíz (/)
define('ROYRIFF_APP_SLUG', '');

/**
 * Mapa de metadata SEO por ruta SPA.
 * Cada entrada: title (sub-60 chars idealmente) + description (sub-160) + og_image opcional.
 * Si la ruta no está mapeada, fallback al home.
 */
function royriff_app_get_route_metadata() {
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }

    $path = isset($_SERVER['REQUEST_URI']) ? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '/';
    $path = trim($path, '/');

    $home_og_image = 'https://royriff.com.ar/og-image.webp';

    $routes = array(
        '' => array(
            'title' => 'Roy Riff | Bicicletas Eléctricas Premium en Argentina',
            'description' => 'Bicicletas eléctricas LOLA y XXXX en Argentina. Envío gratis a todo el país, financiación en cuotas y test ride en nuestro local de Yerba Buena, Tucumán.',
            'og_image' => $home_og_image,
        ),
        'local' => array(
            'title' => 'Local Roy Riff en Yerba Buena, Tucumán | Test Ride',
            'description' => 'Visitá nuestro local en Av. Aconquija 1727, Yerba Buena, Tucumán. Probá la LOLA y la XXXX antes de decidir, con turno previo. Equipo propio, parking.',
        ),
        'galeria' => array(
            'title' => 'Galería Roy Riff | Fotos LOLA, XXXX y nuestro local',
            'description' => 'Galería de fotos de Roy Riff: clientes con sus bicis eléctricas, productos LOLA y XXXX, vida de marca y eventos en Tucumán.',
        ),
        'bicicletas-electricas/lola-cruiser' => array(
            'title' => 'Roy Riff LOLA | E-Bike Urbana 500W con frenos hidráulicos',
            'description' => 'LOLA, bicicleta eléctrica urbana de Roy Riff. Motor 500W, batería 48V 10.4Ah extraíble, autonomía 40-65km, frenos hidráulicos. 100% legal sin patente.',
        ),
        'bicicletas-electricas/xxxx-expedition' => array(
            'title' => 'Roy Riff XXXX Expedition | Fat Tire 500W con 90km autonomía',
            'description' => 'XXXX Expedition, bici eléctrica fat tire de Roy Riff. 90km autonomía, batería 48V 20Ah, doble suspensión. 100% legal sin patente. Para quien va más lejos.',
        ),
        'bicicletas-electricas/comparacion-ebike-royriff' => array(
            'title' => 'LOLA vs XXXX | Compará las e-bikes de Roy Riff',
            'description' => 'Tabla comparativa entre LOLA Urban Cruiser y XXXX Expedition: autonomía, batería, suspensión, peso, precio y financiación. Elegí la que va con vos.',
        ),
        'test-ride-tucuman' => array(
            'title' => 'Test Ride Roy Riff | Probá LOLA y XXXX en Tucumán',
            'description' => 'Reservá un test ride gratis en Yerba Buena, Tucumán. Probá la LOLA o la XXXX en la calle, sin compromiso. Coordinamos por WhatsApp en 1 minuto.',
        ),
        'financiacion' => array(
            'title' => 'Financiación Roy Riff | Cuotas Bicicletas Eléctricas',
            'description' => 'Hasta 12 cuotas con Mercado Pago. Recargo transparente: 3 cuotas +11%, 6 cuotas +20%, 9 cuotas +33%, 12 cuotas +44%. Efectivo y transferencia con descuento.',
        ),
        'envios' => array(
            'title' => 'Envíos Roy Riff | Gratis a todo Argentina o retiro Palermo',
            'description' => 'Envío gratis a todo el país, 3-6 días hábiles. Llega 85-90% armada con manual y videos. Retiro en Palermo BsAs con turno previo.',
        ),
        'servicio-tecnico-y-garantia' => array(
            'title' => 'Garantía y Servicio Técnico Roy Riff | Hasta 2 años',
            'description' => '2 años de garantía en cuadro, 1 año en componentes eléctricos (motor, batería, controller, display). Repuestos en stock y servicio técnico propio.',
        ),
        'faq' => array(
            'title' => 'Preguntas Frecuentes Roy Riff | Bicicletas Eléctricas',
            'description' => 'Respuestas sobre legalidad (Decreto 196/2025), autonomía real, mantenimiento, batería, lluvia, repuestos y todo lo que necesitás saber antes de comprar.',
        ),
        'contacto' => array(
            'title' => 'Contacto Roy Riff | WhatsApp, email y showroom Tucumán',
            'description' => 'Escribinos por WhatsApp +54 381 200-6514, email postventa@royriff.com.ar o visitá el local en Yerba Buena, Tucumán. Te respondemos lo más rápido posible.',
        ),
        'tutoriales' => array(
            'title' => 'Tutoriales Roy Riff | Armado, batería, mantenimiento',
            'description' => 'Aprendé a armar tu bici eléctrica al recibirla, cuidar la batería, hacer mantenimiento básico y proteger tu Roy Riff de robos.',
        ),
        'tutoriales/armado' => array(
            'title' => 'Tutorial: Armado de tu Roy Riff al recibirla',
            'description' => 'Cómo armar tu bicicleta eléctrica Roy Riff cuando llega 85-90% pre-ensamblada. Manubrio, asiento, frenos, primer encendido y checklist final.',
        ),
        'tutoriales/bateria-y-carga' => array(
            'title' => 'Tutorial: Batería y carga de tu e-bike Roy Riff',
            'description' => 'Cómo cargar correctamente la batería de tu Roy Riff, errores frecuentes, almacenamiento, temperatura ideal y señales de batería fallando.',
        ),
        'tutoriales/mantenimiento-basico' => array(
            'title' => 'Tutorial: Mantenimiento básico Roy Riff',
            'description' => 'Inflado de ruedas, limpieza segura del cuadro, lubricación de cadena, ajuste de luces y revisiones antes de cada salida.',
        ),
        'tutoriales/seguridad-antirrobo' => array(
            'title' => 'Tutorial: Seguridad antirrobo Roy Riff',
            'description' => 'Cómo proteger tu bici eléctrica del robo. Tipos de candado, parking seguro, GPS tracker, registro de número de serie y qué hacer si te la roban.',
        ),
        'terminos-y-condiciones' => array(
            'title' => 'Términos y Condiciones | Roy Riff',
            'description' => 'Términos y condiciones de uso del sitio, compra y servicios de Roy Riff (Zohan Venture SAS).',
        ),
        'politica-de-privacidad' => array(
            'title' => 'Política de Privacidad | Roy Riff',
            'description' => 'Política de privacidad y protección de datos personales de Roy Riff (Zohan Venture SAS), conforme a la Ley 25.326.',
        ),
        'cambios-y-devoluciones' => array(
            'title' => 'Cambios y Devoluciones | Roy Riff',
            'description' => 'Política de cambios y devoluciones de Roy Riff. Derecho de arrepentimiento de 10 días según Ley 24.240 y Resolución 424/2020.',
        ),
        'boton-de-arrepentimiento' => array(
            'title' => 'Botón de Arrepentimiento | Roy Riff',
            'description' => 'Ejercé tu derecho de arrepentimiento en 10 días corridos según Art. 34 de la Ley 24.240 y Resolución 424/2020.',
        ),
    );

    // Match exacto primero
    if (isset($routes[$path])) {
        $cached = $routes[$path];
    } else {
        // Match por prefijo (ej: para rutas con slug dinámico)
        $cached = $routes[''];
        foreach ($routes as $key => $meta) {
            if ($key !== '' && strpos($path, $key) === 0) {
                $cached = $meta;
                break;
            }
        }
    }

    // Asegurar fallbacks
    if (!isset($cached['og_image'])) {
        $cached['og_image'] = $home_og_image;
    }

    return $cached;
}

/**
 * Detecta si la request actual es una ruta SPA.
 * Centraliza la lógica para evitar duplicación entre filtros y hooks.
 */
function royriff_app_is_spa_route() {
    static $is_spa = null;
    if ($is_spa !== null) {
        return $is_spa;
    }

    $path = isset($_SERVER['REQUEST_URI']) ? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '/';
    $path = trim($path, '/');

    // Excluir rutas administrativas y de API
    if ($path === '' || strpos($path, 'wp-') === 0 || strpos($path, 'api/') === 0) {
        $is_spa = ($path === '');
        return $is_spa;
    }

    $spa_prefixes = array('carrito', 'checkout', 'cart', 'bicicletas-electricas', 'financiacion',
                          'envios', 'servicio-tecnico-y-garantia', 'faq', 'test-ride-tucuman',
                          'contacto', 'tutoriales', 'compra-confirmada', 'pedido-cancelado',
                          'seguimiento', 'redireccion-pago', 'boton-de-arrepentimiento',
                          'cambios-y-devoluciones', 'terminos-y-condiciones', 'politica-de-privacidad',
                          'local', 'galeria');

    foreach ($spa_prefixes as $prefix) {
        if ($path === $prefix || strpos($path, $prefix . '/') === 0) {
            $is_spa = true;
            return $is_spa;
        }
    }

    $is_spa = false;
    return $is_spa;
}

/**
 * Title dinámico por ruta SPA (corrige el bug de duplicación 100%).
 */
add_filter('pre_get_document_title', function ($title) {
    if (royriff_app_is_spa_route() || get_query_var('royriff_spa') || is_front_page()) {
        $meta = royriff_app_get_route_metadata();
        return $meta['title'];
    }
    return $title;
}, 999);

add_filter('wp_title', function ($title) {
    if (royriff_app_is_spa_route() || get_query_var('royriff_spa') || is_front_page()) {
        $meta = royriff_app_get_route_metadata();
        return $meta['title'];
    }
    return $title;
}, 999);

/**
 * Inyectar meta description, Open Graph, Twitter Card y canonical
 * dinámicos según ruta. Resuelve el bug de que el shortcode descartaba
 * todos los meta tags del dist/index.html.
 */
add_action('wp_head', function () {
    if (!royriff_app_is_spa_route() && !is_front_page()) {
        return;
    }

    $meta = royriff_app_get_route_metadata();
    $path = isset($_SERVER['REQUEST_URI']) ? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '/';
    $canonical = 'https://' . ($_SERVER['HTTP_HOST'] ?? 'royriff.com.ar') . $path;

    $title = esc_attr($meta['title']);
    $description = esc_attr($meta['description']);
    $og_image = esc_url($meta['og_image']);
    $canonical_url = esc_url($canonical);

    echo "\n<!-- Roy Riff SEO meta tags -->\n";
    echo '<meta name="description" content="' . $description . '" />' . "\n";
    echo '<link rel="canonical" href="' . $canonical_url . '" />' . "\n";

    // Open Graph
    echo '<meta property="og:type" content="website" />' . "\n";
    echo '<meta property="og:site_name" content="Roy Riff" />' . "\n";
    echo '<meta property="og:title" content="' . $title . '" />' . "\n";
    echo '<meta property="og:description" content="' . $description . '" />' . "\n";
    echo '<meta property="og:image" content="' . $og_image . '" />' . "\n";
    echo '<meta property="og:image:width" content="1200" />' . "\n";
    echo '<meta property="og:image:height" content="630" />' . "\n";
    echo '<meta property="og:image:alt" content="Roy Riff — Bicicletas Eléctricas Premium" />' . "\n";
    echo '<meta property="og:url" content="' . $canonical_url . '" />' . "\n";
    echo '<meta property="og:locale" content="es_AR" />' . "\n";

    // Twitter / X
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo '<meta name="twitter:title" content="' . $title . '" />' . "\n";
    echo '<meta name="twitter:description" content="' . $description . '" />' . "\n";
    echo '<meta name="twitter:image" content="' . $og_image . '" />' . "\n";

    echo "<!-- /Roy Riff SEO meta tags -->\n\n";
}, 1);

/**
 * Remover el canonical default de WordPress en rutas SPA — emitimos el nuestro.
 */
remove_action('wp_head', 'rel_canonical');

/**
 * Headers de seguridad HTTP para proteger contra clickjacking, MIME sniffing, etc.
 */
add_action('send_headers', function () {
    if (headers_sent()) {
        return;
    }
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
});

/**
 * Shortcode: [royriff_app]
 * Inserta el div raíz y encola los assets del build de Vite.
 */
function royriff_app_shortcode() {
    $dist_path = ROYRIFF_APP_PATH . 'dist';
    $dist_url  = ROYRIFF_APP_URL . 'dist';

    if (!is_dir($dist_path) || !file_exists($dist_path . '/index.html')) {
        return '<!-- Roy Riff App: ejecuta "npm run build" en frontend y copia dist/ al plugin. -->';
    }

    $html = file_get_contents($dist_path . '/index.html');

    // Extraer CSS y JS del index.html generado por Vite
    $styles = array();
    $scripts = array();
    if (preg_match_all('#<link[^>]+href="([^"]+\.css)"[^>]*>#', $html, $m)) {
        $styles = $m[1];
    }
    if (preg_match_all('#<script[^>]+src="([^"]+\.js)"[^>]*>#', $html, $m)) {
        $scripts = $m[1];
    }

    // Si no hay referencias en HTML, buscar por nombre en assets/
    $assets_dir = $dist_path . '/assets';
    if (empty($scripts) && is_dir($assets_dir)) {
        $files = scandir($assets_dir);
        foreach ($files as $f) {
            if (pathinfo($f, PATHINFO_EXTENSION) === 'js') {
                $scripts[] = 'assets/' . $f;
            }
            if (pathinfo($f, PATHINFO_EXTENSION) === 'css') {
                $styles[] = 'assets/' . $f;
            }
        }
    }

    $i = 0;
    foreach ($styles as $href) {
        // Siempre servir los assets desde la carpeta del plugin.
        // Solo respetar URLs absolutas externas (http/https).
        if (strpos($href, 'http') === 0) {
            $url = $href;
        } else {
            $url = $dist_url . '/' . ltrim($href, './');
        }
        wp_enqueue_style('royriff-app-css-' . $i, $url, array(), ROYRIFF_APP_VERSION);
        $i++;
    }
    $main_handle = '';
    $j = 0;
    foreach ($scripts as $src) {
        if (strpos($src, 'http') === 0) {
            $url = $src;
        } else {
            $url = $dist_url . '/' . ltrim($src, './');
        }
        $handle = 'royriff-app-js-' . $j;
        wp_enqueue_script($handle, $url, array(), ROYRIFF_APP_VERSION, true);
        $main_handle = $handle;
        $j++;
    }
    // Base path para React Router y datos que la SPA necesita al arrancar
    if ($main_handle) {
        wp_localize_script($main_handle, 'ROYRIFF_BASE', '/');
        // Nonce de seguridad: el frontend lo envía en cada request sensible.
        // wp_create_nonce genera un token ligado a la sesión del usuario + time window (~24h).
        wp_localize_script($main_handle, 'ROYRIFF_NONCE', wp_create_nonce('royriff_api'));
    }

    return '<div id="root"></div>';
}
add_shortcode('royriff_app', 'royriff_app_shortcode');

/**
 * Reglas de reescritura:
 * - /api/* -> proxy
 * - SPA React en la raíz (/) y en cualquier ruta "limpia" (/carrito, /checkout, etc.)
 * IMPORTANTE: Con ROYRIFF_APP_SLUG = '', necesitamos obtener el ID de la página principal
 */
function royriff_app_rewrite_rules() {
    // Proxy API - PRIORIDAD MÁXIMA
    add_rewrite_rule('^api/(.*)?$', 'index.php?royriff_api=1&royriff_path=$matches[1]', 'top');

    // Obtener el ID de la página principal (front page)
    $front_page_id = get_option('page_on_front');
    
    // Si hay una página principal configurada, usar su ID
    if ($front_page_id) {
        // Verificar que la página tenga el shortcode antes de agregar las reglas
        $page = get_post($front_page_id);
        if ($page && has_shortcode($page->post_content, 'royriff_app')) {
            // Home React en la raíz "/"
            add_rewrite_rule('^$', 'index.php?page_id=' . $front_page_id . '&royriff_spa=1', 'top');
            
            // Cualquier ruta "limpia" la maneja la SPA, EXCEPTO endpoints de pago de WooCommerce
            // /checkout/order-pay/123 y /checkout/order-received/123 deben ser manejados por WooCommerce
            add_rewrite_rule('^(?!wp-admin|wp-content|wp-includes|wp-json|api|xmlrpc\.php|feed|sitemap|robots\.txt)(?!.*/order-pay/)(?!.*/order-received/)(.+)?$', 'index.php?page_id=' . $front_page_id . '&royriff_spa=1', 'top');
        }
    }
}
add_action('init', 'royriff_app_rewrite_rules');

/**
 * Interceptar rutas SPA antes de que WordPress/WooCommerce las manejen.
 * Esto asegura que /carrito, /checkout y otras rutas siempre muestren la app React.
 */
function royriff_app_intercept_spa_routes() {
    // No procesar si ya estamos manejando la API
    if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
        return;
    }
    
    $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    $parsed = parse_url($request_uri);
    $path = isset($parsed['path']) ? trim($parsed['path'], '/') : '';
    
    // No interceptar: WooCommerce debe atender order-pay (pago) y order-received (gracias)
    if (preg_match('#/order-pay/|/order-received/#', $path)) {
        return;
    }
    
    // Lista de rutas que deben ser manejadas por la SPA
    $spa_routes = array('carrito', 'checkout', 'cart', 'bicicletas-electricas', 'financiacion',
                        'envios', 'servicio-tecnico-y-garantia', 'faq', 'test-ride-tucuman',
                        'contacto', 'tutoriales', 'compra-confirmada', 'pedido-cancelado',
                        'seguimiento', 'redireccion-pago', 'boton-de-arrepentimiento',
                        'cambios-y-devoluciones', 'terminos-y-condiciones', 'politica-de-privacidad',
                        'local', 'galeria');
    
    // Verificar si la ruta actual es una ruta SPA
    $is_spa_route = false;
    if (empty($path)) {
        // Raíz - siempre es SPA si la página principal tiene el shortcode
        $is_spa_route = true;
    } else {
        // Verificar si la ruta empieza con alguna de las rutas SPA
        foreach ($spa_routes as $route) {
            if ($path === $route || strpos($path, $route . '/') === 0) {
                $is_spa_route = true;
                break;
            }
        }
    }
    
    if ($is_spa_route) {
        // Obtener el ID de la página principal
        $front_page_id = get_option('page_on_front');
        
        if ($front_page_id) {
            // Verificar que la página tenga el shortcode
            $page = get_post($front_page_id);
            if ($page && has_shortcode($page->post_content, 'royriff_app')) {
                // Forzar que WordPress use nuestra página y template
                global $wp_query;
                $wp_query->is_404 = false;
                $wp_query->is_page = true;
                $wp_query->is_singular = true;
                $wp_query->queried_object = $page;
                $wp_query->queried_object_id = $front_page_id;
                $wp_query->posts = array($page);
                $wp_query->post_count = 1;
                $wp_query->found_posts = 1;
                
                // Agregar query var para que el template lo detecte
                set_query_var('royriff_spa', '1');
                set_query_var('page_id', $front_page_id);
                
                // Prevenir que WooCommerce intercepte
                if (function_exists('wc_get_page_id')) {
                    remove_action('template_redirect', 'wc_template_redirect', 20);
                }
            }
        }
    }
}
add_action('template_redirect', 'royriff_app_intercept_spa_routes', 5); // Prioridad 5 para ejecutar después de API pero antes de otros

function royriff_app_query_vars($vars) {
    $vars[] = 'royriff_api';
    $vars[] = 'royriff_path';
    $vars[] = 'royriff_spa';
    $vars[] = 'page_id'; // Necesario para las rewrite rules con page_id
    return $vars;
}
add_filter('query_vars', 'royriff_app_query_vars');

/**
 * Servir archivos estáticos (fuentes, imágenes) desde la carpeta dist del plugin.
 * Esto permite que las rutas /tienda/fonts/ y /tienda/images/ funcionen correctamente.
 */
function royriff_app_serve_static_assets() {
    // Solo procesar si estamos en una ruta que empieza con /tienda/fonts/ o /tienda/images/
    $request_uri = $_SERVER['REQUEST_URI'];
    $parsed = parse_url($request_uri);
    $path = isset($parsed['path']) ? trim($parsed['path'], '/') : '';
    
    // Verificar si es una ruta de assets estáticos (ahora en la raíz)
    // Las rutas pueden ser /fonts/... o /images/... directamente
    if (preg_match('#^(fonts|images)/(.+)$#', $path, $matches)) {
        $asset_type = $matches[1]; // 'fonts' o 'images'
        $asset_rel  = str_replace('\\', '/', $matches[2]);
        if ($asset_rel === '' || strpos($asset_rel, '..') !== false || strpos($asset_rel, "\0") !== false) {
            return;
        }
        $base_dir = realpath(ROYRIFF_APP_PATH . 'dist/' . $asset_type);
        if ($base_dir === false) {
            return;
        }
        $file_path = realpath($base_dir . DIRECTORY_SEPARATOR . $asset_rel);
        if ($file_path === false || strpos($file_path, $base_dir) !== 0) {
            return;
        }
        if (is_file($file_path)) {
            // Determinar el tipo MIME según la extensión
            $ext = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
            $mime_types = array(
                'otf' => 'font/otf',
                'ttf' => 'font/ttf',
                'woff' => 'font/woff',
                'woff2' => 'font/woff2',
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
            );
            
            $mime_type = isset($mime_types[$ext]) ? $mime_types[$ext] : 'application/octet-stream';
            
            // Enviar el archivo
            header('Content-Type: ' . $mime_type);
            header('Content-Length: ' . filesize($file_path));
            header('Cache-Control: public, max-age=31536000'); // Cache por 1 año
            readfile($file_path);
            exit;
        }
    }
}
add_action('template_redirect', 'royriff_app_serve_static_assets', 0);

/**
 * Template personalizado para la página principal: solo muestra el contenido sin header/footer.
 * También funciona para todas las rutas de la SPA (carrito, checkout, etc.).
 */
function royriff_app_page_template($template) {
    // Verificar si hay parámetro royriff_spa
    $is_spa_route = get_query_var('royriff_spa');
    
    // Verificar si estamos accediendo por page_id
    $page_id = get_query_var('page_id');
    
    // Verificar si estamos en la página principal
    $is_front_page = is_front_page();
    
    // Obtener el ID de la página principal
    $front_page_id = get_option('page_on_front');
    
    // Determinar si debemos usar el template SPA
    $use_spa_template = false;
    
    if ($is_spa_route || $page_id) {
        // Si tenemos el query var o page_id, usar el template SPA
        $use_spa_template = true;
    } elseif ($is_front_page && $front_page_id) {
        // Si es la página principal, verificar que tenga el shortcode
        $page = get_post($front_page_id);
        if ($page && has_shortcode($page->post_content, 'royriff_app')) {
            $use_spa_template = true;
        }
    } elseif ($front_page_id) {
        // Verificar si la página actual es la página principal con shortcode
        global $post;
        if ($post && $post->ID == $front_page_id && has_shortcode($post->post_content, 'royriff_app')) {
            $use_spa_template = true;
        }
    }
    
    if ($use_spa_template) {
        $custom_template = ROYRIFF_APP_PATH . 'templates/page-solo-app.php';
        if (file_exists($custom_template)) {
            return $custom_template;
        }
    }
    
    return $template;
}
add_filter('page_template', 'royriff_app_page_template', 999); // Prioridad alta para sobrescribir otros templates

/**
 * Cuando el usuario cancela una orden desde /checkout/order-pay/..., WooCommerce suele
 * redirigir a /cart/?cancel_order=... (página Cart del theme).
 * Para mantener la experiencia 100% en React, redirigimos a /carrito.
 */
function royriff_app_redirect_cancel_order_to_spa() {
    // Solo si WooCommerce está activo
    if (!function_exists('is_cart')) {
        return;
    }
    // El link de cancelar orden suele caer en /cart con cancel_order=true
    if (!is_cart() || !isset($_GET['cancel_order'])) {
        return;
    }

    $target = home_url('/carrito');
    $target = add_query_arg(array('order_cancelled' => '1'), $target);
    wp_safe_redirect($target, 302);
    exit;
}
add_action('template_redirect', 'royriff_app_redirect_cancel_order_to_spa', 2);

/**
 * Atender peticiones /api/* y devolver JSON (proxy a WooCommerce).
 * PRIORIDAD ALTA para interceptar antes que otros plugins.
 */
function royriff_app_handle_api() {
    // Verificar directamente desde REQUEST_URI para evitar problemas con query vars
    $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    
    // Si la URL contiene /api/, procesarla
    if (strpos($request_uri, '/api/') !== false) {
        $parsed = parse_url($request_uri);
        $path = isset($parsed['path']) ? $parsed['path'] : '';
        
        // Extraer la ruta después de /api/
        if (preg_match('#/api/(.*)$#', $path, $matches)) {
            $api_path = trim($matches[1], '/');
            
            require_once ROYRIFF_APP_PATH . 'includes/class-royriff-api.php';
            $api = new RoyRiff_API();
            $api->dispatch($api_path);
            exit;
        }
    }
    
    // También verificar query vars (fallback)
    $is_api = get_query_var('royriff_api');
    if ($is_api) {
        $path = get_query_var('royriff_path') ?: '';
        $path = trim($path, '/');

        require_once ROYRIFF_APP_PATH . 'includes/class-royriff-api.php';
        $api = new RoyRiff_API();
        $api->dispatch($path);
        exit;
    }
}
add_action('template_redirect', 'royriff_app_handle_api', 0); // Prioridad 0 para ejecutar primero

/**
 * Al activar, flush rewrite rules.
 */
function royriff_app_activate() {
    royriff_app_rewrite_rules();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'royriff_app_activate');

function royriff_app_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'royriff_app_deactivate');

/**
 * Página de ajustes: claves API WooCommerce
 */
function royriff_app_add_settings_page() {
    add_options_page(
        'Roy Riff App',
        'Roy Riff App',
        'manage_options',
        'royriff-app',
        'royriff_app_render_settings_page'
    );
}
add_action('admin_menu', 'royriff_app_add_settings_page');

function royriff_app_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    if (isset($_POST['royriff_save_api']) && check_admin_referer('royriff_app_settings')) {
        update_option('royriff_wc_consumer_key', sanitize_text_field($_POST['royriff_wc_ck'] ?? ''));
        update_option('royriff_wc_consumer_secret', sanitize_text_field($_POST['royriff_wc_cs'] ?? ''));
        echo '<div class="notice notice-success"><p>Guardado.</p></div>';
    }
    $ck = get_option('royriff_wc_consumer_key', '');
    $cs = get_option('royriff_wc_consumer_secret', '');
    ?>
    <div class="wrap">
        <h1>Roy Riff App</h1>
        <p>Configura la página principal de WordPress (Ajustes → Lectura) con el shortcode <code>[royriff_app]</code>. Para que la API funcione, configura las claves de WooCommerce (WooCommerce → Ajustes → Avanzado → API REST).</p>
        <form method="post">
            <?php wp_nonce_field('royriff_app_settings'); ?>
            <table class="form-table">
                <tr>
                    <th><label for="royriff_wc_ck">Consumer key</label></th>
                    <td><input type="text" id="royriff_wc_ck" name="royriff_wc_ck" value="<?php echo esc_attr($ck); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="royriff_wc_cs">Consumer secret</label></th>
                    <td><input type="password" id="royriff_wc_cs" name="royriff_wc_cs" value="<?php echo esc_attr($cs); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <p class="submit"><input type="submit" name="royriff_save_api" class="button button-primary" value="Guardar" /></p>
        </form>
    </div>
    <?php
}

/**
 * Asegurar que WooCommerce envíe emails cuando se crea una orden con transferencia bancaria
 * Esto es necesario porque WooCommerce solo envía emails automáticamente cuando cambia el estado
 */
function royriff_app_send_order_email_on_creation($order_id, $order = null) {
    // Si no se pasa el objeto order, obtenerlo
    if (!$order) {
        $order = wc_get_order($order_id);
    }
    
    if (!$order) {
        return;
    }
    
    // Solo enviar email si la orden está en estado "on-hold" (transferencia bancaria)
    if ($order->get_status() === 'on-hold') {
        // Forzar el envío del email de "orden en espera de pago"
        $mailer = WC()->mailer();
        $emails = $mailer->get_emails();
        
        // Buscar el email de "on-hold"
        foreach ($emails as $email) {
            if ($email->id === 'customer_on_hold_order') {
                $email->trigger($order_id);
                break;
            }
        }
    }
}
// Usar múltiples hooks para asegurar que se ejecute
add_action('woocommerce_checkout_order_processed', 'royriff_app_send_order_email_on_creation', 20, 2);
add_action('woocommerce_order_status_on-hold', 'royriff_app_send_order_email_on_creation', 10, 1);

/**
 * Redirigir después del pago exitoso de Mercado Pago a React
 */
function royriff_app_redirect_after_payment($order_id) {
    if (!$order_id) return;
    
    // Solo ejecutar en la página de thankyou, no en otras partes
    if (!is_checkout() || !is_wc_endpoint_url('order-received')) {
        return;
    }
    
    $order = wc_get_order($order_id);
    if (!$order) return;
    
    // Solo redirigir si el pago fue exitoso y venimos de React
    if (in_array($order->get_status(), array('processing', 'completed', 'on-hold'))) {
        // Verificar si hay una URL de retorno guardada en meta_data
        $return_url = $order->get_meta('_react_return_url');
        
        if ($return_url) {
            // Agregar order_id y order_key a la URL
            $separator = strpos($return_url, '?') !== false ? '&' : '?';
            $redirect_url = $return_url . $separator . 'order_id=' . $order_id . '&order_key=' . $order->get_order_key();
            
            wp_safe_redirect($redirect_url);
            exit;
        } else {
            // Si no hay URL de retorno configurada, usar la URL por defecto de React
            $frontend_url = get_option('royriff_frontend_url', home_url());
            $redirect_url = $frontend_url . '/compra-confirmada?order_id=' . $order_id . '&order_key=' . $order->get_order_key();
            
            wp_safe_redirect($redirect_url);
            exit;
        }
    }
}
add_action('woocommerce_thankyou', 'royriff_app_redirect_after_payment', 10, 1);
