import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { fetchProductsDetails } from "@/store/shop/products-slice";
import { useToast } from "@/hooks/use-toast";

/**
 * A horizontally scrollable "You might also like" strip.
 *
 * Props:
 *   title       – section heading (default "You Might Also Like")
 *   products    – array of product objects to display
 *   isLoading   – show skeleton placeholders while fetching
 */
export default function RecommendationSection({
  title = "You Might Also Like",
  products = [],
  isLoading = false,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const scrollRef = useRef(null);

  function scroll(direction) {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductsDetails(productId));
  }

  function handleAddtoCart(productId, totalStock) {
    const existingItems = cartItems?.items || [];
    const idx = existingItems.findIndex((i) => i.productId === productId);

    if (idx > -1) {
      const qty = existingItems[idx].quantity;
      if (qty + 1 > totalStock) {
        toast({
          title: `⚠️ Only ${qty} can be added for this item`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchToCart(user?.id));
          toast({ title: "Product added to cart" });
        }
      }
    );
  }

  // Don't render anything when there's nothing to show and not loading
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full w-9 h-9"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full w-9 h-9"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable product row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none" }} // hide scrollbar on Firefox
        >
          {isLoading
            ? // Skeleton placeholders
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[260px] h-[380px] rounded-xl bg-gray-100 animate-pulse"
                />
              ))
            : products.map((product) => (
                <div key={product._id} className="flex-shrink-0 w-[260px]">
                  <ShoppingProductTile
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
