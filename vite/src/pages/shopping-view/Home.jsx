import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.jpg";
import bannerTwo from "../../assets/banner-2.jpg";
import bannerThree from "../../assets/banner-3.jpg";
import nikeLogo from "../../assets/Nike.jpg";
import adidasLogo from "../../assets/addidas.png";
import pumaLogo from "../../assets/puma.jpg";
import zaraLogo from "../../assets/Zara.png";
import hmLogo from "../../assets/H&M-Logo.wine.png";
import levisLogo from "../../assets/Levi1.png"; // if available

import {
  Baby,
  ChevronLeftIcon,
  ChevronRightIcon,
  Footprints,
  Shirt,
  Sparkles,
  Watch,
  ShirtIcon,
  ShoppingBag,
  ZapIcon,
  SearchXIcon,
  Search,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductsDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";

import { useNavigate } from "react-router-dom";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: Shirt },
  { id: "women", label: "Women", icon: Sparkles },
  { id: "kids", label: "Kids", icon: Baby },
  { id: "accessories", label: "Accessories", icon: Watch },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", logo: nikeLogo },
  { id: "adidas", label: "Adidas", logo: adidasLogo },
  { id: "puma", label: "Puma", logo: pumaLogo },
  { id: "levi", label: "Levi's", logo: levisLogo },
  { id: "zara", label: "Zara", logo: zaraLogo },
  { id: "h&m", label: "H&M", logo: hmLogo },
];

export default function ShopHome() {
  const [currentslide, setCurrentslide] = useState(0);
 
  const slides = [bannerOne, bannerTwo, bannerThree];
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
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
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductsDetails(getCurrentProductId));
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentslide((prevSlide) => (prevSlide + 1) % slides.length);
      //need to change the image slide in two seconds-2000 everytime
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${
              index === currentslide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 `}
          />
        ))}
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-400/40 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center max-w-3xl w-full">

          <div className="flex items-center gap-3 animate-fade-in">
            <Search className="w-20 h-20 text-black" strokeWidth={2.5} />
            <span className="text-black text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-xl">
              Search Your Desired Product
            </span>
          </div>
         
          <Button
            variant="default"
            className="mt-2 bg-orange-500 text-black hover:bg-orange-600 font-semibold"
            onClick={() => navigate("/shop/search")}
          >
            Search Your Product <ArrowRight/>
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentslide(
              (prevSide) => (prevSide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1 bg-gray-300 w-20 h-20 p-0 rounded-full shadow-lg"
        >
          <ChevronLeftIcon className="w-20 h-20" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentslide(
              (prevSide) => (prevSide + 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1 bg-gray-300 w-20 h-20 p-0 rounded-full shadow-lg"
        >
          <ChevronRightIcon className="w-20 h-20" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 underline">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg bg-gray-300"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold"> {categoryItem.label} </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 underline">
            Shop By Brandd
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                key={brandItem.id}
                className="cursor-pointer overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg bg-gray-300"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={brandItem.logo}
                    alt={brandItem.label}
                    className="w-16 h-16 object-contain mb-4"
                  />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 underline">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleAddtoCart={handleAddtoCart}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
