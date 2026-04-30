<?php
/**
 * Roy Riff — JSON-LD schema generators per route
 *
 * Generadores de Schema.org JSON-LD para inyección dinámica en wp_head.
 * Cada función devuelve un array PHP que se serializa con wp_json_encode.
 *
 * Uso desde royriff-app.php:
 *   require_once ROYRIFF_APP_PATH . 'includes/schema.php';
 *   $schemas[] = royriff_app_get_org_schema();
 *   echo '<script type="application/ld+json">' . wp_json_encode($s, ...) . '</script>';
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Organization schema — emitido en TODAS las rutas.
 */
function royriff_app_get_org_schema() {
    return array(
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        '@id' => 'https://royriff.com.ar/#organization',
        'name' => 'Roy Riff',
        'legalName' => 'Zohan Venture SAS',
        'taxID' => '33-71884288-9',
        'url' => 'https://royriff.com.ar',
        'logo' => 'https://royriff.com.ar/og-image.webp',
        'image' => 'https://royriff.com.ar/og-image.webp',
        'description' => 'Marca argentina de bicicletas eléctricas premium. Modelos LOLA (urban cruiser) y XXXX Expedition (fat-tire todoterreno). Local físico en Yerba Buena, Tucumán.',
        'address' => array(
            '@type' => 'PostalAddress',
            'streetAddress' => 'Avenida Aconquija 1727',
            'addressLocality' => 'Yerba Buena',
            'addressRegion' => 'Tucumán',
            'postalCode' => 'T4107',
            'addressCountry' => 'AR',
        ),
        'contactPoint' => array(
            '@type' => 'ContactPoint',
            'telephone' => '+54-9-381-200-6514',
            'contactType' => 'customer service',
            'email' => 'postventa@royriff.com.ar',
            'availableLanguage' => array('Spanish'),
            'areaServed' => 'AR',
        ),
        'sameAs' => array(
            'https://www.instagram.com/royriff',
        ),
    );
}

/**
 * WebSite + SearchAction schema — emitido solo en home.
 */
function royriff_app_get_website_schema() {
    return array(
        '@context' => 'https://schema.org',
        '@type' => 'WebSite',
        '@id' => 'https://royriff.com.ar/#website',
        'url' => 'https://royriff.com.ar',
        'name' => 'Roy Riff',
        'description' => 'Bicicletas eléctricas premium en Argentina',
        'publisher' => array('@id' => 'https://royriff.com.ar/#organization'),
        'inLanguage' => 'es-AR',
    );
}

/**
 * LocalBusiness (BicycleStore) schema — emitido en /local/.
 */
function royriff_app_get_localbusiness_schema() {
    return array(
        '@context' => 'https://schema.org',
        '@type' => 'BicycleStore',
        '@id' => 'https://royriff.com.ar/local/#store',
        'name' => 'Showroom Roy Riff Tucumán',
        'parentOrganization' => array('@id' => 'https://royriff.com.ar/#organization'),
        'url' => 'https://royriff.com.ar/local/',
        'image' => 'https://royriff.com.ar/og-image.webp',
        'description' => 'Showroom de Roy Riff en Yerba Buena, Tucumán. Probá la LOLA y la XXXX antes de decidir, con turno previo. Equipo propio, parking, service in-house.',
        'address' => array(
            '@type' => 'PostalAddress',
            'streetAddress' => 'Avenida Aconquija 1727',
            'addressLocality' => 'Yerba Buena',
            'addressRegion' => 'Tucumán',
            'postalCode' => 'T4107',
            'addressCountry' => 'AR',
        ),
        'geo' => array(
            '@type' => 'GeoCoordinates',
            'latitude' => -26.8195,
            'longitude' => -65.3199,
        ),
        'telephone' => '+54-9-381-200-6514',
        'email' => 'postventa@royriff.com.ar',
        'openingHoursSpecification' => array(
            array(
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => array('Monday','Tuesday','Wednesday','Thursday','Friday'),
                'opens' => '09:00',
                'closes' => '13:00',
            ),
            array(
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => array('Monday','Tuesday','Wednesday','Thursday','Friday'),
                'opens' => '17:00',
                'closes' => '21:00',
            ),
            array(
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => 'Saturday',
                'opens' => '09:00',
                'closes' => '13:00',
            ),
        ),
        'priceRange' => '$$',
        'paymentAccepted' => array('Cash', 'Credit Card', 'Bank Transfer', 'Mercado Pago'),
        'currenciesAccepted' => 'ARS',
    );
}

