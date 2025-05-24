import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Star, StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRating from "../common/StarRating";
import StarRatingcomponent from "../common/StarRating";
import StarRatingComponent from "../common/StarRating";
import { useEffect, useState } from "react";
import { addNewReviews, getReviews } from "@/store/shop/review-slice";

export default function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}) {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }
  function handleAddReview() {
    if (!rating) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addNewReviews({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((result) => {
      console.log("Add review result:", result);

      const isSuccess = result?.meta?.requestStatus === "fulfilled";

      if (isSuccess) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        toast({
          title: result?.error?.message || "Failed to add review",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id)).then((res) => {
        console.log("Fetched reviews after submission:", res);
      });
    }
  }, [productDetails]);

  console.log(reviews, "reviews");

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `⚠️ Only ${getQuantity} can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

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
    setRating(0);
    setReviewMsg("");
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[70vw] xl:max-w-[60vw] rounded-lg">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-xl bg-gray-50 aspect-square flex items-center justify-center">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="object-contain w-full h-full p-4 transition-all hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          {/* Title & Description */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
              {productDetails?.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {productDetails?.description}
            </p>

            {/* Price Section */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-baseline gap-2">
                {productDetails?.salePrice > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      ${productDetails?.salePrice}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${productDetails?.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    ${productDetails?.price}
                  </span>
                )}
              </div>
            </div>

            {/* Stock & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Stock:
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {productDetails?.totalStock ?? "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">4.5</span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Reviews
            </h2>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">
                  {user?.userName
                    ?.split(" ")
                    .map((word) => word[0]?.toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-2">
                  <h3 className="font-medium text-gray-800">
                    {user?.userName}
                  </h3>
                </div>
                <div className="space-y-4 mt-10 flex-col gap-3">
                  <Label> Write Your Review</Label>
                  <div className="flex ">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Write a review..."
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                  <Button
                    className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800"
                    disabled={reviewMsg.trim() === ""}
                    onClick={handleAddReview}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-auto pt-4 border-t">
            {productDetails?.totalStock === 0 ? (
              <Button
                disabled
                className="w-full py-6 text-lg font-medium bg-red-600 hover:bg-red-700 transition-colors"
              >
                Out Of Stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddtoCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
                className="w-full py-6 text-lg font-medium bg-black hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
