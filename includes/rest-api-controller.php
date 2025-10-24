<?php

class RestApiController {

    public static function register(){
        add_action("rest_api_init", array(__CLASS__, "dylan_register_routes"));
    }

    public static function dylan_register_routes() {
        register_rest_route(
            "api",
            "/json",
            array(
                "methods" => WP_REST_Server::READABLE,
                "callback" => array(__CLASS__, "get_data"),
                "permission_callback" => array(__CLASS__, "dylan_check_permission")
            )
        );

        register_rest_route(
            "api",
            "/json/(?P<id>[\d]+)",
            array(
                "methods" => WP_REST_Server::READABLE,
                "callback" => array(__CLASS__, "get_data_with_id")
            )
        );

        register_rest_route(
            "api",
            "/json",
            array (
                "methods" => WP_REST_Server::CREATABLE,
                "callback" => array(__CLASS__, "create_data")
            )
        );
    }

    public static function get_data( $request ) {
        $id = $request->get_param("id");
        $post_type = $request->get_param("post_type");

        global $wpdb;
        // $sql = " SELECT ID, post_title FROM wp_posts WHERE post_type =  %s ";
        // if ($id) {
        //     $sql .= " AND ID = %d";
        //     $prepare_statement = $wpdb->prepare($sql, $post_type, $id);
        // }
        // else {
        //     $prepare_statement = $wpdb->prepare($sql, $post_type);
        // }

        // $result = $wpdb->get_results($prepare_statement, ARRAY_A);

        $condition = array("post_type" => $post_type);
        if ($id) {
            $condition["ID"] = $id;
        }
        $result = get_posts($condition);
        
        return rest_ensure_response($result);
    }

    public static function create_data( $request ) {
        return rest_ensure_response($request["name"]);
    }

    public static function get_data_with_id( $request ) {
        $product = get_post($request["id"]);
        return rest_ensure_response($product);
    }

    public static function dylan_check_permission() {
        // Restrict endpoint to only users who have the edit_posts capability.
        if ( ! current_user_can( 'edit_posts' ) ) {
            return new WP_Error( 'rest_forbidden', esc_html__( 'OMG you can not view private data.', 'my-text-domain' ), array( 'status' => 401 ) );
        }

        // This is a black-listing approach. You could alternatively do this via white-listing, by returning false here and changing the permissions check.
        return true;
    }

}