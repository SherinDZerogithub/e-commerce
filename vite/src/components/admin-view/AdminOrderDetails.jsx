import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  getAllOrdersForAdmin,
  getOrdersDetailsForAdmin,
  updateOrderStatsSlice,
} from "@/store/admin/order-slice";
import { useToast } from "@/hooks/use-toast";
import { getAllUsersAuth } from "@/store/auth-slice";

const initialFormData = {
  status: "",
};

function AdminOrderDetails({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [orderedUser, setOrderedUser] = useState(null);
  const { userDetails } = useSelector((state) => state.auth);

  const { toast } = useToast();
  const dispatch = useDispatch();
  function handleUpdateStatus(event) {
    event.preventDefault();
    console.log("formData", formData);
    const { status } = formData;
    dispatch(
      updateOrderStatsSlice({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      console.log(data, "Seri");
      if (data?.payload?.success) {
        dispatch(getOrdersDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: "Success",
          description: "Order Status Updated Successfully",
          variant: "success",
        });
      }
    });
  }
  useEffect(() => {
    if (userDetails && orderDetails?.userId) {
      const user = userDetails.find((user) => user._id === orderDetails.userId);
      setOrderedUser(user);
    }
  }, [userDetails, orderDetails]);

  // Fetch all users if not already loaded
  useEffect(() => {
    if (!userDetails || userDetails.length === 0) {
      dispatch(getAllUsersAuth());
    }
  }, [dispatch]);
  return (
    <DialogContent className="sm:max-w-[700px] rounded-lg">
      {/* Header */}
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>
          Viewing details for order #{orderDetails?._id}
        </DialogDescription>
      </DialogHeader>

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
                    : "bg-blue-600" // Default color if none of the statuses match
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
              <div className="flex">
                <div className="text-sm">
                  {orderedUser?.userName || "Loading..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "rejected", label: "Rejected" },
                { id: "pending", label: "Pending" },
                { id: "delivered", label: "Delivered" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={"Update Order Status"}
          onSubmit={handleUpdateStatus}
        />
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetails;
