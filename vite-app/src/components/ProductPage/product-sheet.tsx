import { useNavigate, useParams } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useEffect, useState } from "react";
import ProductSheetForm from "./ProductSheet/product-form";
import { fetchProduct } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { YayProduct } from "@/lib/interface";

const ProductSheet = () => {
  const { productId } = useParams();
  const [isOpen, SetOpen] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<YayProduct, Error>({
    queryKey: ["product-detail", productId],
    queryFn: async () => await fetchProduct(productId),
    enabled: !!productId,
  });

  useEffect(() => {
    if (productId && !error && !isLoading) {
      SetOpen(true);
    } else {
      if (error) console.log(error);
      SetOpen(false);
    }
  }, [productId, error, isLoading]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) navigate("/options");
      }}
    >
      <SheetContent className="overflow-y-scroll min-w-3/5">
        <SheetHeader className="mt-10">
          <SheetTitle>Edit product</SheetTitle>
          <SheetDescription>
            Make changes to your product here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <ProductSheetForm initialData={data} />
      </SheetContent>
    </Sheet>
  );
};

export default ProductSheet;
