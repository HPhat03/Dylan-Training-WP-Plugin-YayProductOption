import type { IMyTableCell, YayProduct } from "@/lib/interface";
import { Button } from "@/components/ui/button";

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
} from "@tabler/icons-react";
import {
  type ColumnFiltersState,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const baseColumn: ColumnDef<YayProduct>[] = [
  {
    accessorKey: "product.name",
    header: ({ column }) => (
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "optionCount",
    header: "Option Count",
    cell: ({ row }) => {
      return (
        <div className="w-32">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.options.length}
          </Badge>
        </div>
      );
    },
  },
];

const lastColumn: ColumnDef<YayProduct>[] = [
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View at Front-end</DropdownMenuItem>
          <DropdownMenuItem>View at Admin</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    // enableHiding: false,
  },
];

const extractAllUniqueCol = (data: YayProduct[]) => {
  if (!data) return [];
  var map = new Map<string, string>();

  data.forEach((product) => {
    product.options.forEach((opt) => {
      if (!map.has(opt.label)) {
        map.set(opt.label, opt.displayLabel);
      }
    });
  });

  return Array.from(map.entries()).map(([label, displayLabel]) => ({
    label,
    displayLabel,
  }));
};

const generateColumn = (data: YayProduct[]) => {
  if (!data) return [];
  const labelMap = extractAllUniqueCol(data);

  const uniqueColumn: ColumnDef<YayProduct>[] = labelMap.map((entry) => ({
    id: entry.label,
    header: ({ column }) => (
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {entry.displayLabel}
        <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
      </div>
    ),
    cell: ({ row }) => {
      const colMatched = row.original.options.find(
        (x) => x.label === entry.label
      );
      if (colMatched) {
        return (
          <div>
            {colMatched.choices.map((c) => {
              const color = c.color.trim();
              if (colMatched.label.toLowerCase() == "color") {
                return (
                  <Tooltip key={c.title + "_" + c.value}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="w-6 h-6 rounded-full border-dotted border-2 border-gray-950"
                        style={{ backgroundColor: color }}
                      />
                    </TooltipTrigger>
                    <TooltipContent> Color: {c.title} </TooltipContent>
                  </Tooltip>
                );
              }
              return (
                <Badge
                  key={c.title}
                  variant="outline"
                  className="text-muted-foreground px-1.5"
                >
                  {c.title}
                </Badge>
              );
            })}
          </div>
        );
      }
      return (
        <Badge variant="destructive" className="px-1.5 text-white">
          No option setting
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  }));

  return [...baseColumn, ...uniqueColumn, ...lastColumn];
};

const MyTableCell: React.FC<IMyTableCell> = ({ row }) => {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

const DataTable = () => {
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

  // Fetch Data
  const { data, error, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: async () => await fetchProducts(),
  });

  // Generate Column
  const columns = useMemo(() => generateColumn(data), [data]);

  const dataTable = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    getRowId: (row) => row.product.id.toString(),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
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
      <div className="w-full flex-col justify-start gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector">Product Table</Label>
          <div className="flex items-center gap-2">
            <Input
              className=""
              type="text"
              placeholder="Filter"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {dataTable
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {dataTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {dataTable.getRowModel().rows?.length ? (
                  dataTable
                    .getRowModel()
                    .rows.map((row) => <MyTableCell key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground flex-1 text-sm lg:flex">
              {dataTable.getFilteredRowModel().rows.length} row(s) displaying.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${dataTable.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    dataTable.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue
                      placeholder={dataTable.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {dataTable.getState().pagination.pageIndex + 1} of{" "}
                {dataTable.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => dataTable.setPageIndex(0)}
                  disabled={!dataTable.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => dataTable.previousPage()}
                  disabled={!dataTable.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => dataTable.nextPage()}
                  disabled={!dataTable.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() =>
                    dataTable.setPageIndex(dataTable.getPageCount() - 1)
                  }
                  disabled={!dataTable.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTable;
