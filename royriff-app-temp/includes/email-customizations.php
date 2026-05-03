<?php
/**
 * Roy Riff — Personalización de emails post-pedido
 *
 * Este módulo enriquece los emails que envía WooCommerce con bloques específicos
 * de Roy Riff. NO reemplaza templates (eso generaría deuda técnica con cada
 * update de WC). Usa hooks oficiales para inyectar HTML en lugares específicos.
 *
 * Hooks principales:
 * - woocommerce_email_after_order_table → inyecta bloques custom (datos bancarios,
 *   CTA WhatsApp, "mientras esperamos") solo en email customer_on_hold_order (BACS).
 * - woocommerce_email_footer_text → reemplaza el footer default por uno Roy Riff.
 *
 * Restricciones técnicas (ver:
 * https://www.litmus.com/blog/the-ultimate-guide-to-css):
 * - Usar tablas HTML (no flex/grid)
 * - CSS inline o <style> en el head
 * - URLs absolutas en imágenes
 * - Sin JS
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Datos bancarios de Roy Riff (Zohan Venture SAS).
 * Mantener sincronizado con plan original / docs.
 */
function royriff_email_get_bank_details() {
    return array(
        'razon_social' => 'ZOHAN VENTURE SAS',
        'cuit'         => '33-71884288-9',
        'banco'        => 'Banco Macro S.A.',
        'sucursal'     => '140 — Maipú',
        'tipo_cuenta'  => 'Cuenta Corriente',
        'numero'       => '314009424394490',
        'cbu'          => '2850140230094243944901',
        'alias'        => 'GERMEN.BONANZA.FOCO',
    );
}

/**
 * Inyectar bloques personalizados después de la tabla del pedido.
 * Solo se ejecuta para el email "customer_on_hold_order" (Pedido en espera, BACS).
 */
