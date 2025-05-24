import Address from "@/components/shopping-view/Address";
import OShop from "../../assets/OnlineShopping.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/CartItemsContent";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

export default function ShopCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  const { approvalURL, isLoading } = useSelector((state) => state.shopOrders);

  const dispatch = useDispatch();
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log(orderData);
    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "Serini");
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[500px] w-full overflow-hidden">
        <img
          src={OShop}
          alt="Account Image"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-blue-500">
              Shipping Information
            </h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-blue-500">
                Your Orders
              </h2>

              {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                cartItems.items.map((cartItem, index) => (
                  <UserCartItemsContent
                    key={cartItem._id || cartItem.productId || index}
                    cartItems={cartItem}
                  />
                ))
              ) : (
                <p className="text-gray-500 italic">No items in your cart.</p>
              )}
            </div>

            {/* Total Amount */}
            <div className="mt-8 p-4 bg-gray-700  rounded-lg shadow-inner">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                <span className="text-white">Total</span>
                <span className="text-orange-300 text-xl font-bold">
                  ${totalCartAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-4 w-full">
              {/* initiate this one for the first tme some of the data we need to keep as static */}
              <Button
                onClick={handleInitiatePaypalPayment}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Checkout With PayPal"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
