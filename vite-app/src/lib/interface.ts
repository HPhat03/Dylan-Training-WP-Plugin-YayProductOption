import type z from "zod";
import type { productIncludeSchema } from "./schema";
import type { Row } from "@tanstack/react-table";

export type YayProduct = z.infer<typeof productIncludeSchema>;
export interface IDataTable {
  data: YayProduct[];
}

export interface IMyTableCell {
  row: Row<YayProduct>;
}
