import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

export default function UserCartItemsContent({ cartItems }) {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { toast } = useToast();
   const {  cartItem} = useSelector((state) => state.shopCart);
  //for the total stock we will first get the list of products
  const { productList } = useSelector((state) => state.shopProducts);
  function handleCartItemDelete(getcartItems) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getcartItems?.productId })
    );
  }
  function handleUpdateQuantity(getcartItems, typeOfAction) {
     
     if (typeOfAction == "add") {
      let getCarts = cartItem.items || [];

      if (getCarts.length) {
        const indexOfCurrentCartItem = getCarts.findIndex(
          (item) => item.productId === getcartItems?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getcartItems?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

        if (indexOfCurrentCartItem > -1) {
          
          const getQuantity = getCarts[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: ` Only ${getQuantity} Items can be added for this product`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getcartItems?.productId,
        quantity:
          typeOfAction === "add"
            ? getcartItems?.quantity + 1
            : getcartItems?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: `cart Item is ${typeOfAction}ed successfully`,
          variant: "success",
        });
      }
    });
  }

  return (
    <div className="flex items-center gap-4">
      <img
        src={cartItems?.image}
        alt={cartItems?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItems?.title}</h3>
        <div className="flex items-center mt-2 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full p-1"
            disabled={cartItems?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItems, "delete")}
          >
            <Minus className="w-4 h-4 text-black" />
            <span className="sr-only">Decrese</span>
          </Button>
          <span className="text-sm font-semibold"> {cartItems?.quantity} </span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full p-1"
            onClick={() => handleUpdateQuantity(cartItems, "add")}
          >
            <Plus className="w-4 h-4 text-black" />
            <span className="sr-only">Increse</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          {" "}
          $
          {(
            (cartItems?.salePrice > 0
              ? cartItems?.salePrice
              : cartItems?.price) * cartItems?.quantity
          ).toFixed(2)}{" "}
        </p>
        <div
          onClick={() => handleCartItemDelete(cartItems)}
          className="cursor-pointer mt-1 p-1 rounded-full border border-transparent hover:border-red-500 hover:bg-red-100 transition-colors"
        >
          <Trash className="text-red-700" size={20} />
        </div>
      </div>
    </div>
  );
}