/**
 * Product schema — emitido en /bicicletas-electricas/<slug>/
 *
 * @param string $slug 'lola' o 'xxxx'
 */
function royriff_app_get_product_schema($slug) {
    $products = array(
        'lola' => array(
            'name' => 'LOLA Urban Cruiser E-Bike',
            'sku' => 'RR-LOLA-001',
            'description' => 'Bicicleta eléctrica urbana estilo cruiser. Motor 500W (65 N.m), batería 48V 10.4Ah extraíble, autonomía 40-65 km, frenos hidráulicos, neumáticos 26"x3.0", display LCD con USB. Cumple Decreto 196/2025 (EPAC). Peso 32 kg.',
            'price' => '2412000',
            'url' => 'https://royriff.com.ar/bicicletas-electricas/lola-cruiser/',
        ),
        'xxxx' => array(
            'name' => 'XXXX Expedition Fat Tire E-Bike',
            'sku' => 'RR-XXXX-001',
            'description' => 'Bicicleta eléctrica fat-tire de expedición. Motor 500W, batería 48V 20Ah (960Wh), autonomía 70-90 km, doble suspensión, neumáticos 20"x4.0", display LCD. Cumple Decreto 196/2025 (EPAC). Peso 42 kg.',
            'price' => '3217000',
            'url' => 'https://royriff.com.ar/bicicletas-electricas/xxxx-expedition/',
        ),
    );

    if (!isset($products[$slug])) {
        return null;
    }

    $p = $products[$slug];

    return array(
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => $p['name'],
        'sku' => $p['sku'],
        'category' => 'E-Bike',
        'brand' => array(
            '@type' => 'Brand',
            'name' => 'Roy Riff',
        ),
        'manufacturer' => array('@id' => 'https://royriff.com.ar/#organization'),
        'image' => 'https://royriff.com.ar/og-image.webp',
        'description' => $p['description'],
        'offers' => array(
            '@type' => 'Offer',
            'url' => $p['url'],
            'priceCurrency' => 'ARS',
            'price' => $p['price'],
            'priceValidUntil' => '2026-12-31',
            'availability' => 'https://schema.org/InStock',
            'itemCondition' => 'https://schema.org/NewCondition',
            'seller' => array('@id' => 'https://royriff.com.ar/#organization'),
            'shippingDetails' => array(
                '@type' => 'OfferShippingDetails',
                'shippingRate' => array(
                    '@type' => 'MonetaryAmount',
                    'value' => '0',
                    'currency' => 'ARS',
                ),
                'shippingDestination' => array(
                    '@type' => 'DefinedRegion',
                    'addressCountry' => 'AR',
                ),
                'deliveryTime' => array(
                    '@type' => 'ShippingDeliveryTime',
                    'handlingTime' => array(
                        '@type' => 'QuantitativeValue',
                        'minValue' => 1,
                        'maxValue' => 2,
                        'unitCode' => 'DAY',
                    ),
                    'transitTime' => array(
                        '@type' => 'QuantitativeValue',
                        'minValue' => 3,
                        'maxValue' => 6,
                        'unitCode' => 'DAY',
                    ),
                ),
            ),
            'hasMerchantReturnPolicy' => array(
                '@type' => 'MerchantReturnPolicy',
                'applicableCountry' => 'AR',
                'returnPolicyCategory' => 'https://schema.org/MerchantReturnFiniteReturnWindow',
                'merchantReturnDays' => 10,
                'returnMethod' => 'https://schema.org/ReturnByMail',
                'returnFees' => 'https://schema.org/FreeReturn',
            ),
        ),
    );
}

/**
 * BreadcrumbList schema — emitido en TODAS las rutas excepto home.
 *
 * @param string $path Path de la URL sin slashes (ej: 'local', 'bicicletas-electricas/lola-cruiser')
 */
