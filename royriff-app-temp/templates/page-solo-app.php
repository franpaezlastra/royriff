<?php
/**
 * Template Name: Solo App React
 * Template para la página principal: muestra solo la app React sin header/footer del theme.
 *
 * Este template se aplica automáticamente a todas las rutas de la SPA.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        /* Aislar la app React de estilos del tema WordPress */
        body { margin: 0; padding: 0; }
        #root { isolation: isolate; }
    </style>
</head>
<body <?php body_class(); ?>>
    <?php
    // Si estamos en una ruta SPA, mostrar el contenido del shortcode
    $is_spa_route = get_query_var('royriff_spa');
    $page_id = get_query_var('page_id');
    
    if ($is_spa_route || $page_id) {
        // Obtener la página principal que contiene el shortcode
        $front_page_id = get_option('page_on_front');
        if ($front_page_id) {
            $page = get_post($front_page_id);
            if ($page) {
                echo apply_filters('the_content', $page->post_content);
            }
        }
    } else {
        // Fallback: mostrar el contenido normal de la página
        while (have_posts()) :
            the_post();
            the_content();
        endwhile;
    }
    ?>
    <?php wp_footer(); ?>
</body>
</html>
