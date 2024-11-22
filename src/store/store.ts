import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice'
import filterReducer from './filterSlice'
import authReducer from './authSlice'
import productReducer from './productSlice';
import productDetailsReducer from './productDetailSlice';


export const store = configureStore({
    reducer:{
        cart:cartReducer,
        products: productReducer,
        productDetails: productDetailsReducer,
        filters:filterReducer,
        auth:authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;