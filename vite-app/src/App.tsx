import "./App.css";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import ProductList from "@/components/ProductPage/product-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/options" />,
  },
  {
    path: "/options",
    element: <ProductList />,
  },
  {
    path: "/options/:productId",
    element: <ProductList />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
