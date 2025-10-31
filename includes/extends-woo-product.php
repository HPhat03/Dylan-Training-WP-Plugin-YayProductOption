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
    ?>

<div class="ypo_container">
        <?php foreach ($ypo_options as $option): ?>
            <?php
                $name = "ypo_" . $option['label'];
                $displayLabel = $option['displayLabel'];
            ?>
            <div class="ypo_option_container">
                <div class="ypo_option_label"><?php echo esc_html($displayLabel); ?> :</div>
                <div class="ypo_choice_container">
                    <?php $i = 0; ?>
                    <?php foreach ($option['choices'] as $choice): ?>
                        <?php
                            $i++;
                            $title = $choice["title"];
                            $value = $choice["value"];
                            $color = $choice["color"];
                        ?>
                        <input 
                            type="radio" 
                            name="<?php echo esc_attr($name); ?>" 
                            value="<?php echo esc_attr($value); ?>"  
                            id="<?php echo esc_attr($name . $i); ?>" 
                        />

                        <?php if (strtolower($option['label']) == "color"): ?>
                            <label 
                                class="ypo_radio_btn_color" 
                                for="<?php echo esc_attr($name . $i); ?>" 
                                style="background-color: <?php echo esc_attr($color); ?>;"
                            >
                                <div class="ypo_tooltip_text"><?php echo esc_html($title); ?></div>
                            </label>
                        <?php else: ?>
                            <label 
                                class="ypo_radio_btn" 
                                for="<?php echo esc_attr($name . $i); ?>" 
                                style="border-color: <?php echo esc_attr($color); ?>; color: <?php echo esc_attr($color); ?>"
                            >
                                <?php echo esc_html($title); ?>
                                <div class="ypo_tooltip_text"><?php echo esc_html($title); ?></div>
                            </label>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <?php
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