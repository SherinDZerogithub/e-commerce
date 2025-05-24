import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fethAllAddress,
} from "@/store/shop/address-slice";
import AddressCard from "./AddressCard";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};
export default function Address( { setCurrentSelectedAddress}) {
  const [formData, setFormData] = useState(initialAddressFormData);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const { toast } = useToast();
  const [currentEditedId, setCurrentEditedId] = useState(null);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add maximam 3 addresses",
        variant: "warning",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fethAllAddress(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
              variant: "success",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fethAllAddress(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
              variant: "success",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    console.log("Attempting to delete address:", getCurrentAddress);

    dispatch(
      deleteAddress({
        userId: user?.id,
        addressId: getCurrentAddress._id,
      })
    ).then((data) => {
      console.log("Delete response:", data);

      if (data?.payload?.success) {
        dispatch(fethAllAddress(user?.id));
        toast({
          title: "Address Deleted successfully",
          variant: "success",
        });
      } else {
        console.error("Delete failed:", data?.error);
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    //when we click the edit button we need to set those form data into the form
    // to that we do it like this: ..formData
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  }
  useEffect(() => {
    if (user?.id) {
      dispatch(fethAllAddress(user.id));
    }
  }, [dispatch, user?.id]);
  useEffect(() => {
    console.log("Updated address list:", addressList);
  }, [addressList]);

  function isFormValid() {
    return Object.keys(formData)

      .map((key) => formData[key].trim() !== "")

      .every((item) => item);
  }
  return (
    <Card>
      <h2 className="text-2xl font-bold">Choose Your Shipping Address...</h2>
      <div className="mb-5 p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddress) => (
              <AddressCard
                key={singleAddress._id}
                addressInfo={singleAddress}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentEditedId={setCurrentEditedId}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              
              />
            ))
          : null}
      </div>
      <CardHeader>
        {" "}
        {currentEditedId !== null ? "Edit Address" : "Add New Address"}{" "}
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={
            currentEditedId !== null ? "Edit Address" : "Add New Address"
          }
          isBtnDisabled={!isFormValid()}
          onSubmit={handleManageAddress}
        />
      </CardContent>
    </Card>
  );
}
