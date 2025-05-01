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
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function createSearchParamsHelper(filterParams) {
  const queryParams = new URLSearchParams();

  //This line initiates a for...of loop that iterates over each key-value pair in the filterParams object.
  //The Object.entries() method converts the object into an array of its entries (key-value pairs)
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
  //This function is used to send actions to the Redux store.
  const dispatch = useDispatch();

  //This line declares a state variable named filters and a function setFilters to update that state.
  //Whenever you want to change the filters, you would call setFilters with the new value.
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const { cartItems } = useSelector((state) => state.shopCart);

  const { user } = useSelector((state) => state.auth);
  const {toast} = useToast()

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    console.log(getSectionId, getCurrentOption);

    //A shallow copy of the existing filters object is created.
    // This ensures that any modifications will not affect the original filters object directly.
    let copyFilters = { ...filters };

    //The code checks if the getSectionId exists in the keys of the copyFilters object and stores its index.
    //  If it does not exist, indexOfCurrentSection will be -1.
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      copyFilters = {
        //check the current filters\
        ...copyFilters,
        //If the section does not exist in copyFilters, a new entry is created with getSectionId
        [getSectionId]: [getCurrentOption],
      };
    } else {
      //If the section exists, it checks if getCurrentOption is already included in the array for that section:
      const indexOfCurrentOption =
        copyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        //If not found (indexOfCurrentOption === -1), it adds getCurrentOption to the array.
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        //If found, it removes getCurrentOption from the array using splice.
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    console.log("copyFilters", copyFilters);
    setFilters(copyFilters);

    //This allows the filters to persist even if the page is refreshed.
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductsDetails(getCurrentProductId));
  }

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
        })
      }
    });
  }

  //This is a React hook that allows you to perform side effects in function components.
  useEffect(() => {
    //This code retrieves the saved filters from sessionStorage and sets them in the filters state variable.
    //If the item does not exist (i.e., it returns null), the code defaults to an empty object {} and sets it in the filters state variable.
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};

    setFilters(savedFilters);
    setSort("price-lowtohigh");
    // The empty dependency array [] means this effect will only run once when the component mounts.
  }, []);

  //useEffect is called to perform a side effect whenever its dependencies change.
  //  In this case, the dependencies are dispatch, filters, and sort
  useEffect(() => {
    if (filters !== null && sort !== null)
      // Trigger API call when filters or sort changes
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, filters, sort]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);
  // This means that the effect will run whenever the filters variable changes.

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

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
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6 ">
      <ProductFilter filter={filters} handleFilters={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm ">
        <div className="p-4  border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold"> All Products</h2>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {" "}
              {productList?.length} Products{" "}
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
              <DropdownMenuContent align="end" className="w-[200px] ">
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
