<?php

use Automattic\WooCommerce\Enums\ProductStatus;

function ypo_get_products(){
    $args = array(
        'status' => ProductStatus::PUBLISH,
    );

    $result = wc_get_products( $args );
    return $result;
}

function ypo_get_product($id){
    $result = wc_get_product($id);
    return array($result);
}
function ypo_handle_data($data, $isSingle = false) {
    $response = array();

    foreach ($data as $product) {
        $tmp = [
            "product" => [
                "id" => $product->get_id(),
                "name" => $product->get_name()
            ],
            "options" => []
        ];

        if (!empty($product->get_attributes())) {
            $attributes = $product->get_attributes();
            foreach ($attributes as $attr => $attr_val) {
                $tmp_opt = [
                    "label" => $attr,
                    "displayLabel" => $attr,
                    "choices" => array()
                ];

                if ($attr_val->is_taxonomy()) {
                    $terms = wp_get_post_terms();
                    foreach ($terms as $term) {
                        $tmp_choice = [
                            "title" => $term->name,
                            "value" => strtolower($term->name),
                            "color" => strtolower($attr)=="color" ? strtolower($term->name) : "black"
                        ];
                        array_push($tmp_opt["choices"], $tmp_choice);
                    }
                }
                else {
                    $options = $attr_val->get_options();
                    foreach ($options as $opt) {
                        $tmp_choice = [
                            "title" => $opt,
                            "value" => strtolower($opt),
                            "color" => strtolower($attr)=="color" ? strtolower($opt) : "black"
                        ];
                        array_push($tmp_opt["choices"], $tmp_choice);
                    }
                }

                array_push($tmp["options"], $tmp_opt);
            }
        }
        if ($isSingle) {
            return $tmp;
        }
        else {
            array_push($response, $tmp);
        }
    }

    return $response;
}