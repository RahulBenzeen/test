import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice'
import filterReducer from './filterSlice'
import authReducer from './authSlice'
import productReducer from './productSlice';
import productDetailsReducer from './productDetailSlice';
import addressReducer from './addressSlice'
import orderReducer from './orderSlice'
import similarProductReducer from './similarProduct'
import reviewReducer from './reviewSlice'
import userReducer from './adminSlice'
import allOrderReducer from './allOrdersSlice'
import specialOfferProduct from './specialProductSlice'
import subscriptionReducer from './subscriptionSlice'
import whislistReducer from './whislistSlice'
export const store = configureStore({
    reducer:{
        cart:cartReducer,
        products: productReducer,
        productDetails: productDetailsReducer,
        filters:filterReducer,
        auth:authReducer,
        address: addressReducer,
        order: orderReducer,
        similarProducts: similarProductReducer,
        reviews: reviewReducer,
        users:userReducer,
        allOrders:allOrderReducer,
        specialOffers: specialOfferProduct,
        subscription : subscriptionReducer,
        whishlist: whislistReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;