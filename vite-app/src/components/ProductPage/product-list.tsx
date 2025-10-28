import {
  type ColumnFiltersState,
  type SortingState,
  useReactTable,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { ProductColumn } from "./ProductList/column";
import ProductFooter from "./ProductList/product-footer";
import ProductTable from "./ProductList/product-table";
import ProductFnBar from "./ProductList/product-fn-bar";
import { Card, CardContent } from "../ui/card";

const ProductList = () => {
  // Pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sorting
  const [sorting, setSorting] = useState<SortingState>([]);

  // Visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Filter
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Selection
  const [rowSelection, setRowSelection] = useState({});

  // Fetch Data
  const { data, error, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: async () => await fetchProducts(),
  });

  // Generate Column
  const columns = ProductColumn;

  const dataTable = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
    getRowId: (row) => row.product.id.toString(),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      return Object.values(row.original.product).some((value) =>
        String(value).toLowerCase().includes(search)
      );
    },
  });

  if (isLoading) return "Loading...";
  if (error) return "Error!";

  return (
    <>
      <Card className="w-full max-w-6xl ">
        <CardContent>
          <ProductFnBar
            dataTable={dataTable}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
            <div className="overflow-hidden rounded-lg border">
              <ProductTable dataTable={dataTable} />
            </div>
            <ProductFooter dataTable={dataTable} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductList;
