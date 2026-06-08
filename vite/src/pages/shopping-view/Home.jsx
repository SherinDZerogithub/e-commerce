import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.jpg";
import bannerTwo from "../../assets/banner-2.jpg";
import bannerThree from "../../assets/banner-3.jpg";
import nikeLogo from "../../assets/Nike.jpg";
import adidasLogo from "../../assets/addidas.png";
import pumaLogo from "../../assets/puma.jpg";
import zaraLogo from "../../assets/Zara.png";
import hmLogo from "../../assets/H&M-Logo.wine.png";
import levisLogo from "../../assets/Levi1.png";

import {
  Baby,
  ChevronLeftIcon,
  ChevronRightIcon,
  Footprints,
  Shirt,
  Sparkles,
  Watch,
  ArrowRight,
  Search,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductsDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/ProductTile";
import RecommendationSection from "@/components/shopping-view/RecommendationSection";
import { fetchRecommendations } from "@/store/shop/recommendations-slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/ProductDetails";
import { motion, AnimatePresence } from "framer-motion";
import { fetchShopFeatures } from "@/store/shop/features-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: Shirt, color: "from-blue-500 to-blue-600" },
  { id: "women", label: "Women", icon: Sparkles, color: "from-pink-500 to-rose-500" },
  { id: "kids", label: "Kids", icon: Baby, color: "from-yellow-400 to-orange-400" },
  { id: "accessories", label: "Accessories", icon: Watch, color: "from-purple-500 to-violet-600" },
  { id: "footwear", label: "Footwear", icon: Footprints, color: "from-emerald-500 to-teal-500" },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", logo: nikeLogo },
  { id: "adidas", label: "Adidas", logo: adidasLogo },
  { id: "puma", label: "Puma", logo: pumaLogo },
  { id: "levi", label: "Levi's", logo: levisLogo },
  { id: "zara", label: "Zara", logo: zaraLogo },
  { id: "h&m", label: "H&M", logo: hmLogo },
];

const staticBanners = [
  { image: bannerOne, title: "New Arrivals", subtitle: "Discover the latest trends in fashion" },
  { image: bannerTwo, title: "Summer Sale", subtitle: "Up to 50% off on selected items" },
  { image: bannerThree, title: "Premium Brands", subtitle: "Shop Nike, Adidas, Puma & more" },
];

const bannerTexts = [
  { headline: "New Arrivals", sub: "Discover the latest trends in fashion" },
  { headline: "Summer Sale", sub: "Up to 50% off on selected items" },
  { headline: "Premium Brands", sub: "Shop Nike, Adidas, Puma & more" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function ShopHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { recommendations, isLoading: recsLoading } = useSelector((state) => state.recommendations);
  const { featureList } = useSelector((state) => state.shopFeatures);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use dynamic banners if available, otherwise fall back to static assets
  const banners =
    featureList && featureList.length > 0
      ? featureList.map((f) => ({
          image: f.image,
          title: f.title || "Welcome",
          subtitle: f.subtitle || "",
        }))
      : staticBanners;

  function handleNavigateToListingPage(item, section) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  }

  function handleAddtoCart(productId) {
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchToCart(user?.id));
        toast({ title: "Product added to cart 🛒" });
      }
    });
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductsDetails(productId));
  }

  // Auto-advance banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    dispatch(fetchShopFeatures());
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) dispatch(fetchRecommendations({ userId: user.id, limit: 8 }));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[560px] overflow-hidden">
        {/* Slides */}
        {banners.map((banner, index) => (
          <AnimatePresence key={index}>
            {index === currentSlide && (
              <motion.img
                key={index}
                src={banner.image}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        ))}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 max-w-2xl"
            >
              {banners[currentSlide]?.subtitle && (
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/30">
                  <TrendingUp className="w-4 h-4" />
                  {banners[currentSlide].subtitle}
                </span>
              )}
              <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight">
                {banners[currentSlide]?.title}
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={() => navigate("/shop/listing")}
                    className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 rounded-full shadow-xl"
                  >
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/shop/search")}
                    className="border-white text-white hover:bg-white/20 font-semibold px-8 rounded-full backdrop-blur-sm"
                  >
                    <Search className="mr-2 w-4 h-4" /> Search
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        {banners.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentSlide((p) => (p - 1 + banners.length) % banners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-12 h-12 backdrop-blur-sm"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentSlide((p) => (p + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-12 h-12 backdrop-blur-sm"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </Button>
          </>
        )}
      </section>

      {/* ── Shop by Category ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">Shop By Category</h2>
            <p className="text-gray-500 mt-2">Browse our curated collections</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {categoriesWithIcon.map((cat) => (
              <motion.div key={cat.id} variants={itemVariants}>
                <Card
                  onClick={() => handleNavigateToListingPage(cat, "category")}
                  className="cursor-pointer overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-br ${cat.color} p-8 flex flex-col items-center gap-3 group-hover:opacity-90 transition-opacity`}>
                      <motion.div whileHover={{ rotate: 8, scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                        <cat.icon className="w-10 h-10 text-white drop-shadow" />
                      </motion.div>
                      <span className="text-white font-bold text-sm">{cat.label}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Shop by Brand ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">Shop By Brand</h2>
            <p className="text-gray-500 mt-2">Your favourite labels, all in one place</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {brandsWithIcon.map((brand) => (
              <motion.div key={brand.id} variants={itemVariants}>
                <Card
                  onClick={() => handleNavigateToListingPage(brand, "brand")}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                    <motion.img
                      src={brand.logo}
                      alt={brand.label}
                      className="w-14 h-14 object-contain"
                      whileHover={{ scale: 1.12 }}
                      transition={{ duration: 0.25 }}
                    />
                    <span className="font-semibold text-sm text-gray-700 group-hover:text-green-700 transition-colors">
                      {brand.label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Hand-picked items just for you</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/shop/listing")}
              className="rounded-full border-green-600 text-green-700 hover:bg-green-50 hidden sm:flex gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {productList?.length > 0
              ? productList.slice(0, 8).map((product) => (
                  <motion.div key={product._id} variants={itemVariants}>
                    <ShoppingProductTile
                      handleAddtoCart={handleAddtoCart}
                      handleGetProductDetails={handleGetProductDetails}
                      product={product}
                    />
                  </motion.div>
                ))
              : null}
          </motion.div>
        </div>
      </section>

      {/* ── Recommendations ── */}
      <RecommendationSection
        title="You Might Also Like"
        products={recommendations}
        isLoading={recsLoading}
      />

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
