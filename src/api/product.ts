import { Product } from "../store/productSlice";
import api from "./index";


export const getProducts = (page: number, limit: number) => {
    return api.get(`/api/products/all?page=${page}&limit=${limit}`);
  };
export const getProductsById = (id:string) => api.get(`/api/products/${id}`);
export const getRecentlyViewedProducts = () => api.get(`/api/products/recently-viewed`);
export const addProduct = (productData:Omit <Product, "_id">) => api.post('/api/products/add', productData)
export const updateProduct = (productData) => api.post('/api/products/add',productData)
export const deleteProduct = (productId:string) => api.post('/api/products/add',productId)
