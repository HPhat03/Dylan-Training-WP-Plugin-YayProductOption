<?php 
function ypo_get_product($id = null){

    global $wpdb;
    $sql = " SELECT 
                p.ID, 
                p.post_title,
                pm.meta_value
            FROM 
                wp_posts AS p
                LEFT JOIN
                wp_postmeta AS pm
                ON 
                    p.ID = pm.post_id
                    AND pm.meta_key = %s
            WHERE 
                p.post_type =  %s
                AND p.post_status = 'publish'
            ";
    if ($id != null) {
        $sql .= " AND p.ID = %s";
        $prepare_statement = $wpdb->prepare($sql, "_product_attributes", POST_TYPE_PRODUCT, $id);
    }
    else {
        $prepare_statement = $wpdb->prepare($sql, "_product_attributes", POST_TYPE_PRODUCT);
    }
    
    $result = $wpdb->get_results($prepare_statement, ARRAY_A);
    return $result;
}

function ypo_handle_data($data, $isSingle = false) {
    $response = array();

    foreach ($data as $product) {
        $tmp = [
            "product" => [
                "id" => $product["ID"],
                "name" => $product["post_title"]
            ],
            "options" => []
        ];

        if (!empty($product["meta_value"])) {
            $option_data = unserialize($product["meta_value"]);
            foreach ($option_data as $option) {
                $tmp_opt = [
                    "label" => $option["name"],
                    "displayLabel" => $option["name"],
                    "choices" => array()
                ];

                $values = explode('|',$option["value"]);
                foreach ($values as $value) {
                    $tmp_choice = [
                        "title" => $value,
                        "value" => strtolower($value),
                        "color" => strtolower($value)
                    ];
                    array_push($tmp_opt["choices"], $tmp_choice);
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