import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCheck2,
  ShoppingBag,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
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
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logOutUser } from "@/store/auth-slice";
import UsercartWrapper from "./CartWrapper";
import { useEffect, useState } from "react";
import { fetchToCart } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { motion, AnimatePresence } from "framer-motion";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path, {
          state: { timestamp: Date.now() },
        });
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-1 lg:gap-1 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem, index) => (
        <motion.div
          key={menuItem.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <button
            onClick={() => handleNavigate(menuItem)}
            className="relative px-4 py-2 text-sm font-medium text-white/90 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/15 group"
          >
            {menuItem.label}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-white rounded-full group-hover:w-3/4 transition-all duration-300" />
          </button>
        </motion.div>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const cartCount = cartItems?.items?.length ?? 0;

  function handleLogOut() {
    dispatch(logOutUser());
  }

  useEffect(() => {
    dispatch(fetchToCart(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-3">
      {/* Cart button with badge */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <motion.div whileTap={{ scale: 0.92 }}>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="ghost"
            className="relative w-10 h-10 p-0 text-white hover:bg-white/20 rounded-full"
          >
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="sr-only">User Cart</span>
          </Button>
        </motion.div>
        <UsercartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartCount > 0 ? cartItems.items : []}
        />
      </Sheet>

      {/* Avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileTap={{ scale: 0.92 }} className="cursor-pointer">
            <Avatar className="h-9 w-9 ring-2 ring-white/40 hover:ring-white/80 transition-all duration-200">
              <AvatarFallback className="bg-white/20 text-white font-bold text-sm backdrop-blur-sm">
                {user?.userName
                  ?.split(" ")
                  .map((w) => w[0]?.toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56 rounded-xl shadow-xl border-0 bg-white/95 backdrop-blur-md mt-2">
          <DropdownMenuLabel className="font-semibold text-gray-700">
            👋 Welcome, {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer rounded-lg gap-2 hover:bg-gray-50"
          >
            <UserCheck2 className="h-4 w-4 text-green-600" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogOut}
            className="cursor-pointer rounded-lg gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "shadow-lg bg-gradient-to-r from-[#0f3d13] to-[#16a349] backdrop-blur-md"
          : "bg-gradient-to-r from-[#184d1b] to-[#19d260]"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 text-white group">
          <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
            <ShoppingBag className="h-6 w-6" />
          </motion.div>
          <span className="font-extrabold text-base md:text-lg tracking-tight group-hover:text-green-100 transition-colors">
            E-Commerce
          </span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/20 rounded-full"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs bg-gradient-to-b from-[#0f3d13] to-[#19d260] text-white border-0"
          >
            <div className="mt-8 space-y-6">
              {isAuthenticated && <HeaderRightContent />}
              <MenuItems />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Right content */}
        {isAuthenticated && (
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        )}
      </div>
    </motion.header>
  );
}
