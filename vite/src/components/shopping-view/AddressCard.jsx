import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  
}) {

  const{ toast} = useToast();
  const handleSelect = () => {
    setCurrentSelectedAddress(addressInfo);
    toast({
      title: "Address Selected",
      description: "This address has been selected for delivery.",
      variant: "default",
    });
  };
  return (
    // only when the card is clicked we can go to checkout
    <Card
      onClick={setCurrentSelectedAddress ? handleSelect : null}
      className="shadow-md border cursor-pointer border-gray-200 rounded-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-slate-200 "
    >
      <CardHeader className="px-4 pt-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Shipping Address
        </h3>
      </CardHeader>
      <CardContent className="grid gap-2 px-4 pb-2 text-gray-700">
        <div>
          <span className="font-medium">Address:</span> {addressInfo?.address}
        </div>
        <div>
          <span className="font-medium">City:</span> {addressInfo?.city}
        </div>
        <div>
          <span className="font-medium">Pincode:</span> {addressInfo?.pincode}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {addressInfo?.phone}
        </div>
        {addressInfo?.notes && (
          <div>
            <span className="font-medium">Notes:</span> {addressInfo?.notes}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 px-4 pb-4">
        <Button
          variant="edit"
          size="sm"
          onClick={() => handleEditAddress(addressInfo)}
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteAddress(addressInfo)}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
