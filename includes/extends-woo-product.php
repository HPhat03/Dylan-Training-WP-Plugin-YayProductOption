<?php
function ypo_add_custom_field_in_product() {
    if (! is_product())
        return;

    global $product;

    if (!is_object($product)) {
        $product = wc_get_product( get_the_ID() );
    }

    $ypo_options_str = get_post_meta($product->get_id(), YPO_META_NAME, true);
    if (!isset($ypo_options_str)) {
        return;
    }

    $ypo_options = unserialize($ypo_options_str);
    $html_str = "<div class='ypo_container'>";

    
    foreach ($ypo_options as $option) {
        $html_str .= "<div class='ypo_option_container' >";

        $name = "ypo_" . $option['label'];
        $displayLabel = $option ['displayLabel'];

        $html_str .= "<div class='ypo_option_label'>$displayLabel : </div>";
        $html_str .= "<div class='ypo_choice_container' >";
        
        $i = 0;
        foreach ($option['choices'] as $choice){
            $i += 1;
            $title = $choice["title"];
            $value = $choice["value"];
            $color = $choice["color"];

            $html_str .= "<Input type='radio' name='$name' value='$value'  id='$name$i' />";

            if (strtolower($option['label']) == "color") {
                $html_str .= "<label class='ypo_radio_btn_color' for='$name$i' style='background-color: $color;'>
                    <div class='ypo_tooltip_text'>$title</div>
                </label>";
            }
            else {
                $html_str .= "<label class='ypo_radio_btn' for='$name$i' style='border-color: $color;  color: $color'>$title
                    <div class='ypo_tooltip_text'>$title</div>
                </label>";
            }
            
        }

        $html_str .= "</div></div>";
    }

    $html_str .= "</div>";

    echo $html_str;

}

function ypo_validate_before_add_to_cart ($passed, $product_id, $quantity) {
    $ypo_options_str = get_post_meta($product_id, YPO_META_NAME, true);
    if (!isset($ypo_options_str)) {
        return;
    }

    $ypo_options = unserialize($ypo_options_str);

    foreach ($ypo_options as $option) {
        $name = "ypo_" . $option['label'];
        $displayLabel = $option ['displayLabel'];

        if (empty($_POST[$name])) {
            wc_add_notice(__("Please choose a choice of $displayLabel you want", 'ypo'), "error");
            $passed = false;
        }

    }

    return $passed;
}

add_action("woocommerce_before_add_to_cart_button", "ypo_add_custom_field_in_product");
add_filter("woocommerce_add_to_cart_validation", "ypo_validate_before_add_to_cart", 15, 3);