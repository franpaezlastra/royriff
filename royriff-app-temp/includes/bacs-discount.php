<?php
/**
 * Roy Riff — Descuento automático para pago con Transferencia Bancaria (BACS)
 *
 * Modelo de negocio:
 * - Mercado Pago: precio de lista, hasta 6 cuotas sin interés (Roy Riff absorbe el costo).
 * - Transferencia bancaria: descuento fijo por producto (Roy Riff ahorra comisiones MP y lo
 *   traslada al cliente).
 *
 * Implementación:
 * 1. Lookup table de descuentos por product_id (o slug). Si la variación pertenece a un
 *    producto con descuento configurado, se aplica el descuento del producto padre.
 * 2. Hook `woocommerce_cart_calculate_fees`: si el método de pago elegido es `bacs`,
 *    aplica un fee negativo equivalente al descuento total de los items del carrito.
 * 3. Hook AJAX para refrescar el carrito cuando el cliente cambia de método de pago.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Mapa de descuentos en pesos por SLUG del producto padre.
 * Mantener sincronizado con frontend/src/utils/productData.js (campo `pricing.ahorro`).
 *
 * Para agregar un producto nuevo: subir el slug + descuento acá y hacer el cambio
 * coherente en productData.js. Sin estas dos líneas, no hay descuento en BACS.
 */
function royriff_app_get_bacs_discount_map() {
    return array(
        'lola-cruiser'    => 412000, // LOLA: $2.412.000 lista → $2.000.000 transferencia
        'xxxx-expedition' => 517000, // XXXX: $3.217.000 lista → $2.700.000 transferencia
    );
}

/**
 * Devuelve el descuento BACS aplicable para un producto dado su ID (o variation_id).
 * Si el item es una variación, busca el descuento del padre.
 */
function royriff_app_get_bacs_discount_for_product($product_id) {
    if (!$product_id) return 0;

    $product = wc_get_product($product_id);
    if (!$product) return 0;

    // Si es variación, usar el slug del producto padre.
    $parent_id = $product->is_type('variation') ? $product->get_parent_id() : $product->get_id();
    $parent = wc_get_product($parent_id);
    if (!$parent) return 0;

    $slug = $parent->get_slug();
    $map = royriff_app_get_bacs_discount_map();
    return isset($map[$slug]) ? (int) $map[$slug] : 0;
}

/**
 * Calcula el descuento BACS total.
 *
 * Modo cart (sin parámetro): suma desde WC()->cart. Sirve para el hook
 * `woocommerce_cart_calculate_fees` durante el checkout NORMAL de WC.
 *
 * Modo REST (con line_items): suma desde el payload del create-order. Sirve para
 * cuando la orden se crea via WC REST API (POST /wc/v3/orders desde el SPA),
 * donde NO existe WC()->cart porque el contexto es REST, no checkout.
 *
 * @param array|null $line_items  Si se pasa, calcula desde este array.
 *                                Cada item: ['product_id' => int, 'variation_id' => int, 'quantity' => int]
 * @return int Descuento total en pesos (positivo, listo para usar como fee negativo)
 */
function royriff_app_calculate_total_bacs_discount($line_items = null) {
    // Modo REST: calcular desde el payload del create-order
    if ($line_items !== null && is_array($line_items)) {
        $total = 0;
        foreach ($line_items as $li) {
            if (!is_array($li)) continue;
            $product_id = !empty($li['variation_id']) ? (int) $li['variation_id'] : (int) ($li['product_id'] ?? 0);
            $quantity = max(1, (int) ($li['quantity'] ?? 1));
            $discount = royriff_app_get_bacs_discount_for_product($product_id);
            $total += $discount * $quantity;
        }
        return $total;
    }

    // Modo cart: legacy (hook woocommerce_cart_calculate_fees)
    if (!function_exists('WC') || !WC()->cart) return 0;

    $total = 0;
    foreach (WC()->cart->get_cart() as $cart_item) {
        $product_id = !empty($cart_item['variation_id']) ? $cart_item['variation_id'] : $cart_item['product_id'];
        $quantity = (int) ($cart_item['quantity'] ?? 1);
        $discount = royriff_app_get_bacs_discount_for_product($product_id);
        $total += $discount * $quantity;
    }
    return $total;
}

/**
 * Aplica el descuento BACS como fee negativo cuando el método de pago elegido es 'bacs'.
 */
add_action('woocommerce_cart_calculate_fees', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;
    if (!function_exists('WC') || !WC()->session) return;

    $chosen = WC()->session->get('chosen_payment_method');
    if ($chosen !== 'bacs') return;

    $discount = royriff_app_calculate_total_bacs_discount();
    if ($discount > 0) {
        $cart->add_fee(__('Descuento por transferencia bancaria', 'royriff-app'), -$discount, false);
    }
}, 20, 1);

/**
 * Refrescar el carrito al cambiar el método de pago en el checkout.
 * Sin esto, el descuento no se actualiza en pantalla hasta recargar.
 */
add_action('woocommerce_review_order_before_payment', function () {
    ?>
    <script>
    (function ($) {
        if (typeof $ === 'undefined') return;
        $(document.body).on('change', 'input[name="payment_method"]', function () {
            $('body').trigger('update_checkout');
        });
    })(jQuery);
    </script>
    <?php
});

/**
 * Endpoint REST: devuelve el descuento BACS de un producto/variación dado.
 * Útil para que el frontend React muestre el ahorro al elegir BACS sin necesidad
 * de recalcular el carrito completo.
 *
 * GET /api/bacs-discount?product_id=123 o ?slug=lola-cruiser
 */
add_action('rest_api_init', function () {
    register_rest_route('royriff/v1', '/bacs-discount', array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function ($request) {
            $slug = $request->get_param('slug');
            $product_id = (int) $request->get_param('product_id');

            if ($slug) {
                $map = royriff_app_get_bacs_discount_map();
                $discount = isset($map[$slug]) ? (int) $map[$slug] : 0;
                return rest_ensure_response(array('slug' => $slug, 'discount' => $discount));
            }

            if ($product_id) {
                $discount = royriff_app_get_bacs_discount_for_product($product_id);
                return rest_ensure_response(array('product_id' => $product_id, 'discount' => $discount));
            }

            return rest_ensure_response(array('map' => royriff_app_get_bacs_discount_map()));
        },
    ));
});
