import ProductList from "./product-list";
import ProductSheet from "./product-sheet";

const ProductPage = () => {
  return (
    <div className="xl:py-10">
      <ProductList />
      <ProductSheet />
    </div>
  );
};

export default ProductPage;
