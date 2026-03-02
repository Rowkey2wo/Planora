"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Trash2, Pencil, FileText, MapPin, Clock, Download, X, Eye, CheckCircle2, AlertCircle, GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Province, Category, getSpotsByCategory } from "@/app/data/davaoData";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/firebase";
import { getAuth } from "firebase/auth";
import jsPDF from "jspdf";

/* ---------------- TYPES ---------------- */
type Activity = { id: string; name: string; time: string; startTime: Date; endTime: Date };
type DayPlan = { day: number; activities: Activity[] };

type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

type Props = {
  province: Province;
  preferences: Category[];
  pax: number;
  days: number;
  accommodation: string;
  transport: string;
  currentStep: number;
  onEdit: () => void;
};

/* ---------------- TIME HELPERS ---------------- */
const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const generateTimeSlots = (count: number) => {
  const slots: { time: string; startTime: Date; endTime: Date }[] = [];
  let current = new Date();
  current.setHours(8, 0, 0, 0);
  
  for (let i = 0; i < count; i++) {
    const start = new Date(current);
    const end = new Date(current);
    end.setMinutes(end.getMinutes() + 90);
    
    slots.push({
      time: `${formatTime(start)} - ${formatTime(end)}`,
      startTime: new Date(start),
      endTime: new Date(end)
    });
    
    current = new Date(end);
    current.setMinutes(current.getMinutes() + 15);
  }
  return slots;
};

const sortActivitiesByTime = (activities: Activity[]): Activity[] => {
  return [...activities].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

/* ---------------- DISTANCE HELPERS ---------------- */
const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/* ---------------- ITINERARY BUILDER ---------------- */
const buildItinerary = (
  province: Province,
  preferences: Category[],
  days: number
): DayPlan[] => {
  const itinerary: DayPlan[] = [];
  
  let allSpots = preferences.flatMap((cat) =>
    getSpotsByCategory(province, cat)
  );

  let currentLat = province.coordinates.lat;
  let currentLng = province.coordinates.lng;

  for (let day = 1; day <= days; day++) {
    const daySpots: typeof allSpots = [];
    
    const remainingDays = days - day + 1;
    const remainingSpots = allSpots.length;
    const spotsForThisDay = Math.ceil(remainingSpots / remainingDays);

    while (daySpots.length < spotsForThisDay && allSpots.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      
      allSpots.forEach((spot, i) => {
        const lat = (spot as any).lat ?? province.coordinates.lat;
        const lng = (spot as any).lng ?? province.coordinates.lng;
        const dist = getDistanceKm(currentLat, currentLng, lat, lng);
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestIndex = i;
        }
      });
      
      const [selected] = allSpots.splice(nearestIndex, 1);
      daySpots.push(selected);
      currentLat = (selected as any).lat ?? currentLat;
      currentLng = (selected as any).lng ?? currentLng;
    }

    const times = generateTimeSlots(daySpots.length);
    
    itinerary.push({
      day,
      activities: daySpots.map((place, i) => ({
        id: `${day}-${i}`,
        name: place.name,
        time: times[i].time,
        startTime: times[i].startTime,
        endTime: times[i].endTime
      })),
    });
  }
  
  return itinerary;
};

