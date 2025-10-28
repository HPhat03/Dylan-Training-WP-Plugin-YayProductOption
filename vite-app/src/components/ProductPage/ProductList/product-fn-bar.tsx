import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { IProductGlobalFn } from "@/lib/interface";
import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react";
import type React from "react";

const ProductFnBar: React.FC<IProductGlobalFn> = ({
  dataTable,
  globalFilter,
  setGlobalFilter,
}) => {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Product Table
      </h3>
      <div className="flex items-center gap-2 p-2">
        <Input
          className="max-w-sm"
          type="text"
          placeholder="Filter"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="lg:inline">Columns Visibility</span>
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
  );
};

export default ProductFnBar;
