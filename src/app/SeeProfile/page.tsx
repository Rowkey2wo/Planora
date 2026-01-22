"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Users,
  Trash2,
  Eye,
  LogOut,
  Loader2,
  Sparkles,
  Mountain,
  Hotel,
  Car,
  Clock,
} from "lucide-react";

type SavedItinerary = {
  id: string;
  province: string;
  provinceId: string;
  preferences: string[];
  days: number;
  pax: number;
  accommodation: string;
  transport: string;
  createdAt: any;
  itinerary: any[];
};

export default function SeeProfile() {
  const [user, setUser] = useState<any>(null);
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    itineraryId: string | null;
  }>({ open: false, itineraryId: null });
  const [deleting, setDeleting] = useState(false);

  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      fetchItineraries(currentUser.uid);
    });

    return () => unsubscribe();
  }, []);

  const fetchItineraries = async (userId: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "itineraries"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedItineraries: SavedItinerary[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedItineraries.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as SavedItinerary);
      });
      
      // Sort by createdAt in descending order (newest first)
      fetchedItineraries.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setItineraries(fetchedItineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      alert("Failed to load itineraries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const openDeleteModal = (itineraryId: string) => {
    setDeleteModal({ open: true, itineraryId });
  };

  const confirmDelete = async () => {
    if (!deleteModal.itineraryId) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "itineraries", deleteModal.itineraryId));
      setItineraries((prev) => prev.filter((it) => it.id !== deleteModal.itineraryId));
      setDeleteModal({ open: false, itineraryId: null });
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      alert("Failed to delete itinerary");
    } finally {
      setDeleting(false);
    }
  };

  const viewItinerary = (itineraryId: string) => {
    router.push(`/itinerary/${itineraryId}`);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-semibold">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
            {/* Banner */}
            <div className="h-32 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                  backgroundSize: "200% 200%",
                }}
              />
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 -mt-16 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-indigo-600" />
                      )}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2 bg-linear-to-r from-yellow-400 to-orange-400 rounded-full p-2 shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>

                {/* User Details */}
                <div className="flex-1 text-center md:text-left">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-black text-black md:text-white mb-2"
                  >
                    {user?.email || "Travel Explorer"}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center md:justify-start gap-2 text-white/90 mb-4"
                  >
                    <Mail className="w-4 h-4" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-3 justify-center md:justify-start"
                  >
                    <div className="px-4 py-2 bg-linear-to-r from-indigo-100 to-purple-100 rounded-full flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-700">
                        {itineraries.length} {itineraries.length === 1 ? "Trip" : "Trips"}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-linear-to-r from-pink-100 to-rose-100 rounded-full flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-600" />
                      <span className="text-sm font-semibold text-pink-700">
                        Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : "2024"}
                      </span>
                    </div>
                  </motion.div>
                </div>

                
              </div>
            </div>
          </div>
        </motion.div>

        {/* Saved Itineraries Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
              <Mountain className="text-indigo-600" />
              My Saved Itineraries
            </h2>
          </div>

          {/* Itineraries Grid */}
          {itineraries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-16 text-center border border-indigo-100"
            >
              <div className="w-24 h-24 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Itineraries Yet</h3>
              <p className="text-slate-600 mb-6">
                Start planning your next adventure and save it here!
              </p>
              <button
                onClick={() => router.push("/Home")}
                className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Plan Your First Trip
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {itineraries.map((itinerary, index) => (
                  <motion.div
                    key={itinerary.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-indigo-100 hover:border-indigo-300"
                  >
                    {/* Card Header */}
                    <div className="h-32 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 20% 50%, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 34%, transparent 35%, transparent)",
                          backgroundSize: "50px 50px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Mountain className="w-16 h-16 text-white/30" />
                      </div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-xs font-semibold text-white">
                          {formatDate(itinerary.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                        {itinerary.province}
                      </h3>

                      {/* Details Grid */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-slate-700 font-semibold">
                            {itinerary.days} Day{itinerary.days > 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-slate-700 font-semibold">
                            {itinerary.pax} Traveler{itinerary.pax > 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                            <Hotel className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="text-slate-700 font-semibold truncate">
                            {itinerary.accommodation}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <Car className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-slate-700 font-semibold capitalize">
                            {itinerary.transport}
                          </span>
                        </div>
                      </div>

                      {/* Preferences Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {itinerary.preferences.map((pref) => (
                          <span
                            key={pref}
                            className="px-3 py-1 bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                            disabled
                          onClick={() => viewItinerary(itinerary.id)}
                          className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Eye className="w-4 h-4" />
                          View (coming soon..)
                        </button>
                        <button
                          onClick={() => openDeleteModal(itinerary.id)}
                          className="px-4 py-3 bg-linear-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal({ open: false, itineraryId: null })}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={40} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Delete Itinerary?</h3>
                <p className="text-slate-600 mb-8">
                  Are you sure you want to delete this itinerary? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, itineraryId: null })}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-red-500 to-pink-600 text-white font-semibold hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}