add_action('woocommerce_email_after_order_table', 'royriff_email_after_order_table_bacs', 10, 4);
function royriff_email_after_order_table_bacs($order, $sent_to_admin, $plain_text, $email) {
    if (!$email || $email->id !== 'customer_on_hold_order') return;
    if ($plain_text) return; // versión texto plano: no inyectamos HTML
    if (!$order || !is_a($order, 'WC_Order')) return;

    $bank = royriff_email_get_bank_details();
    $order_id = $order->get_id();
    $order_number = $order->get_order_number();
    $total = $order->get_total();
    $total_formatted = wp_strip_all_tags(wc_price($total, array('currency' => $order->get_currency())));

    // Mensaje pre-cargado para WhatsApp (URL-encoded)
    $wa_message = sprintf(
        'Hola! Adjunto el comprobante de transferencia del pedido #%s por %s',
        $order_number,
        $total_formatted
    );
    $wa_link = 'https://wa.me/5493812006514?text=' . rawurlencode($wa_message);

    $orange = '#FF460D';
    $beige = '#FCF8F5';
    $green_wa = '#25D366';
    $dark = '#151515';
    $gray_light = '#E5E2DD';
    ?>

    <!-- Roy Riff: Bloque datos bancarios -->
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:24px 0 0 0;">
      <tr>
        <td style="background:<?php echo esc_attr($beige); ?>; border:2px solid <?php echo esc_attr($orange); ?>; border-radius:8px; padding:24px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:bold; color:<?php echo esc_attr($orange); ?>; letter-spacing:1.5px; text-transform:uppercase; padding-bottom:8px;">
                📋 Datos para la transferencia
              </td>
            </tr>
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:<?php echo esc_attr($dark); ?>; line-height:1.7;">
                <strong>Banco:</strong> <?php echo esc_html($bank['banco']); ?> · Sucursal <?php echo esc_html($bank['sucursal']); ?><br>
                <strong>Tipo de cuenta:</strong> <?php echo esc_html($bank['tipo_cuenta']); ?><br>
                <strong>N° de cuenta:</strong> <?php echo esc_html($bank['numero']); ?><br>
                <strong>CBU:</strong> <span style="font-family:'Courier New',monospace; font-size:14px; background:#fff; padding:2px 6px; border-radius:3px;"><?php echo esc_html($bank['cbu']); ?></span><br>
                <strong>Alias:</strong> <span style="font-family:'Courier New',monospace; font-size:14px; background:#fff; padding:2px 6px; border-radius:3px;"><?php echo esc_html($bank['alias']); ?></span><br>
                <strong>Titular:</strong> <?php echo esc_html($bank['razon_social']); ?> · CUIT <?php echo esc_html($bank['cuit']); ?>
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px; border-top:1px dashed <?php echo esc_attr($gray_light); ?>; margin-top:12px;">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:<?php echo esc_attr($dark); ?>;">
                      Monto a transferir:
                    </td>
                    <td align="right" style="font-family:Arial,Helvetica,sans-serif; font-size:20px; font-weight:bold; color:<?php echo esc_attr($orange); ?>;">
                      <?php echo wp_kses_post(wc_price($total, array('currency' => $order->get_currency()))); ?>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Roy Riff: CTA WhatsApp -->
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:24px 0 0 0;">
      <tr>
        <td align="center" style="padding:24px 0; background:#F0FDF4; border-radius:8px;">
          <p style="font-family:Arial,Helvetica,sans-serif; font-size:14px; color:<?php echo esc_attr($dark); ?>; margin:0 0 14px 0;">
            <strong>Después de hacer la transferencia</strong><br>
            <span style="font-size:13px; color:#3D5A4A;">Mandanos el comprobante por WhatsApp para acelerar la confirmación de tu pedido.</span>
          </p>
          <table cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
              <td bgcolor="<?php echo esc_attr($green_wa); ?>" style="border-radius:6px;">
                <a href="<?php echo esc_url($wa_link); ?>" target="_blank" style="display:inline-block; padding:14px 28px; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:#ffffff; text-decoration:none; letter-spacing:0.5px; text-transform:uppercase;">
                  📱 Enviar comprobante por WhatsApp
                </a>
              </td>
            </tr>
          </table>
          <p style="font-family:Arial,Helvetica,sans-serif; font-size:11px; color:#6B7B73; margin:12px 0 0 0;">
            +54 9 381 200-6514 · Roy Riff postventa
          </p>
        </td>
      </tr>
    </table>

    <!-- Roy Riff: Mientras esperamos tu pago -->
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:32px 0 0 0;">
      <tr>
        <td>
          <h3 style="font-family:Arial,Helvetica,sans-serif; font-size:13px; font-weight:bold; color:<?php echo esc_attr($dark); ?>; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 16px 0; padding-bottom:8px; border-bottom:2px solid <?php echo esc_attr($orange); ?>; display:inline-block;">
            📚 Mientras esperamos tu pago
          </h3>
        </td>
      </tr>
      <tr>
        <td>
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <!-- Card 1: Tutorial armado -->
              <td width="33%" valign="top" style="padding:8px;">
                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#fff; border:1px solid <?php echo esc_attr($gray_light); ?>; border-radius:6px;">
                  <tr><td style="padding:16px; font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 6px 0; font-size:18px;">🔧</p>
                    <p style="margin:0 0 6px 0; font-size:13px; font-weight:bold; color:<?php echo esc_attr($dark); ?>;">Tutorial de armado</p>
                    <p style="margin:0 0 10px 0; font-size:11px; color:#6B7B73; line-height:1.4;">Cómo dejar tu Roy Riff lista para rodar.</p>
                    <a href="https://royriff.com.ar/tutoriales/armado/" style="font-size:11px; font-weight:bold; color:<?php echo esc_attr($orange); ?>; text-decoration:none;">Ver tutorial →</a>
                  </td></tr>
                </table>
              </td>
              <!-- Card 2: Batería -->
              <td width="33%" valign="top" style="padding:8px;">
                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#fff; border:1px solid <?php echo esc_attr($gray_light); ?>; border-radius:6px;">
                  <tr><td style="padding:16px; font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 6px 0; font-size:18px;">🔋</p>
                    <p style="margin:0 0 6px 0; font-size:13px; font-weight:bold; color:<?php echo esc_attr($dark); ?>;">Cuidado de batería</p>
                    <p style="margin:0 0 10px 0; font-size:11px; color:#6B7B73; line-height:1.4;">Para que dure muchos años desde el día 1.</p>
                    <a href="https://royriff.com.ar/tutoriales/bateria-y-carga/" style="font-size:11px; font-weight:bold; color:<?php echo esc_attr($orange); ?>; text-decoration:none;">Ver tutorial →</a>
                  </td></tr>
                </table>
              </td>
              <!-- Card 3: Garantía -->
              <td width="33%" valign="top" style="padding:8px;">
                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#fff; border:1px solid <?php echo esc_attr($gray_light); ?>; border-radius:6px;">
                  <tr><td style="padding:16px; font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 6px 0; font-size:18px;">🛡️</p>
                    <p style="margin:0 0 6px 0; font-size:13px; font-weight:bold; color:<?php echo esc_attr($dark); ?>;">Garantía y service</p>
                    <p style="margin:0 0 10px 0; font-size:11px; color:#6B7B73; line-height:1.4;">2 años cuadro · 1 año electrónica.</p>
                    <a href="https://royriff.com.ar/servicio-tecnico-y-garantia/" style="font-size:11px; font-weight:bold; color:<?php echo esc_attr($orange); ?>; text-decoration:none;">Ver detalles →</a>
                  </td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Roy Riff: Recordatorio plazo -->
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:24px 0 0 0;">
      <tr>
        <td style="background:#FFFBEB; border-left:4px solid #F59E0B; padding:14px 18px;">
          <p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#78350F; margin:0; line-height:1.5;">
            ⏰ <strong>Importante:</strong> tu pedido queda reservado por 48 hs hábiles. Si no recibimos la transferencia en ese plazo, lo cancelamos automáticamente y volvemos a liberar el stock.
          </p>
        </td>
      </tr>
    </table>

    <?php
}

