import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductSlice from "./admin/Products-slice";
import adminOrderSlice from "./admin/order-slice";

import shoppingProductSlice from "./shop/products-slice";
import shoppingCartSlice from "./shop/cart-slice";
import addressSlice from "./shop/address-slice";
import shoppingOrderSlice from "./shop/order-slice";
import shoppingSearchSlice from "./shop/search-slice";
import shoppingReviewSlice from "./shop/review-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: addressSlice,
    shopOrders: shoppingOrderSlice,
    adminOrder: adminOrderSlice,
    shopSearch: shoppingSearchSlice,
    shopReview: shoppingReviewSlice,
  },
});

export default store;

//thisstore we need to connect with react application
