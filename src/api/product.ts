import { FetchProductsParams, Product } from "../store/productSlice";
import api from "./index";


export const getProducts = (params: FetchProductsParams) => {
  const { page, limit, category, subcategory, brand, minPrice, maxPrice, rating, search, sortBy } = params;

  let url = `/api/products/all?page=${page}&limit=${limit}`;
  if (category) url += `&category=${category}`;
  if (subcategory) url += `&subcategory=${subcategory}`;
  if (brand) url += `&brand=${brand}`;
  if (minPrice !== undefined) url += `&minPrice=${minPrice}`;
  if (maxPrice !== undefined) url += `&maxPrice=${maxPrice}`;
  if (rating !== undefined && rating > 0) url += `&rating=${rating}`;
  if (search && search.trim()) url += `&search=${encodeURIComponent(search)}`;
  if (sortBy) url += `&sortBy=${sortBy}`;

  return api.get(url);
};

export const getProductsById = (id:string) => api.get(`/api/products/${id}`);
export const getRecentlyViewedProducts = () => api.get(`/api/products/recently-viewed`);
export const addProduct = (productData:Omit <Product, "_id">) => api.post('/api/products/add', productData)
export const updateProduct = (productData) => api.post('/api/products/add', productData)
export const deleteProduct = (productId:string) => api.post('/api/products/add', productId)
export const getSimilarProducts = (id:string) => api.get(`/api/products/similar-products/${id}`)
