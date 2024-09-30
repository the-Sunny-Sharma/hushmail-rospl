import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Menu, X, Home, LayoutDashboard, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 240 : 64 }}
      className="fixed inset-y-0 left-0 z-50 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isSidebarOpen && <h2 className="text-xl font-semibold">HushMail</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      <nav className="p-2">
        <ul className="space-y-2">
          <li>
            <Link
              href="/h/home"
              className={`flex items-center p-2 rounded-md ${
                pathname === "/h/home" ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/h/dashboard"
              className={`flex items-center p-2 rounded-md ${
                pathname === "/h/dashboard"
                  ? "bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Dashboard</span>}
            </Link>
          </li>
          {/* <li>
            <Link
              href="/h/settings"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <Settings className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>
          </li> */}
        </ul>
      </nav>
    </motion.aside>
  );
}
