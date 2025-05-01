import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";

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

  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${
              index === currentslide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 `}
          />
        ))}
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card className="cursor-pointer overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg bg-gray-300">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold"> {categoryItem.label} </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 underline">
            Festure Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile product={productItem} />
                ))
              : null}
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
    </div>
  );
}
