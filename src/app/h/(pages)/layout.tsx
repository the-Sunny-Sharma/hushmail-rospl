"use client";

import Navbar from "@/components/client/Navbar";
import Sidebar from "@/components/client/Sidebar";
import { useAuth } from "@/context/AuthProviderClient";
import { useEffect, useState } from "react";

// Define CurrentUser type
interface CurrentUser {
  username: string;
  profilePicture: string;
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    username: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  });

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentUser({
        username: user.email,
        profilePicture: user.picture || currentUser.profilePicture,
      });
    }
  }, [user]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
      >
        <Navbar currentUser={currentUser} />

        {children}
      </div>
    </div>
  );
}
