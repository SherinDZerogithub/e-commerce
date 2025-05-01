//this will hold all the application state
//redux toolkit need slices
//eg: login and authentication related->auth slice
//admin side-> admin slice

//------------------------------------------------------------------//

//this is the global reducer
//combine all of the slices into a one slice

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductSlice from "./admin/Products-slice";
import shoppingProductSlice from "./shop/products-slice";
import shoppingCartSlice from './shop/cart-slice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice
  },
});

export default store;

//thisstore we need to connect with react application
