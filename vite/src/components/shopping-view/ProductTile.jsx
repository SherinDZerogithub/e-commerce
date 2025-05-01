import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import React from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const isOnSale = product?.salePrice > 0;

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg bg-white">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[400px] object-cover"
          />
          {isOnSale && (
            <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded-md shadow">
              Sale
            </Badge>
          )}
        </div>

        <CardContent className="p-5">
          <h2 className="text-xl font-extrabold text-gray-800 mb-2 truncate">
            {product?.title}
          </h2>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className=" font-bold">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className=" font-bold">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-center items-center gap-2 mb-2">
            <span
              className={`${
                isOnSale ? "line-through text-gray-400" : "text-primary"
              } text-lg font-semibold`}
            >
              ${product?.price}
            </span>
            {isOnSale && (
              <span className="text-lg font-bold text-green-600">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleAddtoCart(product._id)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition"
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
