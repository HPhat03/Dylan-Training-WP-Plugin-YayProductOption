<?php

function ypo_save_to_cart($cart_item_data, $product_id) {
    $ypo_options_str = get_post_meta($product_id, YPO_META_NAME, true);
    if (!isset($ypo_options_str)) {
        return;
    }

    $ypo_options = unserialize($ypo_options_str);

    foreach ($ypo_options as $option) {
        $key = "ypo_" . $option["label"];
        $cart_item_data[$key] = sanitize_text_field($_POST[$key]);
    }

    return $cart_item_data;
}

function ypo_display_cart_n_checkout($item_data, $cart_item) {
    $id = $cart_item["product_id"];

    $ypo_options_str = get_post_meta($id, YPO_META_NAME, true);
    if (!isset($ypo_options_str)) {
        return;
    }

    $ypo_options = unserialize($ypo_options_str);

    foreach ($ypo_options as $option) {
        $key = "ypo_" . $option["label"];
        if (!empty($cart_item[$key])) {  
            
            $choice = null;
            foreach ($option["choices"] as $value) {
                if ($value['value'] == $cart_item[$key]) {
                    $choice = $value;
                    break;
                }
            }
            $item_data[] = [
                'name' => __($option["displayLabel"],'ypo'),
                'value'=> $choice['title']
            ];
        }
    }
    return $item_data;
}

function ypo_save_to_order($item, $cart_item_key, $values, $order) {
    $id = $values["product_id"];

    $ypo_options_str = get_post_meta($id, YPO_META_NAME, true);
    if (!isset($ypo_options_str)) {
        return;
    }

    $ypo_options = unserialize($ypo_options_str);

    foreach ($ypo_options as $option) {
        $key = "ypo_" . $option["label"];
        if (!empty($values[$key])) {
            $item->add_meta_data($key, $values[$key]);
        }
    }
}

add_filter("woocommerce_add_cart_item_data", "ypo_save_to_cart", 10, 2);
add_filter("woocommerce_get_item_data", "ypo_display_cart_n_checkout", 10, 2);
add_action('woocommerce_checkout_create_order_line_item', 'ypo_save_to_order', 10, 4);