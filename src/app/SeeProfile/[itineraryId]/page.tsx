"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
  GripVertical,
  Sparkles,
  Check,
  Activity,
} from "lucide-react";
import jsPDF from "jspdf";
import { provinces } from "@/app/data/davaoData";
import type { Activity as ProvinceActivity, Province } from "@/app/data/davaoData";

type Activity = { id: string; name: string; time: string; startTime?: any; endTime?: any };
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
  selectedActivities: string[] | null;
  itinerary: DayPlan[];
  createdAt: any;
};

type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

/* ---------------- ACTIVITY CATEGORY STYLES ---------------- */
const activityCategoryStyles: Record<ProvinceActivity["category"], { bg: string; border: string; text: string; selectedBg: string; selectedBorder: string; selectedText: string; dot: string }> = {
  Water:     { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   selectedBg: "bg-blue-500",   selectedBorder: "border-blue-500",   selectedText: "text-white", dot: "bg-blue-400" },
  Nature:    { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  selectedBg: "bg-green-500",  selectedBorder: "border-green-500",  selectedText: "text-white", dot: "bg-green-400" },
  Culture:   { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", selectedBg: "bg-purple-500", selectedBorder: "border-purple-500", selectedText: "text-white", dot: "bg-purple-400" },
  Adventure: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", selectedBg: "bg-orange-500", selectedBorder: "border-orange-500", selectedText: "text-white", dot: "bg-orange-400" },
  Leisure:   { bg: "bg-pink-50",   border: "border-pink-200",   text: "text-pink-700",   selectedBg: "bg-pink-500",   selectedBorder: "border-pink-500",   selectedText: "text-white", dot: "bg-pink-400" },
  Food:      { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  selectedBg: "bg-amber-500",  selectedBorder: "border-amber-500",  selectedText: "text-white", dot: "bg-amber-400" },
};

const activityCategoryLabels: Record<ProvinceActivity["category"], string> = {
  Water: "🌊 Water & Beach",
  Nature: "🌿 Nature & Wildlife",
  Culture: "🏛️ Culture & Heritage",
  Adventure: "⚡ Adventure & Thrills",
  Leisure: "😌 Leisure & Relaxation",
  Food: "🍽️ Food & Dining",
};

/* ---------------- TIME HELPERS ---------------- */
const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const generateTimeSlots = (count: number) => {
  const slots: { time: string }[] = [];
  let current = new Date();
  current.setHours(8, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const start = new Date(current);
    const end = new Date(current);
    end.setMinutes(end.getMinutes() + 90);
    slots.push({ time: `${formatTime(start)} - ${formatTime(end)}` });
    current = new Date(end);
    current.setMinutes(current.getMinutes() + 15);
  }
  return slots;
};

/* ---------------- ACTIVITIES EDIT MODAL ---------------- */
function ActivitiesEditModal({
  province,
  selectedActivities,
  onSave,
  onClose,
}: {
  province: Province;
  selectedActivities: string[];
  onSave: (ids: string[]) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<string[]>(selectedActivities);
  const [activeFilter, setActiveFilter] = useState<ProvinceActivity["category"] | "All">("All");

  const allCategories = Array.from(new Set(province.activities.map((a: ProvinceActivity) => a.category))) as ProvinceActivity["category"][];
  const filtered = activeFilter === "All" ? province.activities : province.activities.filter(a => a.category === activeFilter);

  const toggle = (id: string) => {
    setLocal(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-slate-800">Edit Activities</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">Select the activities you want to do in {province.name}.</p>

        {/* Selected count */}
        {local.length > 0 && (
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl px-4 py-2 shadow flex items-center gap-2">
              <span className="text-xl font-black">{local.length}</span>
              <span className="text-sm font-bold">selected</span>
            </div>
            <button
              onClick={() => setLocal([])}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 rounded-full px-3 py-1.5 hover:border-red-200 hover:bg-red-50"
            >
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${activeFilter === "All" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
          >
            🎯 All
          </button>
          {allCategories.map(cat => {
            const style = activityCategoryStyles[cat];
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${isActive ? `${style.selectedBg} ${style.selectedText} ${style.selectedBorder}` : `bg-white ${style.text} ${style.border}`}`}
              >
                {activityCategoryLabels[cat].split(" ")[0]} {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {filtered.map((activity: ProvinceActivity) => {
            const isSelected = local.includes(activity.id);
            const style = activityCategoryStyles[activity.category];
            return (
              <button
                key={activity.id}
                onClick={() => toggle(activity.id)}
                className={`relative group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center
                  ${isSelected ? `${style.selectedBg} ${style.selectedBorder} shadow-lg scale-105` : `bg-white ${style.border} hover:${style.bg} hover:shadow-md`}`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-current">
                    <Check className={`w-3.5 h-3.5 ${style.text}`} />
                  </div>
                )}
                <span className={`text-3xl transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}>{activity.emoji}</span>
                <span className={`text-xs font-semibold leading-tight ${isSelected ? style.selectedText : style.text}`}>{activity.label}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/60" : style.dot}`} />
              </button>
            );
          })}
        </div>

        {/* Selected preview */}
        {local.length > 0 && (
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-2 border-violet-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-bold text-violet-700 mb-3">✨ Your activity lineup:</p>
            <div className="flex flex-wrap gap-2">
              {local.map(id => {
                const act = province.activities.find(a => a.id === id);
                if (!act) return null;
                const style = activityCategoryStyles[act.category];
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.selectedBg} ${style.selectedText} shadow-sm hover:opacity-80 transition-opacity`}
                  >
                    {act.emoji} {act.label} <X className="w-3 h-3 opacity-70" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(local)}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-semibold hover:from-violet-600 hover:to-fuchsia-700 transition-all shadow-md"
          >
            Save Activities
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function SavedItineraryView() {
  const params = useParams();
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const itineraryId = typeof params.itineraryId === "string" ? params.itineraryId : null;

  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; day: number; activityId: string | null }>({ open: false, day: 0, activityId: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; day: number; activityId: string | null }>({ open: false, day: 0, activityId: null });
  const [imageModal, setImageModal] = useState<{ open: boolean; name: string; image: string; type: "spot" | "hotel" }>({ open: false, name: "", image: "", type: "spot" });
  const [activitiesModal, setActivitiesModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    if (!user) { router.push("/LoginAndRegister"); return; }
    if (itineraryId) fetchItinerary(itineraryId);
  }, [itineraryId, user]);

  const fetchItinerary = async (id: string) => {
    try {
      setLoading(true);
      const docSnap = await getDoc(doc(db, "itineraries", id));
      if (docSnap.exists()) {
        setItinerary({ id: docSnap.id, ...docSnap.data() } as SavedItinerary);
      } else {
        showToast("error", "Itinerary not found");
        setTimeout(() => router.push("/SeeProfile"), 2000);
      }
    } catch (error) {
      showToast("error", "Failed to load itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!itinerary) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "itineraries", itinerary.id), {
        itinerary: itinerary.itinerary,
        selectedActivities: itinerary.selectedActivities ?? null,
        updatedAt: new Date(),
      });
      showToast("success", "Changes saved successfully!");
    } catch (error) {
      showToast("error", "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const province = provinces.find(p => p.id === itinerary?.provinceId);

  const findPlaceImage = (placeName: string): { image: string; type: "spot" | "hotel" } | null => {
    if (!province) return null;
    const spot = province.spots.find(s => s.name === placeName);
    if (spot) return { image: spot.image, type: "spot" };
    const hotel = province.hotels.find(h => h.name === placeName);
    if (hotel) return { image: hotel.image, type: "hotel" };
    return null;
  };

  const openImageModal = (placeName: string) => {
    const place = findPlaceImage(placeName);
    if (place) setImageModal({ open: true, name: placeName, image: place.image, type: place.type });
  };

  const openEditModal = (day: number, activityId: string, currentName: string) => {
    setEditModal({ open: true, day, activityId });
    setSelectedValue(currentName);
    const place = findPlaceImage(currentName);
    if (place) setPreviewImage(`/davao/${place.image}`);
  };

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    const place = findPlaceImage(value);
    setPreviewImage(place ? `/davao/${place.image}` : "");
  };

  const saveEdit = () => {
    if (!editModal.activityId || !itinerary) return;
    setItinerary({
      ...itinerary,
      itinerary: itinerary.itinerary.map(d =>
        d.day === editModal.day
          ? { ...d, activities: d.activities.map(a => a.id === editModal.activityId ? { ...a, name: selectedValue } : a) }
          : d
      ),
    });
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
      updatedItinerary = itinerary.itinerary.map(d =>
        d.day === deleteModal.day
          ? { ...d, activities: d.activities.filter(a => a.id !== deleteModal.activityId) }
          : d
      );
      showToast("success", "Activity deleted successfully!");
    } else {
      updatedItinerary = itinerary.itinerary.filter(d => d.day !== deleteModal.day);
      showToast("success", "Day deleted successfully!");
    }
    setItinerary({ ...itinerary, itinerary: updatedItinerary });
    setDeleteModal({ open: false, day: 0, activityId: null });
  };

  const handleReorder = (day: number, newOrder: Activity[]) => {
    if (!itinerary) return;
    const times = generateTimeSlots(newOrder.length);
    const reorderedWithTimes = newOrder.map((activity, index) => ({
      ...activity,
      time: times[index].time,
    }));
    setItinerary({
      ...itinerary,
      itinerary: itinerary.itinerary.map(d =>
        d.day === day ? { ...d, activities: reorderedWithTimes } : d
      ),
    });
  };

  const handleSaveActivities = (newIds: string[]) => {
    if (!itinerary) return;
    setItinerary({ ...itinerary, selectedActivities: newIds.length > 0 ? newIds : null });
    setActivitiesModal(false);
    showToast("success", "Activities updated! Remember to save changes.");
  };

  const generatePDF = () => {
    if (!itinerary) return;
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      const checkNewPage = (h: number) => {
        if (yPosition + h > pageHeight - margin) { pdf.addPage(); yPosition = margin; }
      };

      pdf.setFillColor(14, 165, 233);
      pdf.rect(0, 0, pageWidth, 40, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24); pdf.setFont("helvetica", "bold");
      pdf.text(`${itinerary.province} Itinerary`, pageWidth / 2, 20, { align: "center" });
      pdf.setFontSize(12); pdf.setFont("helvetica", "normal");
      pdf.text(`${itinerary.days} Day${itinerary.days > 1 ? "s" : ""} • ${itinerary.pax} Pax • ${itinerary.accommodation}`, pageWidth / 2, 30, { align: "center" });

      yPosition = 50;
      pdf.setFillColor(240, 249, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, "F");
      pdf.setTextColor(3, 105, 161); pdf.setFontSize(10); pdf.setFont("helvetica", "bold");
      pdf.text("Trip Details", margin + 5, yPosition + 7);
      pdf.setFont("helvetica", "normal"); pdf.setTextColor(71, 85, 105);
      pdf.text(`Transport: ${itinerary.transport}`, margin + 5, yPosition + 14);
      pdf.text(`Categories: ${itinerary.preferences.join(", ")}`, margin + 5, yPosition + 21);
      yPosition += 35;

      // Activities section
      if (itinerary.selectedActivities && itinerary.selectedActivities.length > 0 && province) {
        checkNewPage(20);
        pdf.setFillColor(245, 243, 255);
        pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, "F");
        pdf.setTextColor(109, 40, 217); pdf.setFontSize(11); pdf.setFont("helvetica", "bold");
        pdf.text(`Planned Activities (${itinerary.selectedActivities.length})`, margin + 5, yPosition + 8);
        yPosition += 17;

        const activityLabels = itinerary.selectedActivities.map(id => {
          const act = province.activities.find(a => a.id === id);
          return act ? act.label : id;
        });
        const activityText = activityLabels.join("  •  ");
        const splitText = pdf.splitTextToSize(activityText, contentWidth - 10);
        const actHeight = splitText.length * 6 + 10;
        checkNewPage(actHeight);
        pdf.setFillColor(255, 255, 255); pdf.setDrawColor(221, 214, 254);
        pdf.roundedRect(margin, yPosition, contentWidth, actHeight, 2, 2, "FD");
        pdf.setTextColor(109, 40, 217); pdf.setFontSize(9); pdf.setFont("helvetica", "normal");
        pdf.text(splitText, margin + 5, yPosition + 7);
        yPosition += actHeight + 8;
      }

      itinerary.itinerary.forEach(dayPlan => {
        checkNewPage(20);
        pdf.setFillColor(14, 165, 233);
        pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, "F");
        pdf.setTextColor(255, 255, 255); pdf.setFontSize(14); pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${dayPlan.day}`, margin + 5, yPosition + 8);
        yPosition += 17;

        dayPlan.activities.forEach(activity => {
          const actH = 18; checkNewPage(actH);
          pdf.setFillColor(255, 255, 255); pdf.setDrawColor(186, 230, 253); pdf.setLineWidth(0.5);
          pdf.roundedRect(margin, yPosition, contentWidth, actH, 2, 2, "FD");
          pdf.setFillColor(14, 165, 233); pdf.circle(margin + 5, yPosition + 6, 2, "F");
          pdf.setTextColor(14, 165, 233); pdf.setFontSize(9); pdf.setFont("helvetica", "normal");
          pdf.text(activity.time, margin + 10, yPosition + 7);
          pdf.setTextColor(30, 58, 138); pdf.setFontSize(10); pdf.setFont("helvetica", "bold");
          pdf.text(pdf.splitTextToSize(activity.name, contentWidth - 20), margin + 10, yPosition + 13);
          yPosition += actH + 3;
        });
        yPosition += 5;
      });

      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i); pdf.setFontSize(8); pdf.setTextColor(148, 163, 184); pdf.setFont("helvetica", "italic");
        pdf.text(`Generated on ${new Date().toLocaleDateString()} • Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      pdf.save(`${itinerary.province}_Itinerary_${new Date().toISOString().split("T")[0]}.pdf`);
      showToast("success", "PDF downloaded successfully!");
    } catch (error) {
      showToast("error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-semibold">Loading itinerary...</p>
        </motion.div>
      </div>
    );
  }

  if (!itinerary) return null;

  const totalSpots = itinerary.itinerary.reduce((sum, day) => sum + day.activities.length, 0);
  const savedActivities = itinerary.selectedActivities ?? [];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Toast Notifications */}
        <div className="fixed top-20 right-4 z-[100] space-y-3">
          <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border-2 min-w-[320px] ${toast.type === "success" ? "bg-emerald-500/95 border-emerald-400 text-white" : "bg-red-500/95 border-red-400 text-white"}`}
              >
                {toast.type === "success" ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                <p className="font-semibold text-sm flex-1">{toast.message}</p>
                <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => router.push("/SeeProfile")} className="mb-6 flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-semibold">
            <ArrowLeft size={20} /> Back to Profile
          </button>

          {/* Hero Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
            <div className="h-48 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 relative overflow-hidden">
              <motion.div
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 opacity-30"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 34%, transparent 35%, transparent)", backgroundSize: "80px 80px" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-5xl font-black mb-2">{itinerary.province}</h1>
                  <p className="text-xl font-semibold opacity-90">{itinerary.days} Day Adventure</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Info Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                {[
                  { icon: Calendar, color: "emerald", label: "Duration", value: `${itinerary.days} Day${itinerary.days > 1 ? "s" : ""}` },
                  { icon: Users, color: "teal", label: "Travelers", value: `${itinerary.pax} Pax` },
                  { icon: MapPin, color: "cyan", label: "Total Spots", value: `${totalSpots} Places` },
                  { icon: Car, color: "purple", label: "Transport", value: itinerary.transport, capitalize: true },
                ].map(({ icon: Icon, color, label, value, capitalize }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-linear-to-br from-${color}-100 to-${color}-200 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${color}-600`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">{label}</p>
                      <p className={`text-lg font-bold text-slate-800 ${capitalize ? "capitalize" : ""}`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="px-4 py-2 bg-linear-to-r from-pink-50 to-rose-50 rounded-full border border-pink-200 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-semibold text-pink-700">{itinerary.accommodation}</span>
                </div>
                {itinerary.preferences.map(pref => (
                  <span key={pref} className="px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200">{pref}</span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
                </button>
                <button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGeneratingPDF ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Download className="w-5 h-5" /> Download PDF</>}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── ACTIVITIES SECTION ── */}
        {province && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <div className="bg-white rounded-3xl shadow-xl border border-violet-100 overflow-hidden">
              {/* Header */}
              <div className="bg-linear-to-r from-violet-500 to-fuchsia-600 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Planned Activities</h2>
                    <p className="text-white/80 text-sm">
                      {savedActivities.length > 0 ? `${savedActivities.length} activit${savedActivities.length === 1 ? "y" : "ies"} selected` : "No activities selected yet"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivitiesModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all border border-white/30 text-sm"
                >
                  <Pencil size={16} /> Edit Activities
                </button>
              </div>

              <div className="p-6">
                {savedActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 italic text-sm mb-4">No activities have been selected for this trip.</p>
                    <button
                      onClick={() => setActivitiesModal(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold text-sm shadow hover:shadow-md hover:scale-105 transition-all"
                    >
                      + Add Activities
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Group by category */}
                    {(["Water", "Nature", "Culture", "Adventure", "Leisure", "Food"] as ProvinceActivity["category"][]).map(cat => {
                      const catActivities = savedActivities
                        .map(id => province.activities.find(a => a.id === id))
                        .filter((a): a is ProvinceActivity => !!a && a.category === cat);
                      if (catActivities.length === 0) return null;
                      const style = activityCategoryStyles[cat];
                      return (
                        <div key={cat} className="mb-4 last:mb-0">
                          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${style.text}`}>
                            {activityCategoryLabels[cat]}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {catActivities.map(act => (
                              <span
                                key={act.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${style.bg} ${style.text} border ${style.border}`}
                              >
                                {act.emoji} {act.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ITINERARY TIMELINE ── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-700">Daily Itinerary</h2>
            <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">💡 Drag to reorder</span>
          </div>

          {itinerary.itinerary.map((dayPlan, dayIndex) => (
            <motion.div
              key={dayPlan.day}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-200">
                {/* Day Header */}
                <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <span className="text-white font-black text-2xl">{dayPlan.day}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Day {dayPlan.day}</h2>
                      <p className="text-white/90 text-sm font-semibold">{dayPlan.activities.length} Activities Planned</p>
                    </div>
                  </div>
                  <button onClick={() => openDeleteModal(dayPlan.day, null)} className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-xl transition-all">
                    <Trash2 size={22} />
                  </button>
                </div>

                {/* Activities - Draggable */}
                <div className="p-6">
                  <Reorder.Group
                    axis="y"
                    values={dayPlan.activities}
                    onReorder={newOrder => handleReorder(dayPlan.day, newOrder)}
                    className="space-y-4"
                    layoutScroll
                    style={{ overflowY: "visible" }}
                  >
                    <AnimatePresence>
                      {dayPlan.activities.map((activity, actIndex) => (
                        <Reorder.Item
                          key={activity.id}
                          value={activity}
                          id={activity.id}
                          dragElastic={0.05}
                          dragTransition={{ bounceStiffness: 600, bounceDamping: 40, power: 0.2 }}
                          onDragEnd={() => showToast("success", "Activities reordered!")}
                          initial={false}
                          whileDrag={{ scale: 1.03, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)", zIndex: 100, cursor: "grabbing" }}
                          animate={{ scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{
                            layout: { type: "spring", stiffness: 600, damping: 45, mass: 1 },
                            scale: { type: "spring", stiffness: 400, damping: 30 },
                          }}
                          className="relative cursor-grab active:cursor-grabbing touch-none select-none"
                        >
                          <div className="bg-linear-to-br from-slate-50 to-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3 flex-1">
                                {/* Drag handle */}
                                <GripVertical className="w-5 h-5 text-gray-400 mt-1 shrink-0" />

                                {/* Number badge */}
                                <div className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow shrink-0 mt-0.5">
                                  {actIndex + 1}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-emerald-200">
                                      <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-emerald-600" />
                                        <span className="text-sm font-bold text-emerald-700">{activity.time}</span>
                                      </div>
                                    </div>
                                    <ChevronRight className="text-emerald-400" size={20} />
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin size={20} className="text-teal-600 mt-0.5 shrink-0" />
                                    <h3 className="text-xl font-black text-slate-800 leading-tight">{activity.name}</h3>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 ml-4 pointer-events-auto">
                                <button
                                  onPointerDown={e => e.stopPropagation()}
                                  onClick={e => { e.stopPropagation(); openImageModal(activity.name); }}
                                  className="p-2.5 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all shadow-sm touch-none"
                                  title="View Image"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onPointerDown={e => e.stopPropagation()}
                                  onClick={e => { e.stopPropagation(); openEditModal(dayPlan.day, activity.id, activity.name); }}
                                  className="p-2.5 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all shadow-sm touch-none"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onPointerDown={e => e.stopPropagation()}
                                  onClick={e => { e.stopPropagation(); openDeleteModal(dayPlan.day, activity.id); }}
                                  className="p-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all shadow-sm touch-none"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activities Edit Modal */}
      <AnimatePresence>
        {activitiesModal && province && (
          <ActivitiesEditModal
            province={province}
            selectedActivities={savedActivities}
            onSave={handleSaveActivities}
            onClose={() => setActivitiesModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModal.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setImageModal({ open: false, name: "", image: "", type: "spot" })}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full"
            >
              <button onClick={() => setImageModal({ open: false, name: "", image: "", type: "spot" })} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-lg">
                <X size={24} className="text-slate-700" />
              </button>
              <div className="relative">
                <img src={`/davao/${imageModal.image}`} alt={imageModal.name} className="w-full h-96 object-cover" onError={e => { e.currentTarget.src = "/davao/placeholder.jpg"; }} />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${imageModal.type === "spot" ? "bg-emerald-500/90 text-white" : "bg-purple-500/90 text-white"}`}>
                    {imageModal.type === "spot" ? "Tourist Spot" : "Hotel"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-3xl font-bold drop-shadow-lg">{imageModal.name}</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Place Modal */}
      <AnimatePresence>
        {editModal.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => { setEditModal({ open: false, day: 0, activityId: null }); setPreviewImage(""); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Select New Place</h3>
              {previewImage && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img src={previewImage} alt="Preview" className="w-full h-64 object-cover" onError={e => { e.currentTarget.src = "/davao/placeholder.jpg"; }} />
                  <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-4">
                    <p className="text-center font-semibold text-slate-700">{selectedValue}</p>
                  </div>
                </motion.div>
              )}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">Tourist Spots</label>
                  <select className="w-full border-2 border-emerald-200 rounded-xl p-3 focus:outline-none text-slate-800 focus:border-emerald-500 transition-colors" value={selectedValue} onChange={e => handleSelectionChange(e.target.value)}>
                    <option value="">-- Select a spot --</option>
                    {province?.spots.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2">Hotels</label>
                  <select className="w-full border-2 border-purple-200 rounded-xl text-slate-800 p-3 focus:outline-none focus:border-purple-500 transition-colors" value={selectedValue} onChange={e => handleSelectionChange(e.target.value)}>
                    <option value="">-- Select a hotel --</option>
                    {province?.hotels.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => { setEditModal({ open: false, day: 0, activityId: null }); setPreviewImage(""); }} className="flex-1 px-4 py-3 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold transition-colors">Cancel</button>
                <button onClick={saveEdit} className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal({ open: false, day: 0, activityId: null })}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Confirm Deletion</h3>
                <p className="text-slate-600 mb-6">{deleteModal.activityId ? "Are you sure you want to remove this activity?" : "Are you sure you want to delete this entire day?"}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal({ open: false, day: 0, activityId: null })} className="flex-1 px-4 py-3 rounded-xl text-slate-800 bg-slate-200 hover:bg-slate-300 font-semibold transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}