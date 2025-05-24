import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[700px] rounded-lg">

      
      {/* Header */}
      <div className="bg-gray-50 px-6 py-1 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
        <p className="text-sm text-gray-500 mt-1">Order #{orderDetails?._id}</p>
      </div>

      <div className="p-1 space-y-1">
        {/* Order Info */}
        <div className="bg-gray-50 rounded-lg px-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Order Summary
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm font-medium text-gray-500">Order Date</div>
            <div className="text-sm font-medium">
              {orderDetails?.orderDate.split("T")[0]}
            </div>

            <div className="text-sm font-medium text-gray-500">Status</div>
            <div>
           <Badge
  className={`w-fit text-white px-3 rounded-md ${
    orderDetails?.orderStatus === "confirmed"
      ? "bg-green-600"
      : orderDetails?.orderStatus === "inProcess"
      ? "bg-yellow-500"
      : orderDetails?.orderStatus === "inShipping"
      ? "bg-blue-500"
      : orderDetails?.orderStatus === "rejected"
      ? "bg-red-500"
      : orderDetails?.orderStatus === "pending"
      ? "bg-gray-500"
      : orderDetails?.orderStatus === "delivered"
      ? "bg-green-400"
      : "bg-blue-600" // Default color for unknown status
  }`}
>
  {orderDetails?.orderStatus}
</Badge>

            </div>

            <div className="text-sm font-medium text-gray-500">
              Total Amount
            </div>
            <div className="text-sm font-semibold">
              ${orderDetails?.totalAmount}
            </div>
            <div className="text-sm font-medium text-gray-500">
              Payment Method paymentStatus
            </div>
            <div className="text-sm font-semibold">
              {orderDetails?.paymentMethod}
            </div>
              <div className="text-sm font-medium text-gray-500">
              Payment Status
            </div>
            <div className="text-sm font-semibold">
              {orderDetails?.paymentStatus}
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Order Items
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 px-3 py-1 border-b">
              <div className="col-span-8 font-medium text-sm text-gray-600">
                Item
              </div>
              <div className="col-span-2 font-medium text-sm text-gray-600 text-center">
                Qty
              </div>
              <div className="col-span-2 font-medium text-sm text-gray-600 text-right">
                Price
              </div>
            </div>
            <ul className="divide-y">
              {orderDetails?.cartItems?.map((item) => (
                <li
                  key={item._id}
                  className="grid grid-cols-12 px-3 py-1.5 hover:bg-gray-50"
                >
                  <div className="col-span-8 font-medium text-sm">
                    {item.title}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600 text-center">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-right">
                    ${item.price}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Shipping Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
            Shipping Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-x4 py-2 space-y-1">
            <div className="flex">
              <div className="w-24 text-sm font-medium text-gray-500">Name</div>
              <div className="text-sm">{user?.userName}</div>
            </div>
            <div className="flex">
              <div className="w-24 text-sm font-medium text-gray-500">
                Address
              </div>
              <div className="text-sm">
                {orderDetails?.addressInfo?.address}
              </div>
            </div>
            <div className="flex">
              <div className="w-24 text-sm font-medium text-gray-500">City</div>
              <div className="text-sm">
                {orderDetails?.addressInfo?.city},{" "}
                {orderDetails?.addressInfo?.pincode}
              </div>
            </div>
            <div className="flex">
              <div className="w-24 text-sm font-medium text-gray-500">
                Phone
              </div>
              <div className="text-sm">{orderDetails?.addressInfo?.phone}</div>
            </div>
            {orderDetails?.addressInfo?.note && (
              <div className="flex">
                <div className="w-24 text-sm font-medium text-gray-500">
                  Note
                </div>
                <div className="text-sm italic text-gray-600">
                  {orderDetails?.addressInfo?.note}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
export default ShoppingOrderDetailsView;
