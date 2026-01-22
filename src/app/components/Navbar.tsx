"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/app/firebase";

const AUTH_NAV = [
  { label: "Home", path: "/Home" },
  { label: "About", path: "/About" },
  { label: "Contact", path: "/Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* -------------------- AUTH LISTENER -------------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  /* -------------------- REDIRECT LOGGED-OUT USERS -------------------- */
  useEffect(() => {
    if (!user && pathname === "/Home") {
      router.replace("/LoginAndRegister");
    }
  }, [user, pathname, router]);

  /* -------------------- AUTO-CLOSE MOBILE MENU ON ROUTE CHANGE -------------------- */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* -------------------- CLOSE DROPDOWN ON OUTSIDE CLICK -------------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMobileOpen(false);
    router.replace("/LoginAndRegister");
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="relative flex items-center h-14 px-4">

        {/* LOGO */}
        <img
          src="/PlanoraTextOnly.png"
          alt="Planora Logo"
          className="h-10 drop-shadow-[0_0_7px_#FFF,0_0_10px_#FFF]"
        />

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex w-full justify-end items-center gap-6">
          {user ? (
            <>
              <ul className="flex gap-4">
                {AUTH_NAV.map((item) => {
                  const isActive = pathname.startsWith(item.path);

                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`px-4 py-2 rounded-full transition ${
                          isActive
                            ? "bg-white text-black font-semibold"
                            : "text-white hover:text-gray-300"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* USER DROPDOWN */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 text-white"
                >
                  <User />
                  <ChevronDown
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <Link
                        href="/SeeProfile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100"
                      >
                        See Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              href="/LoginAndRegister"
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* BURGER BUTTON */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="absolute right-4 lg:hidden text-white"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-black/90 backdrop-blur-md"
          >
            <ul className="flex flex-col p-4 gap-3">
              {user ? (
                <>
                  {AUTH_NAV.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="text-white py-2 border-b border-white/10"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="text-left text-red-400 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/LoginAndRegister"
                  className="text-white py-2"
                >
                  Sign In
                </Link>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
