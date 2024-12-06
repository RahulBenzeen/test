import { CartItem } from "../store/cartSlice";
import api from "./index";


export const getCart = () => api.get('/api/cart')
export const addToCart = (item:CartItem) => api.post('/api/cart', item)
export const removeFromCart = (itemId:string) => api.delete(`/api/cart/${itemId}`)
export const updateQuantity = (itemId:string , quantity:number) => api.put(`/api/cart/${itemId}`, { quantity })
// export const getCart = () => api.get('/api/cart')
// export const getCart = () => api.get('/api/cart')
// export const updateProduct = (productData) => api.post('/api/products/add',productData)
// export const deleteProduct = (productId:string) => api.post('/api/products/add',productId)