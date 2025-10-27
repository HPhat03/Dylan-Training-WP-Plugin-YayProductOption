<?php

// Yêu cầu phải khai báo header-requirement để WP có thể xem đây là plugin để activate/deactivate 
// Tối thiểu header-requirement phải có Plugin Name

/**
 * Plugin Name: Training WP Plugin - Yay Product Options
 * Description: This is my first test plugin
 * Version: 1.0.0
 * Text Domain: contact-plugin
 * 
*/

// Nếu trường hợp người dùng đi vào direct URL của plugin phải chặn người dùng không cho vào
// Absolute Path được define khi WP sử dụng

if ( !defined('ABSPATH') ) {
    die('405 - Forbidden');
}

define("YPO_PLUGIN_PATH", plugin_dir_path(__FILE__) );
define("YPO_PLUGIN_URL", plugin_dir_url(__FILE__) );
define("POST_TYPE_PRODUCT", "product");

function ypo_activate_plugin() {
}

function ypo_deactivate_plugin() {
}

function ypo_load_plugin() {
    require_once YPO_PLUGIN_PATH . "includes/rest-api-controller.php";
    require_once YPO_PLUGIN_PATH . "includes/admin-menu.php";
    // require_once YPO_PLUGIN_PATH . "includes/extends-woo-product.php";
    // require_once YPO_PLUGIN_PATH . "includes/extends-woo-order.php";
}

register_activation_hook(__FILE__, 'ypo_activate_plugin');
register_deactivation_hook(__FILE__, 'ypo_deactivate_plugin');

add_action('plugin_loaded', "ypo_load_plugin");