import { fetchProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const ProductList = () => {
  const nav = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const { data, error, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () =>
      await fetchProducts(productId === undefined ? "" : productId),
  });

  if (isLoading) return "Loading...";
  if (error) return "Error!";

  return (
    <>
      <div
        className="text-blue-600 py-10"
        onClick={() => {
          nav("/options/145");
        }}
      >
        This is YPO List {JSON.stringify(data)}
      </div>
    </>
  );
};

export default ProductList;
