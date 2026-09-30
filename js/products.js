const PRODUCTS_URL = "data/products.json";

let productsPromise = null;

export function loadProducts() {
  if (!productsPromise) {
    productsPromise = fetch(PRODUCTS_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${PRODUCTS_URL}: ${response.status}`);
      }
      return response.json();
    });
  }
  return productsPromise;
}

export function getDefaultSizeIndex(product) {
  const index = product.sizes.findIndex((size) => size.default);
  return index === -1 ? 0 : index;
}

export function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}
