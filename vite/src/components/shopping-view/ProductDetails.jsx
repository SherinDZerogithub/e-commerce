import React, { useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";

export default function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}) {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const dispatch = useDispatch();
  function handleAddtoCart(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchToCart(user?.id)); // ✅ Make sure `user?.id` is not undefined
        toast({
          title: "Product is added to cart",
          variant: "",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="aspect-square object-cover w-[400px] h-[500px] "
          />
        </div>
        <div className="gap-6 ">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-2xl mb-4">
              {productDetails?.description}
            </p>

            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  productDetails?.salePrice > 0
                    ? "line-through text-gray-400"
                    : ""
                } text-lg font-semibold text-primary`}
              >
                ${productDetails?.price}
              </span>
              {productDetails?.salePrice > 0 && (
                <span className="text-lg font-bold text-green-600">
                  ${productDetails?.salePrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 fill-primary cursor-pointer " />
                <StarIcon className="w-4 h-4 fill-primary cursor-pointer " />
                <StarIcon className="w-4 h-4 fill-primary cursor-pointer " />
                <StarIcon className="w-4 h-4 fill-primary cursor-pointer " />
                <StarIcon className="w-4 h-4 fill-primary cursor-pointer " />
              </div>
            </div>
            <p>Rating: 4.5 </p>
          </div>

          <div className="max-h-[300px] overflow-auto ">
            <h2 className="text-xl font-bold mb-4">Review</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar className="bg-black cursor-pointer">
                  <AvatarFallback className="bg-black text-white font-extrabold">
                    {user?.userName
                      ?.split(" ")
                      .map((word) => word[0]?.toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h2> {user?.userName} </h2>
                  </div>

                  <div className=" h-[170px] w-[320px]">
                    <Input placeholder="Write A Review text-muted-foreground mb-4" />
                    <Button className="mt-5">Submit</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          <div className="mt-5 mb-2">
            <Button
              onClick={() => handleAddtoCart(productDetails?._id)}
              className=" bg-red-700 w-full"
            >
              Add To Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
