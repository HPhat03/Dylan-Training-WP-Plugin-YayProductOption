<?php

require_once YPO_PLUGIN_PATH . "includes/rest-api-repository.php";

function ypo_check_permission() {
    if ( ! current_user_can( 'edit_posts' ) ) {
        return new WP_Error( 'rest_forbidden', esc_html__( 'OMG you can not view private data.', 'my-text-domain' ), array( 'status' => 401 ) );
    }

    return true;
}

function ypo_register_routes() {
    register_rest_route(
        "api",
        "/product",
        array(
            "methods" => WP_REST_Server::READABLE,
            "callback" => "ypo_get_product_list"
            // "permission_callback" => "ypo_check_permission"
        )
    );

    register_rest_route(
        "api",
        "/product/(?P<id>[\d]+)",
        array(
            "methods" => WP_REST_Server::READABLE,
            "callback" => "ypo_get_product_with_id"
            // "permission_callback" => "ypo_check_permission"
        )
    );

    register_rest_route(
        "api",
        "/product/(?P<id>[\d]+)",
        array(
            "methods" => WP_REST_Server::EDITABLE,
            "callback" => "ypo_edit_product_with_id"
            // "permission_callback" => "ypo_check_permission"
        )
    );
}

function ypo_get_product_list( $request ) {

    $result = ypo_get_product();
    $response = ypo_handle_data($result);
    
    return rest_ensure_response($response);
}

function ypo_get_product_with_id( $request ) {
    $id = $request["id"];
    $result = ypo_get_product($id);
    $response = ypo_handle_data($result, true);

    return rest_ensure_response($response);
}

function ypo_edit_product_with_id( $request ) {
    $id = $request["id"];

}

add_action("rest_api_init", "ypo_register_routes");