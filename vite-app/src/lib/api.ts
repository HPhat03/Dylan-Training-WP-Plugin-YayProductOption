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

export const fetchProducts = async (id: string = "") => {
  if (id) {
    return await ApiUrl(`product/${id}`, "GET");
  } else {
    return await ApiUrl("product", "GET");
  }
};
