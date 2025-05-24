import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-3 ">
        🎉 Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your purchase. Your order has been placed successfully!
      </p>
      <Button
        onClick={() => navigate("/shop/home")}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-300"
      >
        🏠 Back to Home
      </Button>

     <div className="pt-10">
     <Button
        onClick={() => navigate("/shop/account")}
        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-300"
      >
        🛍️ View My Orders
      </Button>
     </div>
    </div>
  );
}

export default PaymentSuccessPage;
