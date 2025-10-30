import type z from "zod";
import type { productIncludeSchema, validationErrorSchema } from "./schema";
import type { Table } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import type {
  ControllerRenderProps,
  FieldArrayWithId,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type YayProduct = z.infer<typeof productIncludeSchema>;
export interface IProductData {
  dataTable: Table<YayProduct>;
}

export interface IProductGlobalFn {
  dataTable: Table<YayProduct>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}

export interface ISheetForm {
  initialData: YayProduct | undefined;
}

export interface IProductChoice {
  field: ControllerRenderProps<YayProduct, `options.${number}.choices`>;
  watch: UseFormWatch<YayProduct>;
  setValue: UseFormSetValue<YayProduct>;
  option: FieldArrayWithId<YayProduct, "options", "id">;
  optionIndex: number;
}

export interface IErrorDialog {
  error: boolean;
  messages: any[];
}
