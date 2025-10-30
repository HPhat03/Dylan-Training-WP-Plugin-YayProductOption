<?php

use Automattic\WooCommerce\Enums\ProductStatus;

require_once YPO_PLUGIN_PATH . "includes/rest-api-repository.php";

function ypo_check_permission() {
    if ( ! current_user_can( 'edit_posts' ) ) {
        return new WP_Error( 'rest_forbidden', esc_html__( 'OMG you can not view private data.', 'my-text-domain' ), array( 'status' => 401 ) );
    }

    return true;
}

function ypo_register_routes() {
    register_rest_route(
        "ypo_api",
        "/product",
        array(
            "methods" => WP_REST_Server::READABLE,
            "callback" => "ypo_get_product_list",
            "permission_callback" => "ypo_check_permission"
        )
    );

    register_rest_route(
        "ypo_api",
        "/product/(?P<id>[\d]+)",
        array(
            "methods" => WP_REST_Server::READABLE,
            "callback" => "ypo_get_product_with_id",
            "permission_callback" => "ypo_check_permission"
        )
    );

    register_rest_route(
        "ypo_api",
        "/product/(?P<id>[\d]+)",
        array(
            "methods" => WP_REST_Server::EDITABLE,
            "callback" => "ypo_edit_product_with_id",
            "permission_callback" => "ypo_check_permission"
        )
    );
}

function ypo_get_product_list( $request ) {
    $result = ypo_get_products();
    $response = ypo_product_array_to_json($result);
    
    return rest_ensure_response($response);
}

function ypo_get_product_with_id( $request ) {

    $id = $request["id"];
    $result = ypo_get_product($id);
    $response = ypo_product_to_json($result);

    return rest_ensure_response($response);
}

function ypo_edit_product_with_id( $request ) {
    try {
        $json = $request->get_json_params();
        $id = $json["product"]["id"];

        $data_to_save = $json["options"];
        $data_value = serialize($data_to_save);

        update_post_meta($id, YPO_META_NAME, $data_value);

        $response = array(
            "isError" => false,
            "message" => "Successfully Saved"
        );
        
        return $response;
    }
    catch (Exception $e) {
        $response = [
            "isError" => true,
            "message" => "Error: " . $e->getMessage()
        ];

        return $response;
    }

}

add_action("rest_api_init", "ypo_register_routes");