import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import RecommendationSection from "@/components/shopping-view/RecommendationSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { fetchProductsDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  imageSearchProducts,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { Camera, ImageIcon, Search, Sparkles, Tag, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { searchResults, tagRelated, isLoading, imageConcepts } = useSelector(
    (state) => state.shopSearch
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  // ── Image search state ──────────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImageMode, setIsImageMode] = useState(false);

  // ── Text search (debounced) ──────────────────────────────────────────────
  useEffect(() => {
    if (isImageMode) return; // don't trigger text search while in image mode

    if (keyword.trim().length > 3) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, isImageMode, dispatch, setSearchParams]);

  // ── Image upload handler ─────────────────────────────────────────────────
  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image must be smaller than 5 MB",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsImageMode(true);
    setKeyword("");
    setSearchParams(new URLSearchParams("?mode=image"));

    dispatch(imageSearchProducts(file)).then((action) => {
      if (action.meta.requestStatus === "rejected") {
        toast({
          title: action.payload || "Image search failed. Please try again.",
          variant: "destructive",
        });
      }
    });

    // Reset the file input so the same file can be re-selected
    e.target.value = "";
  }

  function clearImageSearch() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsImageMode(false);
    dispatch(resetSearchResults());
    setSearchParams(new URLSearchParams());
  }

  // ── Cart / product details ───────────────────────────────────────────────
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

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchToCart(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductsDetails(getCurrentProductId));
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto md:px-6 px-4 py-12">
      {/* ── Search Section ── */}
      <div className="max-w-3xl mx-auto mb-12">
        <p className="flex items-center justify-center gap-3 text-3xl font-bold text-center mb-6 text-gray-600 dark:text-gray-300">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="bg-clip-text bg-gradient-to-r from-primary to-purple-600 font-medium">
            Discover Amazing Products
          </span>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </p>

        {/* Search bar row */}
        <div className="flex gap-2 items-center">
          {/* Text input */}
          <div className="relative flex-1 flex items-center shadow-lg rounded-full overflow-hidden">
            <Input
              value={keyword}
              name="keyword"
              onChange={(e) => {
                clearImageSearch();
                setKeyword(e.target.value);
              }}
              disabled={isImageMode}
              className="py-6 pl-14 pr-6 text-lg border-0 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
              placeholder={
                isImageMode ? "Searching by image…" : "Search for products..."
              }
            />
            <div className="absolute left-5 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
          </div>

          {/* Camera / image search button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <motion.div whileTap={{ scale: 0.92 }}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Search by image"
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-12 rounded-full shadow-lg border-gray-200 hover:bg-primary hover:text-white transition-colors"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Image preview + detected concepts */}
        <AnimatePresence>
          {isImageMode && previewUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
            >
              {/* Thumbnail */}
              <div className="relative shrink-0">
                <img
                  src={previewUrl}
                  alt="Search image"
                  className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                />
                <button
                  onClick={clearImageSearch}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Clear image search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Concepts */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  {isLoading
                    ? "Analyzing image…"
                    : "Detected features"}
                </p>
                {isLoading ? (
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-16 rounded-full bg-gray-200 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {imageConcepts.length > 0 ? (
                      imageConcepts.map((concept) => (
                        <span
                          key={concept}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {concept}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">
                        No features detected
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Results Section ── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            {isImageMode ? (
              <ImageIcon className="w-5 h-5 text-primary" />
            ) : (
              <Search className="w-5 h-5 text-primary" />
            )}
            {isImageMode ? "Visual Search Results" : "Search Results"}
            {searchResults.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({searchResults.length} found)
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse h-72"
              />
            ))}
          </div>
        ) : !searchResults.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
              {isImageMode ? (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              ) : (
                <Search className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isImageMode
                ? tagRelated.length > 0
                  ? "No direct image matches found"
                  : "No matching products found"
                : keyword.trim().length > 3
                ? "No products found"
                : "Start your search"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              {isImageMode
                ? tagRelated.length > 0
                  ? "We couldn’t find exact matches, but related products are shown below. Try another photo for a closer match."
                  : "Try a different image or use the text search above"
                : keyword.trim().length > 3
                ? "Try different keywords or browse by category"
                : "Enter keywords or upload a photo to find products"}
            </p>
            {isImageMode && (
              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
                Try another image
              </Button>
            )}
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleAddtoCart={handleAddtoCart}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Tag-based / related products ── */}
      {tagRelated.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Related Products
            </h2>
          </div>
          <RecommendationSection
            title=""
            products={tagRelated}
            isLoading={false}
          />
        </div>
      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
