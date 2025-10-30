import z from "zod";

const choiceSchema = z.object({
  title: z.string(),
  value: z.string(),
  color: z.string(),
});
const optionSchema = z.object({
  label: z.string(),
  displayLabel: z.string(),
  choices: z.array(choiceSchema),
});
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const productIncludeSchema = z.object({
  product: productSchema,
  options: z.array(optionSchema),
});

const choicesFormSchema = z.object({
  title: z.string().min(1, "Fill in the title"),
  value: z.string().min(1, "Fill in the value"),
  color: z.string().min(1, "Fill in the color"),
});

const optionFormSchema = z.object({
  label: z.string().min(1, "Fill in the label"),
  displayLabel: z.string().min(1, "Fill in the display label"),
  choices: z.array(choicesFormSchema).min(1, "Add at least 1 choices"),
});

const productFormSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(50, "Name must not be over 50 characters"),
});

export const productIncludeFormSchema = z.object({
  product: productFormSchema,
  options: z.array(optionFormSchema),
});
