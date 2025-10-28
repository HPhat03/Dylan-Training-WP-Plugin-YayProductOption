import type z from "zod";
import type { productIncludeSchema } from "./schema";
import type { Table } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";

export type YayProduct = z.infer<typeof productIncludeSchema>;
export interface IProductData {
  dataTable: Table<YayProduct>;
}

export interface IProductGlobalFn {
  dataTable: Table<YayProduct>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}
