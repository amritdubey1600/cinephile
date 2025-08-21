'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

// Regex patterns to match dynamic routes
const HIDE_NAVBAR_PATTERNS = [
  /^\/movies\/[^/]+\/select-cinema$/,              // Matches /movies/:id/select-cinema
  /^\/book-tickets$/,                              // Matches /book-tickets
  /^\/movies\/[^/]+\/book-tickets(\/.*)?$/,         // Matches /movies/:id/book-tickets and any subpaths
  /^\/login$/,                                     // Hides on /login
  /^\/signup$/,                                    // Hides on /signup
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHideNavbar = HIDE_NAVBAR_PATTERNS.some((pattern) => pattern.test(pathname));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}
