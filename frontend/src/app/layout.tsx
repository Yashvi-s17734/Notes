"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbarRoutes = ["/login", "/signup"];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);
  return (
    <html lang="en">
      <body className="bg-white">
        {!shouldHideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
