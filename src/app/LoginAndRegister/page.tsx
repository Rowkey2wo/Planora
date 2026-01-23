"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { Compass, Sparkles, MapPin, Plane } from "lucide-react";

export default function LoginAndRegister() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  /* Reset form on mode change */
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
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            x: [0, -150, 0],
            y: [0, 150, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"
        />

        {/* Floating Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute text-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {i % 4 === 0 && <Compass className="w-12 h-12" />}
            {i % 4 === 1 && <MapPin className="w-10 h-10" />}
            {i % 4 === 2 && <Plane className="w-14 h-14" />}
            {i % 4 === 3 && <Sparkles className="w-8 h-8" />}
          </motion.div>
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header Section */}
          <div className="relative bg-linear-to-br from-sky-500 to-blue-600 p-8 text-white overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"
            />

            <div className="relative z-10">
              <motion.div
                key={mode}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4"
              >
                {mode === "login" ? (
                  <Compass className="w-8 h-8" />
                ) : (
                  <Sparkles className="w-8 h-8" />
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={mode + "-title"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold mb-2"
                >
                  {mode === "login" ? "Welcome to Planora!" : "Join the Adventure"}
                </motion.h2>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={mode + "-subtitle"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-white/90"
                >
                  {mode === "login"
                    ? "Continue your journey through Davao"
                    : "Start exploring the beauty of Davao Region"}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "login" ? 50 : -50 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-slate-700 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-slate-700 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-slate-700 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </motion.div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {mode === "login" ? (
                        <>
                          <Compass className="w-5 h-5" />
                          Login
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Create Account
                        </>
                      )}
                    </>
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Toggle Mode */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Register Now
                    </motion.button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Login Here
                    </motion.button>
                  </>
                )}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-400/30 rounded-full blur-xl"
        />
      </motion.div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-800 mb-3"
              >
                Welcome Aboard! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                Your account has been created successfully. Get ready to explore
                the amazing destinations in Davao Region!
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSuccess(false);
                  setMode("login");
                }}
                className="w-full bg-linear-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Go to Login
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}