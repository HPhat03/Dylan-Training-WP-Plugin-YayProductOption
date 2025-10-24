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

function ypo_enqueue_admin_app() {
    wp_enqueue_script("ypo-asdas", YPO_PLUGIN_URL . '/build/index.js');
    wp_enqueue_style("ypo-asdas", YPO_PLUGIN_URL . '/build/index.css');
    wp_localize_script("ypo-asdas", "ypoData", [
        "nonce" => wp_create_nonce("wp_rest")
    ]);
}

function ypo_render_admin_page() {
    ?>
   <div id="ypo-admin-page">
   </div>
   <?php
}



add_action('admin_enqueue_scripts', "ypo_enqueue_admin_app");
add_action('admin_menu', "ypo_add_admin_menu");