function royriff_app_get_breadcrumb_schema($path) {
    if ($path === '' || $path === '/') {
        return null;
    }

    $items = array(
        array(
            '@type' => 'ListItem',
            'position' => 1,
            'name' => 'Inicio',
            'item' => 'https://royriff.com.ar/',
        ),
    );

    $segments = explode('/', trim($path, '/'));
    $accumPath = '';
    $position = 2;

    $labels = array(
        'bicicletas-electricas' => 'Bicicletas Eléctricas',
        'lola-cruiser' => 'LOLA Cruiser',
        'xxxx-expedition' => 'XXXX Expedition',
        'elegir' => 'Comprar',
        'comparacion-ebike-royriff' => 'Comparador',
        'test-ride-tucuman' => 'Test Ride Tucumán',
        'local' => 'Local',
        'galeria' => 'Galería',
        'contacto' => 'Contacto',
        'financiacion' => 'Financiación',
        'envios' => 'Envíos',
        'servicio-tecnico-y-garantia' => 'Servicio Técnico y Garantía',
        'faq' => 'FAQ',
        'tutoriales' => 'Tutoriales',
        'armado' => 'Armado',
        'bateria-y-carga' => 'Batería y Carga',
        'mantenimiento-basico' => 'Mantenimiento Básico',
        'seguridad-antirrobo' => 'Seguridad y Antirrobo',
        'terminos-y-condiciones' => 'Términos y Condiciones',
        'politica-de-privacidad' => 'Política de Privacidad',
        'cambios-y-devoluciones' => 'Cambios y Devoluciones',
        'boton-de-arrepentimiento' => 'Botón de Arrepentimiento',
    );

    foreach ($segments as $seg) {
        $accumPath .= '/' . $seg;
        $label = isset($labels[$seg]) ? $labels[$seg] : ucfirst(str_replace('-', ' ', $seg));
        $items[] = array(
            '@type' => 'ListItem',
            'position' => $position,
            'name' => $label,
            'item' => 'https://royriff.com.ar' . $accumPath . '/',
        );
        $position++;
    }

    return array(
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => $items,
    );
}

/**
 * FAQPage schema — emitido en /faq/.
 */
function royriff_app_get_faq_schema() {
    return array(
        '@context' => 'https://schema.org',
        '@type' => 'FAQPage',
        'mainEntity' => array(
            array(
                '@type' => 'Question',
                'name' => '¿Las bicicletas Roy Riff son legales en Argentina?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => 'Sí. Tanto LOLA como XXXX Expedition son legalmente bicicletas con pedaleo asistido (EPAC) bajo el Decreto 196/2025. Motor de 500W con asistencia limitada electrónicamente a 25 km/h en vía pública. No requieren patente, licencia ni seguro obligatorio.',
                ),
            ),
            array(
                '@type' => 'Question',
                'name' => '¿Qué autonomía real tienen?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => 'LOLA tiene una autonomía de 40 a 65 km con su batería 48V 10.4Ah. XXXX Expedition llega a 70-90 km gracias a su batería 48V 20Ah (960Wh). El rango varía según peso del rider, terreno y nivel de asistencia usado.',
                ),
            ),
            array(
                '@type' => 'Question',
                'name' => '¿Hacen envíos a todo el país?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => 'Sí, envío gratuito a todo el país por paquetería nacional. Tiempo de entrega: 3-6 días hábiles. La bici llega pre-ensamblada al 85-90% con manual y videos de armado. También se puede retirar en Palermo, Buenos Aires, con turno previo.',
                ),
            ),
            array(
                '@type' => 'Question',
                'name' => '¿Qué garantía tienen?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => 'Cuadro: 2 años por defectos de fábrica. Componentes eléctricos (motor, batería, controlador, display): 1 año. La mecánica está cubierta por cualquier bicicletería. Service propio en Yerba Buena, Tucumán.',
                ),
            ),
            array(
                '@type' => 'Question',
                'name' => '¿Qué pasa si llueve?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => 'Las bicicletas Roy Riff tienen protección IPX4: resisten salpicaduras y lluvia leve. Recomendamos no sumergirlas ni lavarlas a presión. Después de andar bajo lluvia intensa, secar con un trapo y guardar en lugar ventilado.',
                ),
            ),
            array(
                '@type' => 'Question',
                'name' => '¿Cuánto cuestan?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => 'LOLA Cruiser: ARS 2.000.000 efectivo o transferencia. XXXX Expedition: ARS 2.700.000. Financiación disponible en 3, 6, 9 o 12 cuotas vía Mercado Pago, con recargos transparentes (3 cuotas +11%, 6 cuotas +20%, 9 cuotas +33%, 12 cuotas +44%).',
                ),
            ),
        ),
    );
}
