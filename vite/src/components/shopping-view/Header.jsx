import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCheck2,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // fixed import path
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logOutUser } from "@/store/auth-slice";
import UsercartWrapper from "./CartWrapper";
import { useEffect, useState } from "react";
import { fetchToCart } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  //this will give us the path name
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path, {
          state: { timestamp: Date.now() }, // 👈 this will force location.state to change
        });
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  //display the cart models
  const [openCartSheet, setOpenCartSheet] = useState(false);

  function handleLogOut() {
    dispatch(logOutUser());
  }

  useEffect(() => {
    dispatch(fetchToCart(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          className="w-10 h-10 p-0 text-black border-white rounded-full shadow-md"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User Cart</span>
        </Button>

        <UsercartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName
                ?.split(" ")
                .map((word) => word[0]?.toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel> Wellcome {user?.userName} </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCheck2 className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button onClick={handleLogOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 shadow-sm bg-gradient-to-r from-[#184d1b] to-[#19d260]">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 text-white">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold text-base md:text-lg tracking-tight">
            E-Commerce
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-white"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Header Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs shadow-sm bg-gradient-to-b from-[#184d1b] to-[#19d260] text-white"
          >
            <div className="mt-6 space-y-6">
              {isAuthenticated && <HeaderRightContent />}
              <MenuItems />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Right-side content for authenticated users */}
        {isAuthenticated ? (
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        ) : null}
      </div>
    </header>
  );
}