/**
 * Footer custom Roy Riff (reemplaza el footer default de WC).
 * Aplica a TODOS los emails (no solo BACS) para tener identidad consistente.
 */
add_filter('woocommerce_email_footer_text', 'royriff_email_footer_text', 99);
function royriff_email_footer_text($text) {
    ob_start();
    ?>
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="text-align:center; font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td style="padding:8px 0;">
          <p style="font-size:14px; font-weight:bold; color:#151515; margin:0;">
            ROY RIFF
          </p>
          <p style="font-size:11px; color:#6B7B73; margin:4px 0 0 0; line-height:1.5;">
            Av. Aconquija 1727, Yerba Buena, Tucumán, Argentina<br>
            Zohan Venture SAS · CUIT 33-71884288-9
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          <a href="https://wa.me/5493812006514" style="display:inline-block; margin:0 6px; font-size:12px; color:#FF460D; text-decoration:none; font-weight:bold;">📱 WhatsApp</a>
          <span style="color:#E5E2DD;">·</span>
          <a href="mailto:postventa@royriff.com.ar" style="display:inline-block; margin:0 6px; font-size:12px; color:#FF460D; text-decoration:none; font-weight:bold;">✉️ Email</a>
          <span style="color:#E5E2DD;">·</span>
          <a href="https://www.instagram.com/royriff.arg/" style="display:inline-block; margin:0 6px; font-size:12px; color:#FF460D; text-decoration:none; font-weight:bold;">📷 Instagram</a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0; border-top:1px solid #E5E2DD;">
          <p style="font-size:10px; color:#94A3A0; margin:0; line-height:1.4;">
            Recibís este email porque hiciste una compra en royriff.com.ar.<br>
            <a href="https://royriff.com.ar" style="color:#94A3A0; text-decoration:underline;">royriff.com.ar</a>
          </p>
        </td>
      </tr>
    </table>
    <?php
    return ob_get_clean();
}

/**
 * Inyectar CSS adicional para todos los emails Roy Riff.
 * Algunos clients lo respetan en el <style> del head.
 */
add_filter('woocommerce_email_styles', 'royriff_email_styles', 99);
function royriff_email_styles($css) {
    $extra = "
    /* Roy Riff brand */
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
    a { color:#FF460D; }
    h1, h2, h3 { font-family:Arial,Helvetica,sans-serif; font-weight:bold; color:#151515; letter-spacing:0.5px; }
    .royriff-card { border:1px solid #E5E2DD; border-radius:6px; }
    @media only screen and (max-width:600px) {
      table[width='33%'] { width:100% !important; display:block !important; }
    }
    ";
    return $css . $extra;
}
