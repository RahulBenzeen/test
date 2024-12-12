import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice'
import filterReducer from './filterSlice'
import authReducer from './authSlice'
import productReducer from './productSlice';
import productDetailsReducer from './productDetailSlice';
import addressReducer from './addressSlice'
import orderReducer from './orderSlice'
import similarProductReducer from './similarProduct'
export const store = configureStore({
    reducer:{
        cart:cartReducer,
        products: productReducer,
        productDetails: productDetailsReducer,
        filters:filterReducer,
        auth:authReducer,
        address: addressReducer,
        order: orderReducer,
        similarProducts: similarProductReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;