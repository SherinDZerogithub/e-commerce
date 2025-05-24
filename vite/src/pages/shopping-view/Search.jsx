import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { fetchProductsDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { Search, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  useEffect(() => {
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
  }, [keyword]);

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
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductsDetails(getCurrentProductId));
  }

  console.log("searchResults", searchResults);

  return (
    <div className="container mx-auto md:px-6 px-4 py-12">
      {/* Search Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <p className="flex items-center justify-center gap-3 text-3xl font-bold text-center mb-6 text-gray-600 dark:text-gray-300">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="bg-clip-text bg-gradient-to-r from-primary to-purple-600 font-medium">
            Discover Amazing Products
          </span>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </p>

        <div className="relative flex items-center shadow-lg rounded-full overflow-hidden">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6 pl-14 pr-6 text-lg border-0 focus-visible:ring-2 focus-visible:ring-primary/50"
            placeholder="Search for products..."
          />
          <div className="absolute left-5 text-gray-400">
            <Search className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Search Results
          </h2>
        </div>

        {!searchResults.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start your search
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Enter keywords in the search bar above to find products in our
              store
            </p>
          </div>
        ) : (
          <div className="p-6">
            {searchResults.map((product) => (
              <ShoppingProductTile
                key={product._id} // ✅ Unique key to prevent warning
                product={product}
                handleAddtoCart={handleAddtoCart}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        )}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
