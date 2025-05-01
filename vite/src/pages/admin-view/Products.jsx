import ProductImage from "@/components/admin-view/ImageUpload";
import AdminProducTiles from "@/components/admin-view/ProductTile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchProduct,
} from "@/store/admin/Products-slice";
import { ArrowDown, ArrowUp, ChartColumnBigIcon, Plus } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

export default function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageurl, setUploadedImageurl] = useState(null);
  const [imageLoadingSet, setImageLoadingSet] = useState(false);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  //for edit
  const [currentEditedId, setCurrentEditedId] = useState(null);

  function scrollBackToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function onSubmit(event) {
    event.preventDefault();
    console.log("Form Data =>", formData);
    console.log("Selected Image File =>", imageFile);
    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: {
              ...formData,
              image: uploadedImageurl, // <- Add this!
            },
          })
        ).then((data) => {
          console.log(data);
          if (data?.payload?.success) {
            dispatch(fetchProduct());
            setFormData(initialFormData); // ✅ Fixed: was using = instead of function call
            setOpenCreateProductDialog(false); // ✅ You probably meant to close the dialog'
            setCurrentEditedId(null);
          }
          toast({
            title: "Product Edited Successfully",
            variant: "info",
          });
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageurl,
          })
        ).then((data) => {
          console.log(data);
          if (data?.payload?.success) {
            dispatch(fetchProduct());
            setOpenCreateProductDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product Added Successfully",
            });
          }
        });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function handleDelete(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchProduct());
      }
    });
    toast({
      title: "Product Deleted Successfully",
      variant: "warning",
    });
  }

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  console.log(formData, "formData");

  console.log(productList, "productList");
  return (
    <Fragment>
      <div className="mt-5 flex pb-10">
        <Button onClick={() => setOpenCreateProductDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProducTiles
                setCurrentEditedId={setCurrentEditedId}
                setOpenCreateProductDialog={setOpenCreateProductDialog}
                setFormData={setFormData}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      {/* Product grid would go here */}

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={(open) => {
          setOpenCreateProductDialog(open);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {" "}
              {currentEditedId !== null
                ? "Edit Product"
                : "Add New Product"}{" "}
            </SheetTitle>
            <SheetDescription>
              Fill in the product details below
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            <ProductImage
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageurl={uploadedImageurl}
              setUploadedImageurl={setUploadedImageurl}
              setImageLoadingSet={setImageLoadingSet}
              imageLoadingSet={imageLoadingSet}
              isEditModel={currentEditedId !== null}
            />
          </div>

          <div className="py-6">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                currentEditedId !== null ? "Edit Product" : "Add New Product"
              }
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    
      <Button
        onClick={scrollBackToTop}
        className=" bottom-5 left-5 px-6 py-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all"
      >
        Back to Top
      </Button>
    </Fragment>
  );
}
