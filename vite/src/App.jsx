import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminProducts from "./pages/admin-view/Products";
import AdminOrders from "./pages/admin-view/Orders";
import AdminFeatures from "./pages/admin-view/Features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShopListing from "./pages/shopping-view/Listing";
import ShopCheckout from "./pages/shopping-view/Checkout";
import ShopAccount from "./pages/shopping-view/Account";
import CheckAuth from "./components/common/checkAuth";
import ShopHome from "./pages/shopping-view/Home";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnShopPage from "./pages/shopping-view/PaypalReturn";
import PaymentSuccessPage from "./pages/shopping-view/PaymentSuccessPage";
import SearchProducts from "./pages/shopping-view/Search";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  console.log("App status =>", { isAuthenticated, user, isLoading });

  if (isLoading) {
    return <Skeleton className="w-full h-screen bg-black" />; // Show a loading spinner or message until auth check completes
  }
  console.log("App status =>", {
    isAuthenticated,
    user,
    isLoading,
  });
  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        {/* common components */}
        <Routes>
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            {/* inside this route you can take multiple routes */}
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>
          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShopHome />} />
            <Route path="listing" element={<ShopListing />} />
            <Route path="checkout" element={<ShopCheckout />} />
            <Route path="account" element={<ShopAccount />} />
            <Route path="paypal-return" element={<PaypalReturnShopPage />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/unauth-page" element={<UnauthPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
