import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { IProductChoice } from "@/lib/interface";
import { ColorPicker } from "@wordpress/components";
import { X } from "lucide-react";

const ProductChoiceDefault: React.FC<IProductChoice> = ({
  field,
  watch,
  setValue,
  option,
  optionIndex,
}) => {
  return (
    <FieldSet>
      {field.value.map((choice, j) => (
        <FieldSet key={j} className="my-0.5 grid grid-cols-3">
          <Field>
            {j > 0 ? <></> : <FieldLabel>Title</FieldLabel>}
            <Input
              placeholder="Title"
              value={watch(`options.${optionIndex}.choices.${j}.title`)}
              onChange={(e) =>
                setValue(
                  `options.${optionIndex}.choices.${j}.title`,
                  e.target.value
                )
              }
            />
          </Field>

          <Field>
            {j > 0 ? <></> : <FieldLabel>Value</FieldLabel>}
            <Input
              placeholder="Value"
              value={watch(`options.${optionIndex}.choices.${j}.value`)}
              onChange={(e) =>
                setValue(
                  `options.${optionIndex}.choices.${j}.value`,
                  e.target.value
                )
              }
            />
          </Field>

          <Field>
            {j > 0 ? <></> : <FieldLabel>Color</FieldLabel>}
            <InputGroup>
              <InputGroupInput
                placeholder="Color"
                disabled
                value={watch(`options.${optionIndex}.choices.${j}.color`)}
              />
              <InputGroupAddon>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className="rounded-[10%] w-6 h-6 shadow-2xl p-1"
                      style={{
                        backgroundColor: watch(
                          `options.${optionIndex}.choices.${j}.color`
                        ),
                      }}
                    ></div>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <div className="flex justify-center items-center">
                      <ColorPicker
                        color={watch(
                          `options.${optionIndex}.choices.${j}.value`
                        )}
                        onChange={(e) => {
                          if (option.label.toLowerCase() === "color") {
                            setValue(
                              `options.${optionIndex}.choices.${j}.value`,
                              e
                            );
                          }

                          setValue(
                            `options.${optionIndex}.choices.${j}.color`,
                            e
                          );
                        }}
                        enableAlpha
                        defaultValue="#000"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </InputGroupAddon>
              <InputGroupAddon
                align="inline-end"
                className="rounded-[50%] w-6 h-6 bg-red-400 mx-2 p-1 text-white cursor-default hover:bg-red-500"
                onClick={() => {
                  console.log("hello");
                  field.value.splice(j, 1);
                  field.onChange([...field.value]);
                }}
              >
                <X />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldSet>
      ))}
    </FieldSet>
  );
};

export default ProductChoiceDefault;