/* ---------------- COMPONENT ---------------- */
export default function ItineraryDisplay({
  province,
  preferences,
  days,
  pax,
  accommodation,
  transport,
  onEdit,
}: Props) {
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    day: number;
    activityId: string | null;
    isTimeEdit: boolean;
  }>({ open: false, day: 0, activityId: null, isTimeEdit: false });
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Time editing states
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  useEffect(
    () => setItinerary(buildItinerary(province, preferences, days)),
    [province, preferences, days]
  );

  const findPlaceImage = (
    placeName: string
  ): { image: string; type: "spot" | "hotel" } | null => {
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

  const saveToFirestore = async () => {
    if (!user) {
      showToast("error", "Please sign in to save your itinerary!");
      return;
    }

    if (isSaved) {
      showToast("error", "This itinerary has already been saved!");
      return;
    }

    setIsSaving(true);

    try {
      const timestamp = new Date().getTime();
      const itineraryId = `${user.uid}_${timestamp}`;
      
      const itineraryRef = doc(db, "itineraries", itineraryId);
      
      await setDoc(itineraryRef, {
        userId: user.uid,
        province: province.name,
        provinceId: province.id,
        preferences: preferences,
        days: days,
        pax: pax,
        accommodation: accommodation,
        transport: transport,
        itinerary: itinerary,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setIsSaved(true);
      showToast("success", "Itinerary saved successfully!");
    } catch (error) {
      console.error("Error saving itinerary:", error);
      showToast("error", "Failed to save itinerary. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (day: number, activityId: string, currentName: string, isTimeEdit: boolean = false) => {
    setEditModal({ open: true, day, activityId, isTimeEdit });
    setSelectedValue(currentName);
  
    if (isTimeEdit) {
      const dayPlan = itinerary.find(d => d.day === day);
      const activity = dayPlan?.activities.find(a => a.id === activityId);
      if (activity) {
        setCurrentActivity(activity);
        setSelectedStartTime(formatTime(activity.startTime));
        setSelectedEndTime(formatTime(activity.endTime));
      }
    } else {
      const place = findPlaceImage(currentName);
      if (place) {
        setPreviewImage(`/davao/${place.image}`);
      }
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

  const checkTimeConflict = (day: number, activityId: string, newStart: Date, newEnd: Date): boolean => {
    const dayPlan = itinerary.find(d => d.day === day);
    if (!dayPlan) return false;

    return dayPlan.activities.some(activity => {
      if (activity.id === activityId) return false;
      
      return (
        (newStart >= activity.startTime && newStart < activity.endTime) ||
        (newEnd > activity.startTime && newEnd <= activity.endTime) ||
        (newStart <= activity.startTime && newEnd >= activity.endTime)
      );
    });
  };

  const getAvailableTimeSlots = (day: number, currentActivityId: string) => {
    const dayPlan = itinerary.find(d => d.day === day);
    if (!dayPlan) return [];

    const allSlots: { time: string; available: boolean; activityName?: string }[] = [];
    const startHour = 6;
    const endHour = 22;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date();
        slotStart.setHours(hour, minute, 0, 0);
        const timeStr = formatTime(slotStart);
        
        const conflict = dayPlan.activities.find(activity => {
          if (activity.id === currentActivityId) return false;
          return slotStart >= activity.startTime && slotStart < activity.endTime;
        });
        
        allSlots.push({
          time: timeStr,
          available: !conflict,
          activityName: conflict?.name
        });
      }
    }
    
    return allSlots;
  };

  const saveEdit = () => {
    if (!editModal.activityId) return;

    if (editModal.isTimeEdit) {
      const startParts = selectedStartTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      const endParts = selectedEndTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      
      if (!startParts || !endParts) {
        showToast("error", "Invalid time format");
        return;
      }

      const newStart = new Date();
      const newEnd = new Date();
      
      let startHours = parseInt(startParts[1]);
      const startMinutes = parseInt(startParts[2]);
      const startPeriod = startParts[3].toUpperCase();
      
      let endHours = parseInt(endParts[1]);
      const endMinutes = parseInt(endParts[2]);
      const endPeriod = endParts[3].toUpperCase();
      
      if (startPeriod === "PM" && startHours !== 12) startHours += 12;
      if (startPeriod === "AM" && startHours === 12) startHours = 0;
      if (endPeriod === "PM" && endHours !== 12) endHours += 12;
      if (endPeriod === "AM" && endHours === 12) endHours = 0;
      
      newStart.setHours(startHours, startMinutes, 0, 0);
      newEnd.setHours(endHours, endMinutes, 0, 0);

      if (newEnd <= newStart) {
        showToast("error", "End time must be after start time");
        return;
      }

      if (checkTimeConflict(editModal.day, editModal.activityId, newStart, newEnd)) {
        showToast("error", "Time slot conflicts with another activity");
        return;
      }

      setItinerary((prev) =>
        prev.map((d) =>
          d.day === editModal.day
            ? {
                ...d,
                activities: sortActivitiesByTime(d.activities.map((a) =>
                  a.id === editModal.activityId
                    ? { 
                        ...a, 
                        time: `${selectedStartTime} - ${selectedEndTime}`,
                        startTime: newStart,
                        endTime: newEnd
                      }
                    : a
                )),
              }
            : d
        )
      );
      showToast("success", "Time updated successfully!");
    } else {
      setItinerary((prev) =>
        prev.map((d) =>
          d.day === editModal.day
            ? {
                ...d,
                activities: d.activities.map((a) =>
                  a.id === editModal.activityId ? { ...a, name: selectedValue } : a
                ),
              }
            : d
        )
      );
      showToast("success", "Activity updated successfully!");
    }

    setEditModal({ open: false, day: 0, activityId: null, isTimeEdit: false });
    setPreviewImage("");
    setCurrentActivity(null);
  };

  const openDeleteModal = (day: number, activityId: string | null) =>
    setDeleteModal({ open: true, day, activityId });

  const confirmDelete = () => {
    if (deleteModal.activityId) {
      setItinerary((prev) =>
        prev.map((d) =>
          d.day === deleteModal.day
            ? {
                ...d,
                activities: d.activities.filter((a) => a.id !== deleteModal.activityId),
              }
            : d
        )
      );
      showToast("success", "Activity deleted successfully!");
    } else {
      setItinerary((prev) => prev.filter((d) => d.day !== deleteModal.day));
      showToast("success", "Day deleted successfully!");
    }
    setDeleteModal({ open: false, day: 0, activityId: null });
  };

  const handleReorder = (day: number, newOrder: Activity[]) => {
    const times = generateTimeSlots(newOrder.length);
    const reorderedWithTimes = newOrder.map((activity, index) => ({
      ...activity,
      time: times[index].time,
      startTime: times[index].startTime,
      endTime: times[index].endTime
    }));

    setItinerary((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, activities: reorderedWithTimes }
          : d
      )
    );
  };

  const handleReorderComplete = () => {
    showToast("success", "Activities reordered!");
  };

  const generatePDF = () => {
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
      pdf.text(`${province.name} Itinerary`, pageWidth / 2, 20, { align: "center" });
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `${days} Day${days > 1 ? "s" : ""} • ${pax} Pax • ${accommodation}`,
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
      pdf.text(`Transport: ${transport}`, margin + 5, yPosition + 14);
      pdf.text(`Categories: ${preferences.join(", ")}`, margin + 5, yPosition + 21);
      yPosition += 35;

      itinerary.forEach((dayPlan) => {
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
          pdf.roundedRect(margin, boxY, contentWidth, activityHeight, 2, 2, "FD");
          pdf.setFillColor(14, 165, 233);
          pdf.circle(margin + 5, boxY + 6, 2, "F");
          pdf.setTextColor(14, 165, 233);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.text(activity.time, margin + 10, boxY + 7);
          pdf.setTextColor(30, 58, 138);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          const activityText = pdf.splitTextToSize(activity.name, contentWidth - 20);
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

      pdf.save(`${province.name}_Itinerary_${new Date().toISOString().split("T")[0]}.pdf`);
      showToast("success", "PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const totalSpotsInItinerary = itinerary.reduce((sum, day) => sum + day.activities.length, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
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

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-indigo-600 mb-2">
            Your {province.name} Adventure
          </h1>
          <p className="text-slate-600 text-lg">
            {days} Day{days > 1 ? "s" : ""} • {pax} Traveler{pax > 1 ? "s" : ""} •{" "}
            {totalSpotsInItinerary} Spots • {accommodation}
          </p>
          <p className="text-sm text-sky-600 mt-2">💡 Drag activities to reorder them!</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap gap-3 justify-center mb-10"
        >
          <button
            onClick={onEdit}
            className="px-6 py-3 rounded-full bg-white text-sky-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 border-2 border-sky-200"
          >
            <Pencil size={18} />
            Edit Plan
          </button>
          <button
            onClick={saveToFirestore}
            disabled={isSaving || isSaved}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ${
              isSaved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:scale-105"
            } ${isSaving ? "opacity-70 cursor-wait" : ""}`}
          >
            <Download size={18} />
            {isSaving ? "Saving..." : isSaved ? "Already Saved" : "Save to Account"}
          </button>
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="px-6 py-3 rounded-full bg-linear-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FileText size={18} />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </button>
        </motion.div>

        {/* Itinerary Cards */}
        <div className="space-y-8">
          {itinerary.map((dayPlan, dayIndex) => (
            <motion.div
              key={dayPlan.day}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-sky-100">
                <div className="bg-linear-to-r from-sky-500 to-blue-600 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{dayPlan.day}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">Day {dayPlan.day}</h2>
                      <p className="text-white/80 text-sm">{dayPlan.activities.length} activities</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(dayPlan.day, null)}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <Reorder.Group
                    axis="y"
                    values={dayPlan.activities}
                    onReorder={(newOrder) => handleReorder(dayPlan.day, newOrder)}
                    className="space-y-3"
                    layoutScroll
                    style={{ overflowY: 'visible' }}
                  >
                    {dayPlan.activities.map((activity, actIndex) => (
                      <Reorder.Item
                        key={activity.id}
                        value={activity}
                        id={activity.id}
                        dragListener={true}
                        dragElastic={0.05}
                        dragTransition={{ 
                          bounceStiffness: 600, 
                          bounceDamping: 40,
                          power: 0.2
                        }}
                        onDragEnd={handleReorderComplete}
                        initial={false}
                        whileDrag={{
                          scale: 1.03,
                          boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
                          zIndex: 100,
                          cursor: "grabbing",
                        }}
                        animate={{
                          scale: 1,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                        exit={{
                          scale: 0.95,
                          opacity: 0,
                        }}
                        transition={{
                          layout: {
                            type: "spring",
                            stiffness: 600,
                            damping: 45,
                            mass: 1,
                          },
                          scale: {
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }
                        }}
                        className="relative bg-linear-to-r from-sky-50 to-blue-50 rounded-2xl p-5 border-2 border-sky-200 hover:border-sky-300 transition-colors cursor-grab active:cursor-grabbing touch-none select-none"
                        style={{
                          originX: 0.5,
                          originY: 0.5,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-5 h-5 text-gray-400 shrink-0 cursor-grab active:cursor-grabbing" />
                          
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-linear-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg pointer-events-none z-10">
                            {actIndex + 1}
                          </div>
                          
                          <div className="flex justify-between items-start flex-1 ml-6">
                            <div className="flex-1 pointer-events-none select-none">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock size={16} className="text-sky-500" />
                                <p className="text-sm font-semibold text-sky-600">
                                  {activity.time}
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin size={18} className="text-blue-600 mt-1 shrink-0" />
                                <p className="font-bold text-slate-800 text-lg leading-tight">
                                  {activity.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4 pointer-events-auto">
                              <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openImageModal(activity.name);
                                }}
                                className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors touch-none"
                                title="View Image"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(dayPlan.day, activity.id, activity.name, false);
                                }}
                                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors touch-none"
                                title="Edit Place"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(dayPlan.day, activity.id, activity.name, true);
                                }}
                                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors touch-none"
                                title="Edit Time"
                              >
                                <Clock size={16} />
                              </button>
                              <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(dayPlan.day, activity.id);
                                }}
                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors touch-none"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {itinerary.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-500 text-lg">No itinerary generated yet.</p>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setImageModal({ open: false, name: "", image: "", type: "spot" })}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full"
            >
              <button
                onClick={() => setImageModal({ open: false, name: "", image: "", type: "spot" })}
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
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${
                    imageModal.type === "spot" 
                      ? "bg-sky-500/90 text-white" 
                      : "bg-purple-500/90 text-white"
                  }`}>
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
              setEditModal({ open: false, day: 0, activityId: null, isTimeEdit: false });
              setPreviewImage("");
              setCurrentActivity(null);
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
                {editModal.isTimeEdit ? "Edit Time Slot" : "Select New Place"}
              </h3>

              {editModal.isTimeEdit ? (
                <div className="space-y-6">
                  <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-sky-700 mb-2">Current Activity:</p>
                    <p className="font-bold text-slate-800">{currentActivity?.name}</p>
                    <p className="text-sm text-sky-600 mt-1">Current: {currentActivity?.time}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        Start Time
                      </label>
                      <select
                        className="w-full border-2 border-green-200 rounded-xl p-3 focus:outline-none focus:border-green-500 transition-colors"
                        value={selectedStartTime}
                        onChange={(e) => setSelectedStartTime(e.target.value)}
                      >
                        <option value="">-- Select start time --</option>
                        {getAvailableTimeSlots(editModal.day, editModal.activityId || "").map((slot) => (
                          <option 
                            key={slot.time} 
                            value={slot.time}
                            disabled={!slot.available}
                            className={!slot.available ? "text-gray-400" : ""}
                          >
                            {slot.time} {!slot.available ? `(${slot.activityName})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        End Time
                      </label>
                      <select
                        className="w-full border-2 border-green-200 rounded-xl p-3 focus:outline-none focus:border-green-500 transition-colors"
                        value={selectedEndTime}
                        onChange={(e) => setSelectedEndTime(e.target.value)}
                      >
                        <option value="">-- Select end time --</option>
                        {getAvailableTimeSlots(editModal.day, editModal.activityId || "").map((slot) => (
                          <option 
                            key={slot.time} 
                            value={slot.time}
                            disabled={!slot.available}
                            className={!slot.available ? "text-gray-400" : ""}
                          >
                            {slot.time} {!slot.available ? `(${slot.activityName})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Times shown as unavailable are already taken by other activities on this day. 
                      You can only modify your own activity's time range.
                    </p>
                  </div>
                </div>
              ) : (
                <>
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
                      <div className="bg-linear-to-r from-sky-50 to-blue-50 p-4">
                        <p className="text-center font-semibold text-slate-700">{selectedValue}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-sky-700 mb-2">
                        Tourist Spots
                      </label>
                      <select
                        className="w-full border-2 border-sky-200 rounded-xl p-3 focus:outline-none focus:border-sky-500 transition-colors"
                        value={selectedValue}
                        onChange={(e) => handleSelectionChange(e.target.value)}
                      >
                        <option value="">-- Select a spot --</option>
                        {province.spots.map((s) => (
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
                        className="w-full border-2 border-purple-200 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors"
                        value={selectedValue}
                        onChange={(e) => handleSelectionChange(e.target.value)}
                      >
                        <option value="">-- Select a hotel --</option>
                        {province.hotels.map((h) => (
                          <option key={h.name} value={h.name}>
                            {h.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setEditModal({ open: false, day: 0, activityId: null, isTimeEdit: false });
                    setPreviewImage("");
                    setCurrentActivity(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className={`flex-1 px-4 py-3 rounded-xl text-white font-semibold transition-all ${
                    editModal.isTimeEdit
                      ? "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      : "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  }`}
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
            onClick={() => setDeleteModal({ open: false, day: 0, activityId: null })}
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
                <h3 className="text-xl font-bold mb-2 text-slate-800">Confirm Deletion</h3>
                <p className="text-slate-600 mb-6">
                  {deleteModal.activityId
                    ? "Are you sure you want to remove this activity?"
                    : "Are you sure you want to delete this entire day?"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, day: 0, activityId: null })}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold transition-colors"
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