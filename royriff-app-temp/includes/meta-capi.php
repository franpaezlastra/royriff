<?php
/**
 * Roy Riff — Meta Conversions API (CAPI) server-side
 *
 * Endpoint REST que recibe eventos del frontend (con event_id para deduplicación)
 * y los reenvía a Meta CAPI con datos enriquecidos del servidor:
 * - IP del cliente, User-Agent
 * - Cookies _fbp y _fbc (para match con Pixel)
 * - Email/teléfono hasheados si vienen en custom_data (Advanced Matching)
 *
 * Beneficio principal: tracking robusto frente a iOS 14.5+ ITP, ad blockers,
 * y pérdida de datos en client-side. Cada evento de Pixel lleva un `eventID`
 * único; CAPI lo usa para deduplicar (no contar 2 veces).
 *
 * Configuración requerida:
 * - WP Admin → Roy Riff → Meta CAPI: pegar PIXEL_ID + ACCESS_TOKEN
 *   (token se genera en Meta Business Manager → Eventos → Configuración → CAPI)
 *
 * Si falta el token, el endpoint NO falla — solo loguea y devuelve 200.
 * El frontend nunca recibe error.
 *
 * Hooks:
 * - rest_api_init: registra el endpoint POST /api/meta-capi
 * - admin_menu: registra la página de settings
 * - woocommerce_thankyou: dispara Purchase server-side cuando WC marca la
 *   orden como completada (backup de Purchase del frontend, dedupliсated por
 *   event_id que ambos usan).
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Devuelve la config de CAPI desde WP options. Falsy si no está configurada. */
function royriff_capi_get_config() {
    return array(
        'pixel_id'     => trim((string) get_option('royriff_capi_pixel_id', '1519762895900566')),
        'access_token' => trim((string) get_option('royriff_capi_access_token', '')),
        'enabled'      => (bool) get_option('royriff_capi_enabled', false),
        'test_code'    => trim((string) get_option('royriff_capi_test_code', '')),
    );
}

/** Hashea con SHA-256 (formato esperado por Meta para Advanced Matching). */
function royriff_capi_hash($value) {
    if (empty($value)) return null;
    return hash('sha256', strtolower(trim((string) $value)));
}

/**
 * Construye el `user_data` que va al payload CAPI.
 * Combina datos del request HTTP (IP, UA, cookies) con cualquier
 * email/phone que el cliente haya enviado en custom_data.
 */
function royriff_capi_build_user_data($req_user_data) {
    $user_data = array();

    // Cookies de Pixel
    if (!empty($_COOKIE['_fbp'])) {
        $user_data['fbp'] = sanitize_text_field(wp_unslash($_COOKIE['_fbp']));
    }
    if (!empty($_COOKIE['_fbc'])) {
        $user_data['fbc'] = sanitize_text_field(wp_unslash($_COOKIE['_fbc']));
    }

    // IP cliente
    $ip = '';
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = sanitize_text_field(wp_unslash($_SERVER['HTTP_CF_CONNECTING_IP']));
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $forwarded = sanitize_text_field(wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']));
        $parts = explode(',', $forwarded);
        $ip = trim($parts[0]);
    } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
        $ip = sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR']));
    }
    if (!empty($ip)) {
        $user_data['client_ip_address'] = $ip;
    }

    // User-Agent
    if (!empty($_SERVER['HTTP_USER_AGENT'])) {
        $user_data['client_user_agent'] = sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT']));
    }

    // Datos de Advanced Matching (hash SHA-256)
    if (!empty($req_user_data['email'])) {
        $user_data['em'] = array(royriff_capi_hash($req_user_data['email']));
    }
    if (!empty($req_user_data['phone'])) {
        // Normalizar teléfono AR: quitar todo lo no numérico
        $phone = preg_replace('/\D+/', '', (string) $req_user_data['phone']);
        if (!empty($phone)) {
            $user_data['ph'] = array(royriff_capi_hash($phone));
        }
    }
    if (!empty($req_user_data['first_name'])) {
        $user_data['fn'] = array(royriff_capi_hash($req_user_data['first_name']));
    }
    if (!empty($req_user_data['last_name'])) {
        $user_data['ln'] = array(royriff_capi_hash($req_user_data['last_name']));
    }
    if (!empty($req_user_data['external_id'])) {
        $user_data['external_id'] = array(royriff_capi_hash($req_user_data['external_id']));
    }

    return $user_data;
}

/**
 * Envía el evento a Meta CAPI (POST a graph.facebook.com).
 * Devuelve true si Meta respondió 200, false en otro caso.
 */
