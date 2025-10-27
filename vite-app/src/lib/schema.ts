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
  product: z.object(productSchema),
  options: z.array(optionSchema),
});
