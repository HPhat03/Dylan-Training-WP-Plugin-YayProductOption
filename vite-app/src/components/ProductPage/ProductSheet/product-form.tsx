import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { type ISheetForm } from "@/lib/interface";
import { useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { productIncludeFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductChoiceDefault from "./product-choice-default";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveProductOption } from "@/lib/api";
import { useUpdateEffect } from "react-use";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import ErrorDialog from "./product-error-dialog";

const ProductSheetForm: React.FC<ISheetForm> = ({ initialData }) => {
  const navigate = useNavigate();

  const { control, handleSubmit, watch, setValue, reset } = useForm<
    z.infer<typeof productIncludeFormSchema>
  >({
    resolver: zodResolver(productIncludeFormSchema),
    defaultValues: initialData,
  });

  useUpdateEffect(() => reset(initialData), [initialData]);

  const {
    fields: optionFields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = async (data: z.infer<typeof productIncludeFormSchema>) => {
    await saveMutation?.mutateAsync(data);
    navigate("/options");
  };

  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);

  const onError = (error: any) => {
    console.log("There's error: ");
    console.log(error);

    setError(true);
    var messages = [];

    for (const key in error) {
      var arr = error[key];
      for (let i = 0; i < arr.length; i++) {
        for (const err in arr[i]) {
          messages.push(arr[i][err]["message"]);
        }
      }
    }
    setErrorMessage(messages);
    console.log(messages);
  };

  const clientQuery = useQueryClient();
  const saveMutation = useMutation({
    mutationKey: ["product-option", initialData?.product.id, "edit"],
    mutationFn: saveProductOption,
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["product-detail", initialData?.product.id],
      });
      clientQuery.invalidateQueries({
        queryKey: ["product"],
      });
    },
  });

  const [deleting, setDeleting] = useState(-1);
  const [counter, setCounter] = useState(1);

  const addOption = () => {
    appendField({
      label: "untitle " + counter,
      displayLabel: "Untitle " + counter,
      choices: [],
    });
    setCounter(counter + 1);
  };

  const addChoice = (i: number) => {
    const old = watch(`options.${i}`);
    const newOption = {
      ...old,
      choices: [
        ...old.choices,
        {
          title: "",
          value: "",
          color: "black",
        },
      ],
    };
    setValue(`options.${i}`, newOption);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="h-full flex flex-col justify-between"
    >
      <ErrorDialog error={isError} messages={errorMessage} />
      <FieldGroup className="grid flex-1 auto-rows-min gap-6 px-4">
        <FieldGroup>
          <FieldSet className="grid grid-cols-3">
            <Field className="grid gap-3">
              <FieldLabel htmlFor="product-id">ID</FieldLabel>
              <Input id="product-id" readOnly value={watch("product.id")} />
            </Field>
            <Field className="grid gap-3">
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input id="product-name" readOnly value={watch("product.name")} />
            </Field>
            <Field className="grid gap-3">
              <FieldLabel htmlFor="product-option-count">
                Option Count
              </FieldLabel>
              <Input
                id="product-option-count"
                readOnly
                value={watch("options").length}
              />
            </Field>
          </FieldSet>
        </FieldGroup>

        <FieldGroup className="mt-15">
          <FieldSet className="grid grid-cols-6">
            <Field>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  addOption();
                }}
              >
                Add Option
              </Button>
            </Field>
            {watch("options").length > 0 ? (
              <>
                <Field>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      if (deleting >= 0) {
                        removeField(deleting);
                      }
                    }}
                  >
                    Delete Option
                  </Button>
                </Field>

                <Field className="w-100">
                  <Select
                    onValueChange={(e) => {
                      setDeleting(
                        watch("options").findIndex((x) => x.label === e)
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Option To Delete" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {watch("options").map((opt) =>
                          opt.label === "" ? (
                            <></>
                          ) : (
                            <SelectItem value={opt.label}>
                              {opt.displayLabel ? opt.displayLabel : opt.label}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </>
            ) : (
              <></>
            )}
          </FieldSet>

          {watch("options").length ? (
            optionFields.map((option, i) => (
              <>
                {i > 0 ? <FieldSeparator className="my-6" /> : <></>}
                <FieldGroup key={i} className="my-3">
                  <FieldSet className="grid grid-cols-3">
                    <Controller
                      name={`options.${i}.label`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field className="grid gap-3 h-40">
                          <FieldLabel htmlFor="product-option-label">
                            Option Label
                          </FieldLabel>
                          <Input
                            {...field}
                            id="product-option-label"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`options.${i}.displayLabel`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field className="grid gap-3">
                          <FieldLabel htmlFor="product-option-dlabel">
                            Option Display Label
                          </FieldLabel>
                          <Input
                            {...field}
                            id="product-option-dlabel"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Field className="grid grid-rows-3 items-end pb-0.5">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          addChoice(i);
                        }}
                      >
                        Add Choice
                      </Button>
                    </Field>
                  </FieldSet>

                  <Controller
                    control={control}
                    name={`options.${i}.choices`}
                    render={({ field }) => (
                      <ProductChoiceDefault
                        field={field}
                        watch={watch}
                        setValue={setValue}
                        option={option}
                        optionIndex={i}
                      />
                    )}
                  />
                </FieldGroup>
              </>
            ))
          ) : (
            <div className="flex justify-center items-center p-2 mt-0">
              No Option Settings
            </div>
          )}
        </FieldGroup>
      </FieldGroup>

      <SheetFooter>
        <Button type="submit">
          Save changes {saveMutation.isPending && "..."}
        </Button>
        <SheetClose asChild>
          <Button variant="outline" onClick={() => navigate("/options")}>
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};

export default ProductSheetForm;
