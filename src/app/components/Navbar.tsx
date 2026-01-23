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

const PUBLIC_ROUTES = ["/", "/LoginAndRegister"];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* AUTH LISTENER */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  /* REDIRECT UNAUTHENTICATED USERS */
  useEffect(() => {
    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/LoginAndRegister");
    }
  }, [user, pathname, router]);

  /* CLOSE MOBILE MENU ON ROUTE CHANGE */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */
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
      <div className="relative flex items-center h-14 px-4 gap-2">

        {/* LOGO */}
        <img
          src="/PlanoraTextOnly.png"
          alt="Planora Logo"
          className="h-10 drop-shadow-[0_0_7px_#FFF,0_0_10px_#FFF]"
        />

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
          {user ? (
            <>
              <ul className="flex gap-2">
                {AUTH_NAV.map((item) => {
                  const isActive = pathname.startsWith(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`relative px-4 py-2 transition ${
                          isActive
                            ? "bg-white text-black rounded-full font-semibold"
                            : "text-white"
                        } after:absolute after:left-1/2 after:-bottom-1
                          after:h-0.5 after:w-1/2 after:bg-white
                          after:-translate-x-1/2
                          after:scale-x-0 after:transition-transform after:duration-300
                          hover:after:scale-x-100
                          ${isActive ? "after:hidden" : ""}`}
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
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-white transition hover:bg-white hover:text-black"
                >
                  <User />
                  <ChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <Dropdown
                  open={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  onLogout={handleLogout}
                />
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

        {/* MOBILE CONTROLS */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          {user && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-white transition hover:bg-white hover:text-black"
              >
                <User />
                <ChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <Dropdown
                open={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
                onLogout={handleLogout}
              />
            </div>
          )}

          {/* BURGER */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-white"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
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
                AUTH_NAV.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="text-white py-2 border-b border-white/10"
                  >
                    {item.label}
                  </Link>
                ))
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

/* DROPDOWN */
function Dropdown({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50"
        >
          <Link
            href="/SeeProfile"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-100 transition"
          >
            <User size={18} />
            <span>See Profile</span>
          </Link>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
