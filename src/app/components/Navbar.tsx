"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/app/firebase";

type NavbarProps = {
  onMenuClick: () => void;
};

const AUTH_NAV = [
  { label: "Home", path: "/Home" },
  { label: "About", path: "/About" },
  { label: "Contact", path: "/Contact" },
];

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* -------------------- AUTH LISTENER -------------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  /* -------------------- CLOSE ON OUTSIDE CLICK -------------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/LoginAndRegister");
  };

  return (
    <header className="w-full fixed z-50 shadow-2xl bg-black/50 border-b border-white/10 backdrop-blur-md">
      <div className="relative flex items-center h-14 px-4">

        {/* LOGO */}
        <img
          src="/PlanoraTextOnly.png"
          className="h-12 drop-shadow-[0_0_5px_#FFF,0_0_10px_#FFF]"
          alt="Planora Logo"
        />

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex w-full justify-end items-center me-10 gap-6">
          <ul className="flex text-sm gap-4">
            {user ? (
              AUTH_NAV.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <motion.li
                    key={item.path}
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Link
                      href={item.path}
                      className={`relative px-4 py-2 rounded-full transition
                        ${
                          isActive
                            ? "bg-white text-black font-semibold shadow"
                            : "text-white hover:text-gray-300"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })
            ) : (
              <motion.li whileHover={{ scale: 1.05 }}>
                <Link
                  href="/LoginAndRegister"
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-linear-to-r from-sky-400 to-blue-600 text-white font-semibold shadow"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              </motion.li>
            )}
          </ul>

          {/* USER DROPDOWN */}
          {user && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition"
              >
                <User className="text-white" />
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-48 rounded-2xl bg-white/90 backdrop-blur-lg shadow-xl overflow-hidden border border-gray-200"
                  >
                    <Link
                      href="/SeeProfile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-black text-sm hover:bg-gray-100 transition"
                    >
                      <User className="w-4 h-4 text-black" />
                      See Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE MENU */}
        <button
          onClick={onMenuClick}
          className="absolute right-4 lg:hidden p-2 border border-white/20 rounded-full hover:bg-white/10"
          aria-label="Open Menu"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
