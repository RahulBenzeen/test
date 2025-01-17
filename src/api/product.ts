import { FetchProductsParams, Product } from "../store/productSlice";
import { FetchSpecialOffersParams } from "../store/specialProductSlice";
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

export const getSpecialOfferProducts = (params: FetchSpecialOffersParams) => {
  const { page, limit, minPrice, maxPrice, sortBy } = params;

  let url = `/api/products/special-offers?page=${page}&limit=${limit}`;
  if (minPrice !== undefined) url += `&minPrice=${minPrice}`;
  if (maxPrice !== undefined) url += `&maxPrice=${maxPrice}`;
  if (sortBy) url += `&sortBy=${sortBy}`;

  return api.get(url);
};


export const getProductsById = (id:string) => api.get(`/api/products/${id}`);
export const getRecentlyViewedProducts = () => api.get(`/api/products/recently-viewed`);
export const addProduct = (productData:Omit <Product, "_id">) => api.post('/api/products/add', productData)
export const updateProduct = (productId:string , productData:Product) => api.put(`/api/products/${productId}`, productData)
export const deleteProduct = (productId:string) => api.delete(`/api/admin/products/${productId}`)
export const getSimilarProducts = (id:string) => api.get(`/api/products/similar-products/${id}`)
