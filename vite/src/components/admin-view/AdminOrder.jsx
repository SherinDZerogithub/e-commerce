import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrderDetails from "./AdminOrderDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrdersDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";

function AdminOrderView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const [sortOrder, setSortOrder] = useState("desc"); // or "asc" by default
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrdersDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);
  const sortedOrderList = [...(orderList || [])].sort((a, b) => {
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  console.log("orderList", orderList);
  console.log("orderDetails", orderDetails);
  return (
    <Card>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Filter By Date</h2>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">By date</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ArrowUpDownIcon className="w-4 h-4" />
                {sortOrder === "asc" ? "Oldest" : "Newest"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                Newest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black border-2 border-black ">
                {" "}
                Order ID
              </TableHead>
              <TableHead className="text-black border-2 border-black ">
                {" "}
                Order Date
              </TableHead>
              <TableHead className="text-black border-2 border-black ">
                {" "}
                Order Status
              </TableHead>
              <TableHead className="text-black border-2 border-black ">
                {" "}
                Order Price
              </TableHead>
              <TableHead className="text-black border-2 border-black ">
                {" "}
                <span className="sr-only">Details </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrderList && sortedOrderList.length > 0
              ? sortedOrderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      {" "}
                      <Badge
                        className={`py-1.5 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-600"
                            : orderItem?.orderStatus === "inProcess"
                            ? "bg-yellow-500"
                            : orderItem?.orderStatus === "inShipping"
                            ? "bg-blue-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-500"
                            : orderItem?.orderStatus === "pending"
                            ? "bg-gray-500"
                            : orderItem?.orderStatus === "delivered"
                            ? "bg-green-400"
                            : "bg-blue-600" 
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <AdminOrderDetails orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrderView;
