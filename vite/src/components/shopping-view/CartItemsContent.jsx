import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function UserCartItemsContent({ cartItems }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cartItem } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  function handleCartItemDelete(item) {
    dispatch(deleteCartItem({ userId: user?.id, productId: item?.productId }));
  }

  function handleUpdateQuantity(item, action) {
    if (action === "add") {
      const getCarts = cartItem?.items || [];
      const idx = getCarts.findIndex((c) => c.productId === item?.productId);
      const prodIdx = productList.findIndex((p) => p._id === item?.productId);
      const totalStock = productList[prodIdx]?.totalStock;

      if (idx > -1 && getCarts[idx].quantity + 1 > totalStock) {
        toast({
          title: `Only ${getCarts[idx].quantity} items available`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: item?.productId,
        quantity: action === "add" ? item.quantity + 1 : item.quantity - 1,
      })
    );
  }

  const lineTotal =
    ((cartItems?.salePrice > 0 ? cartItems?.salePrice : cartItems?.price) *
      cartItems?.quantity).toFixed(2);

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Product image */}
      <div className="relative flex-shrink-0">
        <img
          src={cartItems?.image}
          alt={cartItems?.title}
          className="w-20 h-20 rounded-xl object-cover shadow-sm"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm truncate leading-tight mb-0.5">
          {cartItems?.title}
        </h3>
        {cartItems?.salePrice > 0 && (
          <p className="text-xs text-gray-400 line-through">${cartItems?.price}</p>
        )}
        <p className="text-sm font-bold text-emerald-600 mb-2">
          ${cartItems?.salePrice > 0 ? cartItems?.salePrice : cartItems?.price}
          {" "}/ unit
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleUpdateQuantity(cartItems, "delete")}
            disabled={cartItems?.quantity === 1}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3 h-3 text-gray-600" />
          </motion.button>
          <span className="text-sm font-bold text-gray-800 w-5 text-center">
            {cartItems?.quantity}
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleUpdateQuantity(cartItems, "add")}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-3 h-3 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Price + delete */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <span className="font-extrabold text-gray-900 text-sm">${lineTotal}</span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => handleCartItemDelete(cartItems)}
          className="p-1.5 rounded-full hover:bg-red-50 transition-colors group"
        >
          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </motion.button>
      </div>
    </div>
  );
}
