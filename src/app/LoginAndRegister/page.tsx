"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";

export default function LoginAndRegister() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Clear fields & errors when switching mode
  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/Home");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message.replace("Firebase:", "").trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-sky-300 flex items-center justify-center px-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative grid grid-cols-2 min-h-130 text-black">

          {/* IMAGE PANEL */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-image"}
              initial={{ x: mode === "login" ? -200 : 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: mode === "login" ? 200 : -200, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute top-0 h-full w-1/2 ${
                mode === "login" ? "left-0" : "right-0"
              }`}
            >
              <img
                src={
                  mode === "login"
                    ? "/auth/login-davao.jpg"
                    : "/auth/register-davao.jpg"
                }
                alt="Auth Visual"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <h2 className="text-white text-3xl font-bold text-center px-10">
                  {mode === "login"
                    ? ""
                    : ""}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* FORM PANEL */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-form"}
              initial={{ x: mode === "login" ? 200 : -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: mode === "login" ? -200 : 200, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute top-0 h-full w-1/2 bg-white flex items-center justify-center px-12 ${
                mode === "login" ? "right-0" : "left-0"
              }`}
            >
              <div className="w-full max-w-sm">
                <h3 className="text-3xl font-bold mb-6">
                  {mode === "login" ? "Login" : "Register"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3"
                    required
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3"
                    required
                  />

                  {mode === "register" && (
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border rounded-lg px-4 py-3"
                      required
                    />
                  )}

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {loading
                      ? "Please wait..."
                      : mode === "login"
                      ? "Login"
                      : "Create Account"}
                  </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                  {mode === "login" ? (
                    <>
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Register
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Login
                      </button>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
            >
              <h2 className="text-2xl font-bold text-green-600 mb-3">
                Registration Successful 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully.  
                You can now log in and start planning your Davao trip.
              </p>

              <button
                onClick={() => {
                  setSuccess(false);
                  setMode("login");
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
