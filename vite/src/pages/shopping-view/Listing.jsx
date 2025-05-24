import ProductFilter from "@/components/shopping-view/Filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import {
  fetchAllFilteredProducts,
  fetchProductsDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "../../components/shopping-view/ProductTile";
import { useLocation, useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";


function createSearchParamsHelper(filterParams) {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((val) => {
        queryParams.append(key, val);
      });
    }
  }
  return queryParams;
}

export default function ShopListing() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const categorySearchParams = searchParams.get("category");
  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let copyFilters = { ...filters };
    const sectionExists = Object.keys(copyFilters).includes(getSectionId);

    if (!sectionExists) {
      copyFilters[getSectionId] = [getCurrentOption];
    } else {
      const optionIndex = copyFilters[getSectionId].indexOf(getCurrentOption);
      if (optionIndex === -1) {
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        copyFilters[getSectionId].splice(optionIndex, 1);
      }
    }

    setFilters(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductsDetails(getCurrentProductId));
  }

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

  // Load filters and default sort on first render
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setFilters(savedFilters);
    setSort("price-lowtohigh");
  }, [categorySearchParams]);

  // Apply filters and sort to URL as query params
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      setSearchParams(queryString);
    }
  }, [filters, setSearchParams]);

  // Fetch products on filter or sort change
  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
        })
      );
    }
  }, [dispatch, filters, sort]);

  // Re-fetch on navigation change (ex: switching category like Kids/Men)
  useEffect(() => {
    // 👇 Use location.state to set filters from header/category navigation
    const storedFilters = sessionStorage.getItem("filters");
    const parsedFilters = storedFilters ? JSON.parse(storedFilters) : null;

    // Check if category filter is passed via navigation (e.g. { category: ['tech'] })
    const categoryFilterFromLocation = location.state?.filters;

    const finalFilters = categoryFilterFromLocation || parsedFilters || {};

    // ✅ Set filters state
    setFilters(finalFilters);
    setSort("price-lowtohigh");

    // ✅ Persist to session storage
    sessionStorage.setItem("filters", JSON.stringify(finalFilters));
  }, [location.state]);

  // Show product dialog
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  // Alert when cart items are fetched
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      alert(
        `Cart Items:\n${cartItems
          .map((item) => `${item.productId.name} x ${item.quantity}`)
          .join("\n")}`
      );
    }
  }, [cartItems]);

  return (

    //this si the products paaaaaaaaaaaaaaaaaaaaaaaaaaaaageeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filter={filters} handleFilters={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="cursor-pointer"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
