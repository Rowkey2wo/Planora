"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Hotel,
  Car,
  Clock,
  Pencil,
  Trash2,
  Download,
  Loader2,
  Save,
  X,
  Eye,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import { provinces } from "@/app/data/davaoData";

type Activity = { id: string; name: string; time: string };
type DayPlan = { day: number; activities: Activity[] };

type SavedItinerary = {
  id: string;
  province: string;
  provinceId: string;
  preferences: string[];
  days: number;
  pax: number;
  accommodation: string;
  transport: string;
  itinerary: DayPlan[];
  createdAt: any;
};

type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

export default function SavedItineraryView() {
  const params = useParams();
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const itineraryId =
    typeof params.itineraryId === "string" ? params.itineraryId : null;

  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    day: number;
    activityId: string | null;
  }>({ open: false, day: 0, activityId: null });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    day: number;
    activityId: string | null;
  }>({ open: false, day: 0, activityId: null });
  const [imageModal, setImageModal] = useState<{
    open: boolean;
    name: string;
    image: string;
    type: "spot" | "hotel";
  }>({ open: false, name: "", image: "", type: "spot" });
  const [selectedValue, setSelectedValue] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast notification system
  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (!user) {
      router.push("/LoginAndRegister");
      return;
    }
    if (itineraryId) {
      fetchItinerary(itineraryId);
    }
  }, [itineraryId, user]);

  const fetchItinerary = async (id: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, "itineraries", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setItinerary({
          id: docSnap.id,
          ...data,
        } as SavedItinerary);
      } else {
        showToast("error", "Itinerary not found");
        setTimeout(() => router.push("/SeeProfile"), 2000);
      }
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      showToast("error", "Failed to load itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!itinerary) return;
    setSaving(true);
    try {
      const docRef = doc(db, "itineraries", itinerary.id);
      await updateDoc(docRef, {
        itinerary: itinerary.itinerary,
        updatedAt: new Date(),
      });
      showToast("success", "Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      showToast("error", "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const province = provinces.find((p) => p.id === itinerary?.provinceId);

  const findPlaceImage = (
    placeName: string
  ): { image: string; type: "spot" | "hotel" } | null => {
    if (!province) return null;
    const spot = province.spots.find((s) => s.name === placeName);
    if (spot) return { image: spot.image, type: "spot" };

    const hotel = province.hotels.find((h) => h.name === placeName);
    if (hotel) return { image: hotel.image, type: "hotel" };

    return null;
  };

  const openImageModal = (placeName: string) => {
    const place = findPlaceImage(placeName);
    if (place) {
      setImageModal({
        open: true,
        name: placeName,
        image: place.image,
        type: place.type,
      });
    }
  };

  const openEditModal = (
    day: number,
    activityId: string,
    currentName: string
  ) => {
    setEditModal({ open: true, day, activityId });
    setSelectedValue(currentName);

    const place = findPlaceImage(currentName);
    if (place) {
      setPreviewImage(`/davao/${place.image}`);
    }
  };

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);

    const place = findPlaceImage(value);
    if (place) {
      setPreviewImage(`/davao/${place.image}`);
    } else {
      setPreviewImage("");
    }
  };

  const saveEdit = () => {
    if (!editModal.activityId || !itinerary) return;
    const updatedItinerary = itinerary.itinerary.map((d) =>
      d.day === editModal.day
        ? {
            ...d,
            activities: d.activities.map((a) =>
              a.id === editModal.activityId ? { ...a, name: selectedValue } : a
            ),
          }
        : d
    );
    setItinerary({ ...itinerary, itinerary: updatedItinerary });
    setEditModal({ open: false, day: 0, activityId: null });
    setPreviewImage("");
    showToast("success", "Activity updated successfully!");
  };

  const openDeleteModal = (day: number, activityId: string | null) =>
    setDeleteModal({ open: true, day, activityId });

  const confirmDelete = () => {
    if (!itinerary) return;
    let updatedItinerary;
    if (deleteModal.activityId) {
      updatedItinerary = itinerary.itinerary.map((d) =>
        d.day === deleteModal.day
          ? {
              ...d,
              activities: d.activities.filter(
                (a) => a.id !== deleteModal.activityId
              ),
            }
          : d
      );
      showToast("success", "Activity deleted successfully!");
    } else {
      updatedItinerary = itinerary.itinerary.filter(
        (d) => d.day !== deleteModal.day
      );
      showToast("success", "Day deleted successfully!");
    }
    setItinerary({ ...itinerary, itinerary: updatedItinerary });
    setDeleteModal({ open: false, day: 0, activityId: null });
  };

  const generatePDF = () => {
    if (!itinerary) return;
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      const checkNewPage = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      pdf.setFillColor(14, 165, 233);
      pdf.rect(0, 0, pageWidth, 40, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${itinerary.province} Itinerary`, pageWidth / 2, 20, {
        align: "center",
      });
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `${itinerary.days} Day${itinerary.days > 1 ? "s" : ""} • ${
          itinerary.pax
        } Pax • ${itinerary.accommodation}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      yPosition = 50;
      pdf.setFillColor(240, 249, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, "F");
      pdf.setTextColor(3, 105, 161);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Trip Details", margin + 5, yPosition + 7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Transport: ${itinerary.transport}`, margin + 5, yPosition + 14);
      pdf.text(
        `Categories: ${itinerary.preferences.join(", ")}`,
        margin + 5,
        yPosition + 21
      );
      yPosition += 35;

      itinerary.itinerary.forEach((dayPlan) => {
        checkNewPage(20);
        pdf.setFillColor(14, 165, 233);
        pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${dayPlan.day}`, margin + 5, yPosition + 8);
        yPosition += 17;

        dayPlan.activities.forEach((activity) => {
          const activityHeight = 18;
          checkNewPage(activityHeight);
          const boxY = yPosition;
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(186, 230, 253);
          pdf.setLineWidth(0.5);
          pdf.roundedRect(
            margin,
            boxY,
            contentWidth,
            activityHeight,
            2,
            2,
            "FD"
          );
          pdf.setFillColor(14, 165, 233);
          pdf.circle(margin + 5, boxY + 6, 2, "F");
          pdf.setTextColor(14, 165, 233);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.text(activity.time, margin + 10, boxY + 7);
          pdf.setTextColor(30, 58, 138);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          const activityText = pdf.splitTextToSize(
            activity.name,
            contentWidth - 20
          );
          pdf.text(activityText, margin + 10, boxY + 13);
          yPosition += activityHeight + 3;
        });

        yPosition += 5;
      });

      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.setFont("helvetica", "italic");
        pdf.text(
          `Generated on ${new Date().toLocaleDateString()} • Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      pdf.save(
        `${itinerary.province}_Itinerary_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
      showToast("success", "PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-semibold">
            Loading itinerary...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  const totalSpots = itinerary.itinerary.reduce(
    (sum, day) => sum + day.activities.length,
    0
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Toast Notifications */}
        <div className="fixed top-20 right-4 z-100 space-y-3">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border-2 min-w-[320px] ${
                  toast.type === "success"
                    ? "bg-emerald-500/95 border-emerald-400 text-white"
                    : "bg-red-500/95 border-red-400 text-white"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 shrink-0" />
                )}
                <p className="font-semibold text-sm flex-1">{toast.message}</p>
                <button
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                  className="hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/SeeProfile")}
            className="mb-6 flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Profile
          </button>

          {/* Hero Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
            <div className="h-48 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 relative overflow-hidden">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 34%, transparent 35%, transparent)",
                  backgroundSize: "80px 80px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-5xl font-black mb-2">
                    {itinerary.province}
                  </h1>
                  <p className="text-xl font-semibold opacity-90">
                    {itinerary.days} Day Adventure
                  </p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                      Duration
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {itinerary.days} Day{itinerary.days > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                    <Users className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                      Travelers
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {itinerary.pax} Pax
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                      Total Spots
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {totalSpots} Places
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <Car className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                      Transport
                    </p>
                    <p className="text-lg font-bold text-slate-800 capitalize">
                      {itinerary.transport}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="px-4 py-2 bg-linear-to-r from-pink-50 to-rose-50 rounded-full border border-pink-200">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-pink-600" />
                    <span className="text-sm font-semibold text-pink-700">
                      {itinerary.accommodation}
                    </span>
                  </div>
                </div>
                {itinerary.preferences.map((pref) => (
                  <span
                    key={pref}
                    className="px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200"
                  >
                    {pref}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Itinerary Timeline */}
        <div className="space-y-6">
          {itinerary.itinerary.map((dayPlan, dayIndex) => (
            <motion.div
              key={dayPlan.day}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-200">
                {/* Day Header */}
                <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <span className="text-white font-black text-2xl">
                        {dayPlan.day}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">
                        Day {dayPlan.day}
                      </h2>
                      <p className="text-white/90 text-sm font-semibold">
                        {dayPlan.activities.length} Activities Planned
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(dayPlan.day, null)}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-xl transition-all"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>

                {/* Activities */}
                <div className="p-6">
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-emerald-300 to-teal-300" />

                    <div className="space-y-4">
                      <AnimatePresence>
                        {dayPlan.activities.map((activity, actIndex) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: actIndex * 0.05 }}
                            className="relative pl-20"
                          >
                            {/* Timeline Dot */}
                            <div className="absolute left-6 top-6 w-5 h-5 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full border-4 border-white shadow-lg z-10" />

                            {/* Activity Card */}
                            <div className="bg-linear-to-br from-slate-50 to-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all group">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-emerald-200">
                                      <div className="flex items-center gap-2">
                                        <Clock
                                          size={14}
                                          className="text-emerald-600"
                                        />
                                        <span className="text-sm font-bold text-emerald-700">
                                          {activity.time}
                                        </span>
                                      </div>
                                    </div>
                                    <ChevronRight
                                      className="text-emerald-400"
                                      size={20}
                                    />
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <MapPin
                                      size={20}
                                      className="text-teal-600 mt-0.5 shrink-0"
                                    />
                                    <h3 className="text-xl font-black text-slate-800 leading-tight">
                                      {activity.name}
                                    </h3>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() =>
                                      openImageModal(activity.name)
                                    }
                                    className="p-2.5 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all shadow-sm"
                                    title="View Image"
                                  >
                                    <Eye size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openEditModal(
                                        dayPlan.day,
                                        activity.id,
                                        activity.name
                                      )
                                    }
                                    className="p-2.5 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all shadow-sm"
                                  >
                                    <Pencil size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openDeleteModal(dayPlan.day, activity.id)
                                    }
                                    className="p-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all shadow-sm"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() =>
              setImageModal({ open: false, name: "", image: "", type: "spot" })
            }
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full"
            >
              <button
                onClick={() =>
                  setImageModal({
                    open: false,
                    name: "",
                    image: "",
                    type: "spot",
                  })
                }
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-lg"
              >
                <X size={24} className="text-slate-700" />
              </button>

              <div className="relative">
                <img
                  src={`/davao/${imageModal.image}`}
                  alt={imageModal.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/davao/placeholder.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                      imageModal.type === "spot"
                        ? "bg-emerald-500/90 text-white"
                        : "bg-purple-500/90 text-white"
                    }`}
                  >
                    {imageModal.type === "spot" ? "Tourist Spot" : "Hotel"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-3xl font-bold drop-shadow-lg">
                    {imageModal.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setEditModal({ open: false, day: 0, activityId: null });
              setPreviewImage("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-800">
                Select New Place
              </h3>

              {previewImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 rounded-2xl overflow-hidden shadow-lg"
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/davao/placeholder.jpg";
                    }}
                  />
                  <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-4">
                    <p className="text-center font-semibold text-slate-700">
                      {selectedValue}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    Tourist Spots
                  </label>
                  <select
                    className="w-full border-2 border-emerald-200 rounded-xl p-3 focus:outline-none text-slate-800 focus:border-emerald-500 transition-colors"
                    value={selectedValue}
                    onChange={(e) => handleSelectionChange(e.target.value)}
                  >
                    <option value="">-- Select a spot --</option>
                    {province?.spots.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2">
                    Hotels
                  </label>
                  <select
                    className="w-full border-2 border-purple-200 rounded-xl text-slate-800 p-3 focus:outline-none focus:border-purple-500 transition-colors"
                    value={selectedValue}
                    onChange={(e) => handleSelectionChange(e.target.value)}
                  >
                    <option value="">-- Select a hotel --</option>
                    {province?.hotels.map((h) => (
                      <option key={h.name} value={h.name}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setEditModal({ open: false, day: 0, activityId: null });
                    setPreviewImage("");
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() =>
              setDeleteModal({ open: false, day: 0, activityId: null })
            }
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">
                  Confirm Deletion
                </h3>
                <p className="text-slate-600 mb-6">
                  {deleteModal.activityId
                    ? "Are you sure you want to remove this activity?"
                    : "Are you sure you want to delete this entire day?"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ open: false, day: 0, activityId: null })
                  }
                  className="flex-1 px-4 py-3 rounded-xl text-slate-800 bg-slate-200 hover:bg-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
