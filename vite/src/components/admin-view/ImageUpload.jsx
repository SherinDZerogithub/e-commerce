import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImage({
  imageFile,
  setImageFile,
  isEditModel,
  setUploadedImageurl,
  setImageLoadingSet,
  imageLoadingSet,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  console.log(imageFile);

  async function uploadedImageToCloudinary() {
    try {
      setImageLoadingSet(true);
      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data,
        { timeout: 15000 } // 15 seconds timeout
      );

      console.log(response, "response");
      if (response?.data?.success) {
        setUploadedImageurl(response.data.result.url);
      } else {
        console.error("Upload failed:", response.data);
        setUploadedImageurl(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadedImageurl(null);
    } finally {
      setImageLoadingSet(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadedImageToCloudinary();
  }, [imageFile]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Label className="text-lg font-semibold mb-2 block">Image Upload</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={` ${
          isEditModel ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditModel}
        />
        {!imageFile ? (
          <div
            className={` ${
              isEditModel ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag and Drop or Click to Upload Image</span>
          </div>
        ) : imageLoadingSet ? (
          <Skeleton className="h-10 bg-gray-700" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImage;
