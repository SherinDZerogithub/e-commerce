import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./CartItemsContent";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsercartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems?.length > 0
      ? cartItems.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item.salePrice : item?.price) *
              item?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col bg-white border-l border-gray-100 shadow-2xl p-0">
      {/* Header */}
      <SheetHeader className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-green-600 to-emerald-500">
        <SheetTitle className="text-white font-bold flex items-center gap-2 text-xl">
          <ShoppingCart className="w-5 h-5" />
          Your Cart
          {cartItems?.length > 0 && (
            <span className="ml-auto bg-white/20 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          )}
        </SheetTitle>
      </SheetHeader>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
        <AnimatePresence>
          {cartItems?.length > 0 ? (
            cartItems.map((item) => (
              <motion.div
                key={item._id || item.productId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <UserCartItemsContent cartItems={item} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-48 text-center gap-3"
            >
              <div className="bg-gray-100 rounded-full p-5">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-600">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add some products to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {cartItems?.length > 0 && (
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="text-2xl font-extrabold text-gray-900">
              ${totalCartAmount.toFixed(2)}
            </span>
          </div>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {
                navigate("/shop/checkout");
                setOpenCartSheet(false);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-green-200 transition-all gap-2"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      )}
    </SheetContent>
  );
}
