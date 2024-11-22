import api from "./index";

export const getProducts =() =>api.get('/products');
export const getProductsById = (id:string) => api.get(`/product/${id}`)