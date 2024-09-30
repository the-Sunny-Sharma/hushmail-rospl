import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

interface CurrentUser {
  username: string;
  profilePicture: string;
}

interface NavbarProps {
  currentUser: CurrentUser;
}

export default function Navbar({ currentUser }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const titles: { [key: string]: string } = {
    "/h/home": "Home",
    "/h/dashboard": "Dashboard",
    "/h/create-feed": "Create Feed",
  };

  const title =
    titles[pathname] ||
    (pathname.startsWith("/h/publicPost") && "Post Details");

  return (
    <header className="sticky top-0 bg-white shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-md hover:bg-gray-200"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{currentUser.username}</span>
            <Image
              src={currentUser.profilePicture}
              alt="User profile"
              width={32}
              height={32}
              className="rounded-full border-2 border-gray-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
