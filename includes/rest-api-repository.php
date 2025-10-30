<?php

use Automattic\WooCommerce\Enums\ProductStatus;
/**
 * Get a list of products
 * 
 */
function ypo_get_products(){
    $args = array(
        'status' => ProductStatus::PUBLISH,
        'limit' => -1,
    );

    $result = wc_get_products( $args );
    return $result;
}

/**
 * Get a single product by id
 * 
 * @param string $id
 */
function ypo_get_product($id){
    $result = wc_get_product($id);
    return $result;
}

/**
 * add yay product options
 * 
 * @param WC_Product[] $data
 */
function ypo_product_array_to_json($data) {
    $response = array();

    foreach ($data as $product) {
        $tmp = ypo_product_to_json($product);
        array_push($response, $tmp);
    }

    return $response;
}

/**
 * Yay product to json format
 * 
 * @param WC_Product $data
 */
function ypo_product_to_json($product) {
    $tmp = [
        "product" => [
            "id" => $product->get_id(),
            "name" => $product->get_name()
        ],
        "options" => []
    ];

    $ypo_option_meta = get_post_meta($product->get_id(), YPO_META_NAME, true);
    $ypo_option = unserialize($ypo_option_meta);

    if (isset($ypo_option) 
        and !empty($ypo_option) 
        and is_array($ypo_option)) 
    {
        $tmp["options"] = $ypo_option;
    }

    return $tmp;
}