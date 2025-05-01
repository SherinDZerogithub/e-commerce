import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import AdminHeader from "./Header";

export default function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false); // Fixed typo in variable name

  return (
    <div className="flex min-h-screen w-full">
      {/* Admin sidebar */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex flex-1 flex-col">
        {/* Admin header - properly passing setOpen function */}
        <AdminHeader setOpen={setOpenSidebar} />

        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div> 
    </div>
  );
}
