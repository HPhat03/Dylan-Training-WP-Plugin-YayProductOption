import type z from "zod";
import type { productIncludeFormSchema } from "./schema";

const BASE_URL = window.ypoData.base_url;

const ApiUrl = async (endpoint: string, method: string, body: any = null) => {
  const contextData = window.ypoData;
  const nonce = contextData.nonce;

  if (!nonce) {
    throw new Error("Missing nonce");
  }

  const url = BASE_URL + "/" + endpoint;

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": nonce,
    },
    body: body,
    credentials: "same-origin",
  });

  return response.json();
};

export const fetchProducts = async () => {
  return await ApiUrl("product", "GET");
};

export const fetchProduct = async (id: string | undefined) => {
  if (id == undefined) return {};
  return await ApiUrl(`product/${id}`, "GET");
};

export const saveProductOption = async (
  data: z.infer<typeof productIncludeFormSchema>
) => {
  var id = data.product.id;
  return await ApiUrl(`product/${id}`, "POST", JSON.stringify(data));
};
