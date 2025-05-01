import {
  LayoutDashboard,
  ShoppingBasket,
  BadgeCheck,
  ChartNoAxesCombined,
} from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useDispatch } from "react-redux";
import { fetchProduct } from "@/store/admin/Products-slice";

// Menu items
const adminSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
];

// Menu rendering component
function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    navigate(path);
    if (path === "/admin/products") {
      dispatch(fetchProduct()); // Fetch products when clicking the products link
    }
    if (setOpen) setOpen(false);
  };
  return (
    <nav className="mt-8 flex flex-col gap-1">
      {adminSideBarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => handleNavigation(menuItem.path)}
          className="flex items-center gap-3 rounded-md px-4 py-3 cursor-pointer text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200"
        >
          {menuItem.icon}
          <span className="text-base font-medium">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

// Sidebar layout
export default function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-slate-700 px-6 py-4">
              <SheetTitle className="flex items-center gap-2">
                <ChartNoAxesCombined size={28} />
                <h1 className="text-xl font-extrabold tracking-wide">
                  Admin Panel
                </h1>
              </SheetTitle>
            </SheetHeader>
            <div className="px-2">
              <MenuItems setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen flex-col border-r border-slate-800 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6 shadow-md">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 mb-6"
        >
          <ChartNoAxesCombined size={28} />
          <h1 className="text-xl font-extrabold tracking-wide">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}
