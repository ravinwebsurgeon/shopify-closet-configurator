import { api } from "./api";

export const getPriceProductById = async (id) => {
  try {
    const response = await api.get(`products/${id}`);
    if (response) {
      const metafields = response?.data?.metafields;

      const structuredPricing = {
        shelves:
          metafields.find((field) => field.key === "shelves_pricing")?.value ||
          {},
        poles: metafields.find((field) => field.key === "poles")?.value || {},
        sidewall: {
          perfo:
            metafields.find((field) => field.key === "sidewall_perfo")?.value ||
            {},
          closed:
            metafields.find((field) => field.key === "sidewall_closed")
              ?.value || {},
        },
        compartment: {
          sliding_partition:
            metafields.find(
              (field) => field.key === "compartment_sliding_partition_pricing"
            )?.value || {},
          compartment_divider_set:
            metafields.find((field) => field.key === "compartment_divider_set")
              ?.value || {},
        },
        braces: {
          "x-brace":
            metafields.find((field) => field.key === "braces_x_braces_pricing")
              ?.value || {},
          "h-brace":
            metafields.find((field) => field.key === "braces_h_braces_pricing")
              ?.value || {},
        },
        wardrobe_rod:
          metafields.find((field) => field.key === "wardrobe_rod")?.value || {},
        topCaps:
          metafields.find((field) => field.key === "topcap_plastic_")?.value ||
          {},
        foot:
          metafields.find((field) => field.key === "foot_plastic_pricing")
            ?.value || {},
      };
      return { rawData: response.data, structuredPricing}
    }
  } catch (error) {
      throw error
  }
};



export const createProduct = async (productData) => {
  return await api.post("products/create", productData);
};