function royriff_capi_send_event($event_data) {
    $cfg = royriff_capi_get_config();
    if (!$cfg['enabled'] || empty($cfg['pixel_id']) || empty($cfg['access_token'])) {
        // CAPI no configurado — no es error, solo no se envía.
        return false;
    }

    $url = sprintf(
        'https://graph.facebook.com/v18.0/%s/events?access_token=%s',
        rawurlencode($cfg['pixel_id']),
        rawurlencode($cfg['access_token'])
    );

    $payload = array('data' => array($event_data));
    if (!empty($cfg['test_code'])) {
        $payload['test_event_code'] = $cfg['test_code'];
    }

    $response = wp_remote_post($url, array(
        'timeout' => 5,
        'headers' => array('Content-Type' => 'application/json'),
        'body'    => wp_json_encode($payload),
    ));

    if (is_wp_error($response)) {
        error_log('[Roy Riff CAPI] WP_Error: ' . $response->get_error_message());
        return false;
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code < 200 || $code >= 300) {
        error_log('[Roy Riff CAPI] HTTP ' . $code . ': ' . wp_remote_retrieve_body($response));
        return false;
    }

    return true;
}

/**
 * Handler del endpoint POST /api/meta-capi
 * Lo invoca class-royriff-api.php cuando el path coincide con 'meta-capi'.
 *
 * @param array $body payload decodificado del request
 * @return array respuesta JSON-ready
 */
function royriff_capi_handle_event_request($body) {
    if (!is_array($body)) {
        return array('ok' => true, 'skipped' => 'invalid_body');
    }

    $event_name = isset($body['event_name']) ? sanitize_text_field($body['event_name']) : '';
    if (empty($event_name)) {
        return array('ok' => true, 'skipped' => 'no_event_name');
    }

    $event = array(
        'event_name'       => $event_name,
        'event_time'       => isset($body['event_time']) ? (int) $body['event_time'] : time(),
        'event_id'         => isset($body['event_id']) ? sanitize_text_field($body['event_id']) : null,
        'action_source'    => isset($body['action_source']) ? sanitize_text_field($body['action_source']) : 'website',
        'event_source_url' => isset($body['event_source_url']) ? esc_url_raw($body['event_source_url']) : home_url('/'),
        'user_data'        => royriff_capi_build_user_data($body['user_data'] ?? array()),
        'custom_data'      => is_array($body['custom_data'] ?? null) ? $body['custom_data'] : array(),
    );

    $sent = royriff_capi_send_event($event);
    return array('ok' => true, 'sent' => $sent);
}

/**
 * Backup server-side: cuando WC procesa una orden (status processing/completed),
 * disparar Purchase a CAPI con los datos completos de la orden.
 *
 * Esto cubre el caso donde el frontend no logró disparar el evento (ej: cliente
 * cerró el browser después del pago MP). El event_id se basa en el order_id
 * para que coincida con el del frontend si ambos disparan.
 */
add_action('woocommerce_thankyou', 'royriff_capi_on_order_thankyou', 20, 1);
function royriff_capi_on_order_thankyou($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Solo disparar si la orden ya está pagada o procesando
    $status = $order->get_status();
    if (!in_array($status, array('processing', 'completed', 'on-hold'), true)) return;

    // Evitar doble envío
    if ($order->get_meta('_royriff_capi_purchase_sent')) return;

    $line_items = array();
    $content_ids = array();
    $content_names = array();
    $num_items = 0;
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        if ($product) {
            $content_ids[] = $product->get_slug();
            $content_names[] = $product->get_name();
        }
        $num_items += $item->get_quantity();
    }

    $event = array(
        'event_name'       => 'Purchase',
        'event_time'       => time(),
        'event_id'         => 'order-' . $order_id . '-purchase',
        'action_source'    => 'website',
        'event_source_url' => $order->get_checkout_order_received_url(),
        'user_data'        => royriff_capi_build_user_data(array(
            'email'      => $order->get_billing_email(),
            'phone'      => $order->get_billing_phone(),
            'first_name' => $order->get_billing_first_name(),
            'last_name'  => $order->get_billing_last_name(),
            'external_id'=> $order_id,
        )),
        'custom_data' => array(
            'currency'     => $order->get_currency(),
            'value'        => (float) $order->get_total(),
            'content_ids'  => $content_ids,
            'content_name' => implode(' + ', array_filter($content_names)),
            'content_type' => 'product',
            'num_items'    => $num_items,
            'order_id'     => (string) $order_id,
        ),
    );

    if (royriff_capi_send_event($event)) {
        $order->update_meta_data('_royriff_capi_purchase_sent', current_time('mysql'));
        $order->save();
    }
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Settings page: WP Admin → Roy Riff → Meta CAPI
 * Guarda Pixel ID, Access Token y test_event_code en wp_options.
 * ──────────────────────────────────────────────────────────────────────────────
 */
