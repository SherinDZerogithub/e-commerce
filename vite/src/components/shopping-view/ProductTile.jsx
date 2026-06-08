import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const isOnSale = product?.salePrice > 0;
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercent =
    isOnSale
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl transition-shadow duration-300 bg-white group">
        {/* Image Section */}
        <div
          className="relative cursor-pointer overflow-hidden bg-gray-50"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          <motion.img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[280px] object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Eye className="w-5 h-5 text-gray-700" />
              </div>
            </motion.div>
          </div>

          {/* Wishlist button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted((prev) => !prev);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </motion.button>

          {/* Stock / Sale badge */}
          {isOutOfStock ? (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs rounded-lg shadow">
              Out Of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 text-xs rounded-lg shadow animate-pulse">
              Only {product?.totalStock} left
            </Badge>
          ) : isOnSale ? (
            <Badge className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 text-xs rounded-lg shadow">
              -{discountPercent}% OFF
            </Badge>
          ) : null}
        </div>

        {/* Card Content */}
        <CardContent
          className="p-4 cursor-pointer"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          <h2 className="text-base font-bold text-gray-900 mb-1 truncate leading-snug">
            {product?.title}
          </h2>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            {isOnSale ? (
              <>
                <span className="text-xl font-extrabold text-emerald-600">
                  ${product?.salePrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product?.price}
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-gray-900">
                ${product?.price}
              </span>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          {isOutOfStock ? (
            <Button
              disabled
              className="w-full rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed font-semibold"
            >
              Out Of Stock
            </Button>
          ) : (
            <motion.div className="w-full" whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() =>
                  handleAddtoCart(product._id, product?.totalStock)
                }
                className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold shadow-md hover:shadow-green-200 transition-all duration-200 gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default ShoppingProductTile;
