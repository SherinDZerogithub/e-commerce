import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OShop from "../../assets/OnlineShopping.jpg";

import Address from "@/components/shopping-view/Address";

import ShoppingOrders from "@/components/shopping-view/Orders";

export default function ShopAccount() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img
          src={OShop}
          alt="Account Image"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
            
          🛍️ Your Account
          </h1>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-10 px-4 md:px-0">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg border border-gray-200 dark:border-zinc-700">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="flex space-x-4 bg-gray-100 dark:bg-zinc-800 p-2 rounded-xl mb-6">
              <TabsTrigger
                value="orders"
                className="flex-1 text-lg font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-md rounded-xl transition"
              >
                🛒 Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="flex-1 text-lg font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-md rounded-xl transition"
              >
                🏠 Address
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders/>
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