add_action('admin_menu', function () {
    add_menu_page(
        'Roy Riff',
        'Roy Riff',
        'manage_options',
        'royriff-settings',
        'royriff_capi_settings_page',
        'dashicons-store',
        58
    );
    add_submenu_page(
        'royriff-settings',
        'Meta CAPI',
        'Meta CAPI',
        'manage_options',
        'royriff-meta-capi',
        'royriff_capi_settings_page'
    );
});

function royriff_capi_settings_page() {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['royriff_capi_save'])) {
        check_admin_referer('royriff_capi_save_nonce');
        update_option('royriff_capi_pixel_id', sanitize_text_field(wp_unslash($_POST['royriff_capi_pixel_id'] ?? '')));
        update_option('royriff_capi_access_token', sanitize_text_field(wp_unslash($_POST['royriff_capi_access_token'] ?? '')));
        update_option('royriff_capi_enabled', isset($_POST['royriff_capi_enabled']) ? 1 : 0);
        update_option('royriff_capi_test_code', sanitize_text_field(wp_unslash($_POST['royriff_capi_test_code'] ?? '')));
        echo '<div class="notice notice-success"><p>Configuración guardada.</p></div>';
    }

    $cfg = royriff_capi_get_config();
    ?>
    <div class="wrap">
        <h1>Roy Riff · Meta Conversions API</h1>
        <p>Configuración del envío server-side de eventos a Meta. Permite que el tracking sobreviva a ITP de iOS 14.5+, ad blockers y pérdida de datos client-side.</p>

        <form method="post" action="">
            <?php wp_nonce_field('royriff_capi_save_nonce'); ?>

            <table class="form-table">
                <tr>
                    <th scope="row"><label for="royriff_capi_enabled">Activar CAPI</label></th>
                    <td>
                        <input type="checkbox" id="royriff_capi_enabled" name="royriff_capi_enabled" value="1" <?php checked($cfg['enabled']); ?>>
                        <p class="description">Activar para que los eventos se envíen a Meta CAPI. Si no está activado, solo se trackea client-side via Pixel.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="royriff_capi_pixel_id">Pixel ID</label></th>
                    <td>
                        <input type="text" id="royriff_capi_pixel_id" name="royriff_capi_pixel_id" value="<?php echo esc_attr($cfg['pixel_id']); ?>" class="regular-text">
                        <p class="description">El ID del Pixel de Meta. Se obtiene en Meta Business Manager → Eventos.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="royriff_capi_access_token">Access Token</label></th>
                    <td>
                        <input type="password" id="royriff_capi_access_token" name="royriff_capi_access_token" value="<?php echo esc_attr($cfg['access_token']); ?>" class="large-text">
                        <p class="description">Token de larga duración. Generar en Meta Business Manager → Eventos → Pixel → Configuración → "Generate access token".</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="royriff_capi_test_code">Test Event Code (opcional)</label></th>
                    <td>
                        <input type="text" id="royriff_capi_test_code" name="royriff_capi_test_code" value="<?php echo esc_attr($cfg['test_code']); ?>" class="regular-text" placeholder="TEST12345">
                        <p class="description">Para testing en Meta Business Manager → Test Events. Se obtiene ahí mismo. Vaciar cuando vayas a producción.</p>
                    </td>
                </tr>
            </table>

            <p>
                <input type="submit" name="royriff_capi_save" class="button button-primary" value="Guardar configuración">
            </p>
        </form>

        <h2>Estado actual</h2>
        <ul>
            <li><strong>CAPI activado:</strong> <?php echo $cfg['enabled'] ? 'Sí' : 'No (solo Pixel client-side)'; ?></li>
            <li><strong>Pixel ID:</strong> <?php echo esc_html($cfg['pixel_id'] ?: 'no configurado'); ?></li>
            <li><strong>Access Token:</strong> <?php echo $cfg['access_token'] ? 'configurado (***' . esc_html(substr($cfg['access_token'], -4)) . ')' : 'no configurado'; ?></li>
            <li><strong>Test code:</strong> <?php echo $cfg['test_code'] ? esc_html($cfg['test_code']) . ' (modo test)' : 'sin test code (modo producción)'; ?></li>
        </ul>

        <h2>Cómo verificar</h2>
        <ol>
            <li>Activá CAPI con un test_event_code</li>
            <li>En Meta Business Manager → Eventos → Pixel → tab <strong>Test Events</strong> → pegar test_event_code</li>
            <li>Hacé un test del funnel en royriff.com.ar (PageView → ViewContent → AddToCart → InitiateCheckout → Purchase)</li>
            <li>Los eventos deberían aparecer en Test Events tanto desde el Pixel (Browser) como desde CAPI (Server)</li>
            <li>Si los event_id coinciden entre Pixel y CAPI, Meta los deduplicará automáticamente y solo cuenta 1</li>
        </ol>
    </div>
    <?php
}
