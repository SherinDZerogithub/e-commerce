import { AlignJustify, LogOut } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logOutUser } from "@/store/auth-slice";

export default function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();


  function handleLogOut() {
    dispatch(logOutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f2a28] to-[#1e293b] border-b border-slate-800 shadow-sm">
      {/* Toggle Menu Button - Visible on small screens only */}
      <Button
        onClick={() => setOpen(true)} 
        variant="ghost"
        size="icon"
        className="text-white lg:hidden sm:block hover:bg-white/10"
      >
        <AlignJustify size={22} />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Logout Button - Right Aligned */}
      <div className="flex flex-1 justify-end">
        <Button
          variant="success"
          onClick={handleLogOut}
          className="inline-flex gap-2 items-center bg-[#334155] text-white hover:bg-[#475569] border border-slate-700 rounded-md px-4 py-2 text-sm font-medium shadow transition-all"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </header>
  );
}
