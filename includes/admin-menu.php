<?php

function ypo_add_admin_menu() {
    add_menu_page(
        "Yay Product Options",
        "Yay Product Options",
        "manage_options", //Capability - tìm hiểu thêm
        "ypo_admin", // Menu Slug
       "ypo_render_admin_page",
        "dashicons-format-aside", // icon,
        31  //Xếp sau plugin (pos: 65)
    );
}

// Hot Reload not working
function ypo_enqueue_admin_app() {
    $asset_file = include YPO_PLUGIN_PATH . 'build/index.asset.php';

    wp_enqueue_script("ypo-asdas", YPO_PLUGIN_URL . '/build/index.js', $asset_file['dependencies'],
    $asset_file['version']);
    wp_enqueue_style("ypo-asdas", YPO_PLUGIN_URL . '/build/index.css', [],
    $asset_file['version']);
    
    wp_localize_script("ypo-asdas", "ypoData", [
        "nonce" => wp_create_nonce("wp_rest"),
        "base_url" => esc_url( rest_url() ).YPO_API_NAMESPACE,
    ]);
}

function ypo_render_admin_page() {
    ?>
   <div id="ypo-admin-page">
   </div>
   <?php
}

/** region Vite */
function ypo_enqueue_admin_vite_app() {
    $deps = [ 'react', 'react-dom' ];

    wp_enqueue_script("ypo-module-admin-app", 'http://localhost:3000/src/admin-app.tsx', $deps, null, true);
    // wp_enqueue_script("ypo-module-admin-app", YPO_PLUGIN_URL . '/build/admin-app.js', $deps, '1.0.0');
    wp_enqueue_style("ypo-admin-style", YPO_PLUGIN_URL . '/build/admin-app.css', [], '1.0.0');

    wp_localize_script("ypo-module-admin-app", "ypoData", [
        "nonce" => wp_create_nonce("wp_rest"),
        "base_url" => esc_url( rest_url() ).YPO_API_NAMESPACE,
    ]);
}

function ypo_render_dev_refresh() {
    echo '<script type="module">
    import RefreshRuntime from "http://localhost:3000/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
    </script>';
}

function ypo_add_entry_as_module( $tag, $handle ) {
    if ( strpos( $handle, 'ypo-module' ) === false ) {
        return $tag;
    }

    // $handle could has special characters bookster/module/block-booking-button
    $handle_regex = str_replace( '/', '\/', $handle );
    // find the string begin with '<script' and end with '</script>' between having 'id="' . $handle . '-js"'
    $pattern = '/<script[^>]*id="' . $handle_regex . '-js"[^>]*>.*?<\/script>/';
    preg_match( $pattern, $tag, $matches );

    if ( null !== $matches && count( $matches ) > 0 ) {
        $script_tag = $matches[0];

        if ( strpos( $script_tag, 'type="' ) !== false ) {
            $module_tag = preg_replace( '/\stype="\S+\s/', ' type="module" ', $script_tag, 1 );
        } else {
            $module_tag = str_replace( ' src=', ' type="module" src=', $script_tag );
        }

        return str_replace( $script_tag, $module_tag, $tag );
    }

    return $tag;
}

function ypo_enqueue_shop_script() {
    wp_enqueue_style("ypo-admin-style", YPO_PLUGIN_URL . '/includes/static/ypo_style.css', [], '1.0.0');
}

add_action( 'admin_footer', 'ypo_render_dev_refresh', 5 );
add_filter( 'script_loader_tag', 'ypo_add_entry_as_module', 10, 3 );
add_action('admin_enqueue_scripts', "ypo_enqueue_admin_vite_app");
/** endregion Vite */

add_action('admin_menu', "ypo_add_admin_menu");
// add_action('admin_enqueue_scripts', "ypo_enqueue_admin_app");
add_action('wp_enqueue_scripts', 'ypo_enqueue_shop_script');


