import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAdminFeatures,
  addAdminFeature,
  editAdminFeature,
  deleteAdminFeature,
} from "@/store/admin/features-slice";
import ProductImage from "@/components/admin-view/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  ToggleLeft,
  ToggleRight,
  GripVertical,
  Layers,
} from "lucide-react";

const emptyForm = { title: "", subtitle: "", order: 0, isActive: true };

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function AdminFeatures() {
  const dispatch = useDispatch();
  const { featureList, isLoading } = useSelector((state) => state.adminFeatures);
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminFeatures());
  }, [dispatch]);

  function openAddSheet() {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setUploadedImageUrl("");
    setSheetOpen(true);
  }

  function openEditSheet(feature) {
    setEditingId(feature._id);
    setFormData({
      title: feature.title || "",
      subtitle: feature.subtitle || "",
      order: feature.order ?? 0,
      isActive: feature.isActive,
    });
    setImageFile(null);
    setUploadedImageUrl(feature.image);
    setSheetOpen(true);
  }

  function handleSheetClose(open) {
    if (!open) {
      setEditingId(null);
      setFormData(emptyForm);
      setImageFile(null);
      setUploadedImageUrl("");
    }
    setSheetOpen(open);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!uploadedImageUrl) {
      toast({ title: "Please upload a banner image first", variant: "destructive" });
      return;
    }

    const payload = { ...formData, image: uploadedImageUrl };

    if (editingId) {
      const result = await dispatch(editAdminFeature({ id: editingId, formData: payload }));
      if (result?.payload?.success) {
        toast({ title: "Banner updated successfully" });
        dispatch(fetchAdminFeatures());
        setSheetOpen(false);
      } else {
        toast({ title: "Failed to update banner", variant: "destructive" });
      }
    } else {
      const result = await dispatch(addAdminFeature(payload));
      if (result?.payload?.success) {
        toast({ title: "Banner added successfully" });
        dispatch(fetchAdminFeatures());
        setSheetOpen(false);
      } else {
        toast({ title: "Failed to add banner", variant: "destructive" });
      }
    }
  }

  async function handleToggleActive(feature) {
    const result = await dispatch(
      editAdminFeature({ id: feature._id, formData: { isActive: !feature.isActive } })
    );
    if (result?.payload?.success) {
      toast({ title: `Banner ${!feature.isActive ? "activated" : "deactivated"}` });
      dispatch(fetchAdminFeatures());
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await dispatch(deleteAdminFeature(deleteId));
    if (result?.payload?.success) {
      toast({ title: "Banner deleted", variant: "warning" });
      dispatch(fetchAdminFeatures());
    } else {
      toast({ title: "Failed to delete banner", variant: "destructive" });
    }
    setDeleteId(null);
  }

  const isFormValid = uploadedImageUrl && !imageLoading;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Homepage Banners</h1>
            <p className="text-sm text-gray-500">
              Manage the hero carousel shown on the shop homepage
            </p>
          </div>
        </div>
        <Button onClick={openAddSheet} className="gap-2 rounded-full shadow">
          <Plus className="w-4 h-4" />
          Add Banner
        </Button>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="flex gap-4 flex-wrap"
      >
        {[
          { label: "Total Banners", value: featureList.length },
          { label: "Active", value: featureList.filter((f) => f.isActive).length },
          { label: "Inactive", value: featureList.filter((f) => !f.isActive).length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border rounded-xl px-5 py-3 flex flex-col shadow-sm min-w-[120px]"
          >
            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            <span className="text-xs text-gray-500 mt-0.5">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Empty state ── */}
      {!isLoading && featureList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-4 text-gray-400"
        >
          <ImageIcon className="w-14 h-14 opacity-30" />
          <p className="text-lg font-semibold">No banners yet</p>
          <p className="text-sm">Add your first homepage banner to get started</p>
          <Button onClick={openAddSheet} variant="outline" className="mt-2 gap-2 rounded-full">
            <Plus className="w-4 h-4" /> Add Banner
          </Button>
        </motion.div>
      )}

      {/* ── Banner grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <AnimatePresence>
          {featureList.map((feature) => (
            <motion.div
              key={feature._id}
              variants={cardVariants}
              exit="exit"
              layout
              className="group relative bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Banner image */}
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title || "Banner"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                {/* Active badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      feature.isActive
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {feature.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Order badge */}
                <div className="absolute top-2 right-2">
                  <span className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <GripVertical className="w-3 h-3" />
                    Order {feature.order}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">
                  {feature.title || <span className="text-gray-400 italic">No title</span>}
                </h3>
                {feature.subtitle && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">{feature.subtitle}</p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 rounded-lg text-xs"
                    onClick={() => openEditSheet(feature)}
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 gap-1 rounded-lg text-xs"
                    onClick={() => handleToggleActive(feature)}
                  >
                    {feature.isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-green-500" /> Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-gray-400" /> Activate
                      </>
                    )}
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setDeleteId(feature._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Add / Edit Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={handleSheetClose}>
        <SheetContent side="right" className="overflow-auto w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Banner" : "Add New Banner"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the banner details below."
                : "Upload a banner image and add optional text."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Image upload */}
            <ProductImage
              imageFile={imageFile}
              setImageFile={setImageFile}
              setUploadedImageurl={setUploadedImageUrl}
              setImageLoadingSet={setImageLoading}
              imageLoadingSet={imageLoading}
              isEditModel={false}
            />

            {/* Preview */}
            <AnimatePresence>
              {uploadedImageUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl border"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="feat-title">Banner Title</Label>
              <Input
                id="feat-title"
                placeholder="e.g. New Arrivals"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <Label htmlFor="feat-subtitle">Subtitle</Label>
              <Input
                id="feat-subtitle"
                placeholder="e.g. Discover the latest trends"
                value={formData.subtitle}
                onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <Label htmlFor="feat-order">Display Order</Label>
              <Input
                id="feat-order"
                type="number"
                min={0}
                placeholder="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, order: Number(e.target.value) }))
                }
              />
              <p className="text-xs text-gray-400">Lower numbers appear first in the carousel</p>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="font-medium text-sm">Active</p>
                <p className="text-xs text-gray-500">Show this banner on the homepage</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
                className="focus:outline-none"
                aria-pressed={formData.isActive}
                aria-label="Toggle active"
              >
                {formData.isActive ? (
                  <ToggleRight className="w-8 h-8 text-green-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full rounded-full"
            >
              {editingId ? "Save Changes" : "Add Banner"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* ── Delete confirm dialog ── */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The banner will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
