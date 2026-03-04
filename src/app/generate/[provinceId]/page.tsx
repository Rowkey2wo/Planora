"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { ArrowLeft, Check, Users, Calendar, DollarSign, Car, Bus, Waves, TreePine, Building2, Landmark, Hotel, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import ItineraryDisplay from "./ItineraryDisplay";
import { provinces, getAvailableCategories, type Category, getSpotsByCategory, type Activity } from "@/app/data/davaoData";

/* ---------------- STATIC OPTIONS ---------------- */
const budgetRanges = [
  { id: "budget", label: "Budget", range: "₱1,000 - ₱3,000", icon: "💰" },
  { id: "moderate", label: "Moderate", range: "₱3,000 - ₱7,000", icon: "💵" },
  { id: "luxury", label: "Luxury", range: "₱7,000+", icon: "💎" }
];

const transportOptions = [
  { id: "van", label: "Van", icon: Car, capacity: "8–12 people" },
  { id: "car", label: "Private Car", icon: Car, capacity: "4–5 people" },
  { id: "bus", label: "Bus", icon: Bus, capacity: "20+ people" }
];

const categoryIcons: Record<Category, any> = {
  Beach: Waves,
  Rural: TreePine,
  "City Tours": Building2,
  Cultural: Landmark
};

const toImageName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".jpg";

/* ---------------- ACTIVITY CATEGORY STYLES ---------------- */
const activityCategoryStyles: Record<Activity["category"], { bg: string; border: string; text: string; selectedBg: string; selectedBorder: string; selectedText: string; dot: string }> = {
  Water:     { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   selectedBg: "bg-blue-500",   selectedBorder: "border-blue-500",   selectedText: "text-white", dot: "bg-blue-400" },
  Nature:    { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  selectedBg: "bg-green-500",  selectedBorder: "border-green-500",  selectedText: "text-white", dot: "bg-green-400" },
  Culture:   { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", selectedBg: "bg-purple-500", selectedBorder: "border-purple-500", selectedText: "text-white", dot: "bg-purple-400" },
  Adventure: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", selectedBg: "bg-orange-500", selectedBorder: "border-orange-500", selectedText: "text-white", dot: "bg-orange-400" },
  Leisure:   { bg: "bg-pink-50",   border: "border-pink-200",   text: "text-pink-700",   selectedBg: "bg-pink-500",   selectedBorder: "border-pink-500",   selectedText: "text-white", dot: "bg-pink-400" },
  Food:      { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  selectedBg: "bg-amber-500",  selectedBorder: "border-amber-500",  selectedText: "text-white", dot: "bg-amber-400" },
};

const activityCategoryLabels: Record<Activity["category"], string> = {
  Water: "🌊 Water & Beach",
  Nature: "🌿 Nature & Wildlife",
  Culture: "🏛️ Culture & Heritage",
  Adventure: "⚡ Adventure & Thrills",
  Leisure: "😌 Leisure & Relaxation",
  Food: "🍽️ Food & Dining",
};

/* ---------------- HOTEL CAROUSEL ---------------- */
function HotelCarousel({
  hotels,
  selected,
  onSelect,
}: {
  hotels: { name: string; rating?: number; priceRange?: string }[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex(i => (i === 0 ? hotels.length - 1 : i - 1));
  const next = () => setActiveIndex(i => (i === hotels.length - 1 ? 0 : i + 1));

  const getVisible = () => {
    const len = hotels.length;
    if (len === 1) return [{ hotel: hotels[0], pos: "center", idx: 0 }];
    if (len === 2) return [
      { hotel: hotels[0], pos: activeIndex === 0 ? "center" : "left", idx: 0 },
      { hotel: hotels[1], pos: activeIndex === 1 ? "center" : "right", idx: 1 },
    ];
    return [
      { hotel: hotels[(activeIndex - 1 + len) % len], pos: "left", idx: (activeIndex - 1 + len) % len },
      { hotel: hotels[activeIndex], pos: "center", idx: activeIndex },
      { hotel: hotels[(activeIndex + 1) % len], pos: "right", idx: (activeIndex + 1) % len },
    ];
  };

  const visible = getVisible();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center w-full gap-4 py-6">
        {hotels.length > 1 && (
          <button onClick={prev} className="z-10 p-2 rounded-full bg-white shadow-lg hover:bg-sky-50 border border-gray-200 transition-all shrink-0">
            <ChevronLeft className="w-6 h-6 text-sky-600" />
          </button>
        )}
        <div className="flex items-center justify-center gap-4 overflow-hidden w-full">
          {visible.map(({ hotel, pos, idx }) => {
            const isCenter = pos === "center";
            const isSelected = selected === hotel.name;
            const imageName = toImageName(hotel.name);
            return (
              <div
                key={idx}
                onClick={() => { setActiveIndex(idx); onSelect(hotel.name); }}
                className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${isCenter ? "w-64 shadow-2xl scale-100 opacity-100 z-10 border-sky-400" : "w-48 shadow-md scale-90 opacity-60 z-0 border-gray-200 hover:opacity-80"} ${isSelected && isCenter ? "border-sky-500 ring-4 ring-sky-300" : ""}`}
              >
                <div className={`${isCenter ? "h-44" : "h-32"} w-full overflow-hidden bg-gray-100`}>
                  <img src={`/davao/${imageName}`} alt={hotel.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/images/placeholder-hotel.jpg"; }} />
                </div>
                <div className={`bg-white p-3 ${isCenter ? "p-4" : "p-3"}`}>
                  <h3 className={`font-bold text-gray-800 leading-tight ${isCenter ? "text-base" : "text-sm"}`}>{hotel.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {hotel.rating && <span className="text-xs text-yellow-600 font-medium">⭐ {hotel.rating}</span>}
                    {hotel.priceRange && <span className="text-xs text-gray-500">{hotel.priceRange}</span>}
                  </div>
                  {isCenter && (
                    <button onClick={(e) => { e.stopPropagation(); onSelect(hotel.name); }} className={`mt-3 w-full py-1.5 rounded-lg text-sm font-semibold transition-all ${isSelected ? "bg-sky-500 text-white shadow-md" : "bg-sky-50 text-sky-600 border border-sky-300 hover:bg-sky-100"}`}>
                      {isSelected ? <span className="flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Selected</span> : "Select"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {hotels.length > 1 && (
          <button onClick={next} className="z-10 p-2 rounded-full bg-white shadow-lg hover:bg-sky-50 border border-gray-200 transition-all shrink-0">
            <ChevronRight className="w-6 h-6 text-sky-600" />
          </button>
        )}
      </div>
      {hotels.length > 1 && (
        <div className="flex gap-2">
          {hotels.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-sky-500 w-6" : "bg-gray-300"}`} />
          ))}
        </div>
      )}
      {selected && (
        <div className="bg-sky-50 border-2 border-sky-200 rounded-xl px-6 py-3 text-center">
          <p className="text-sky-700 font-semibold text-sm">✅ Selected: <span className="font-bold">{selected}</span></p>
        </div>
      )}
    </div>
  );
}

/* ---------------- ACTIVITIES STEP ---------------- */
function ActivitiesStep({
  province,
  selectedActivities,
  onToggle,
}: {
  province: { activities: Activity[]; name: string };
  selectedActivities: string[];
  onToggle: (id: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<Activity["category"] | "All">("All");
  const allCategories = Array.from(new Set(province.activities.map((a: Activity) => a.category))) as Activity["category"][];
  const activities: Activity[] = province.activities;

  const filtered = activeFilter === "All" ? activities : activities.filter(a => a.category === activeFilter);
  const selectedCount = selectedActivities.length;

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-violet-100 to-fuchsia-100 border border-violet-200 rounded-full px-4 py-1.5 mb-3">
          <span className="text-sm font-semibold text-violet-700">Optional Step</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">What will you do there?</h2>
        <p className="text-gray-500">Pick the activities you're excited about — or skip and we'll surprise you!</p>
      </div>

      {/* Selected count bubble */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="bg-linear-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl px-5 py-2.5 shadow-lg flex items-center gap-3">
            <span className="text-2xl font-black">{selectedCount}</span>
            <div>
              <p className="text-sm font-bold leading-none">activit{selectedCount === 1 ? "y" : "ies"} selected</p>
              <p className="text-xs text-white/70 mt-0.5">tap to deselect</p>
            </div>
          </div>
          <button
            onClick={() => selectedActivities.forEach(id => onToggle(id))}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 rounded-full px-3 py-2 hover:border-red-200 hover:bg-red-50"
          >
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${activeFilter === "All" ? "bg-gray-800 text-white border-gray-800 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
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
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${isActive ? `${style.selectedBg} ${style.selectedText} ${style.selectedBorder} shadow-md` : `bg-white ${style.text} ${style.border} hover:${style.bg}`}`}
            >
              {activityCategoryLabels[cat].split(" ")[0]} {cat}
            </button>
          );
        })}
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((activity) => {
          const isSelected = selectedActivities.includes(activity.id);
          const style = activityCategoryStyles[activity.category];
          return (
            <button
              key={activity.id}
              onClick={() => onToggle(activity.id)}
              className={`relative group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center
                ${isSelected
                  ? `${style.selectedBg} ${style.selectedBorder} shadow-lg scale-105`
                  : `bg-white ${style.border} hover:${style.bg} hover:scale-102 hover:shadow-md`
                }`}
            >
              {/* Check badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-current">
                  <Check className={`w-3.5 h-3.5 ${style.text}`} style={{ color: isSelected ? "white" : undefined }} />
                </div>
              )}

              {/* Emoji */}
              <span className={`text-3xl transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}>
                {activity.emoji}
              </span>

              {/* Label */}
              <span className={`text-xs font-semibold leading-tight ${isSelected ? style.selectedText : style.text}`}>
                {activity.label}
              </span>

              {/* Category dot */}
              <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/60" : style.dot}`} />
            </button>
          );
        })}
      </div>

      {/* Selected Activities Preview */}
      {selectedCount > 0 && (
        <div className="bg-linear-to-r from-violet-50 to-fuchsia-50 border-2 border-violet-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-violet-700 mb-3">Your activity lineup:</p>
          <div className="flex flex-wrap gap-2">
            {selectedActivities.map(id => {
              const act = activities.find(a => a.id === id);
              if (!act) return null;
              const style = activityCategoryStyles[act.category];
              return (
                <button
                  key={id}
                  onClick={() => onToggle(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.selectedBg} ${style.selectedText} shadow-sm hover:opacity-80 transition-opacity`}
                >
                  {act.emoji} {act.label}
                  <X className="w-3 h-3 opacity-70" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Skip hint */}
      {selectedCount === 0 && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-400 italic">💡 No activities selected — that's totally fine! You can skip this step.</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- PAGE ---------------- */
export default function ItineraryForm() {
  const router = useRouter();
  const params = useParams();
  const itineraryRef = useRef<HTMLDivElement>(null);

  const provinceId = typeof params.provinceId === "string" ? params.provinceId : null;
  const province = provinces.find(p => p.id === provinceId);
  if (!province) notFound();

  const availableCategories = getAvailableCategories(province);

  /* ---------------- STATE ---------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<Category[]>([]);
  const [budget, setBudget] = useState("");
  const [pax, setPax] = useState(1);
  const [days, setDays] = useState(1);
  const [accommodation, setAccommodation] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [transport, setTransport] = useState("");

  const totalSpots = preferences.reduce((sum, cat) => {
    return sum + getSpotsByCategory(province, cat).length;
  }, 0);

  const maxDays = Math.max(1, totalSpots);

  // Steps: 1=interests, 2=pax, 3=days, 4=accommodation, 5=activities, 6=transport, 7=review, 8=itinerary
  const totalSteps = 7;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return preferences.length > 0;
      case 2: return pax > 0;
      case 3: return days > 0;
      case 4: return accommodation !== "";
      case 5: return true; // activities is optional
      case 6: return transport !== "";
      case 7: return true;
      default: return true;
    }
  };

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (days > maxDays) setDays(maxDays);
  }, [preferences, maxDays]);

  /* ---------------- STEP RENDER ---------------- */
  const renderStep = () => {
    switch (currentStep) {

      /* STEP 1 - INTERESTS */
      case 1:
        return (
          <div className="space-y-8 text-black">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">What interests you in {province.name}?</h2>
              <p className="text-gray-600">Select your preferred activities</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {availableCategories.map(cat => {
                const Icon = categoryIcons[cat];
                const selected = preferences.includes(cat);
                const spotCount = getSpotsByCategory(province, cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setPreferences(prev =>
                        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                      )
                    }
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${selected ? "border-sky-500 bg-sky-50 shadow-lg" : "border-gray-200 hover:border-sky-300"}`}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? "bg-sky-500" : "bg-gray-100"}`}>
                          <Icon className={selected ? "text-white" : "text-gray-600"} />
                        </div>
                        <div>
                          <h3 className="font-bold">{cat}</h3>
                          <p className="text-sm text-gray-500">{spotCount} places</p>
                        </div>
                      </div>
                      {selected && <Check className="text-sky-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {preferences.length > 0 && (
              <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4 text-center">
                <p className="text-sky-700 font-semibold">
                  Total Spots Selected: <span className="text-2xl font-bold">{totalSpots}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You can plan up to {totalSpots} days for this itinerary
                </p>
              </div>
            )}

            <div className="pt-6 border-t">
              <h3 className="font-bold mb-4 flex items-center gap-2"><DollarSign className="text-sky-500"/> Budget (Optional)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {budgetRanges.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(budget === b.id ? "" : b.id)}
                    className={`p-4 rounded-xl border-2 ${budget === b.id ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}
                  >
                    <div className="text-2xl">{b.icon}</div>
                    <div className="font-bold">{b.label}</div>
                    <div className="text-sm text-gray-500">{b.range}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      /* STEP 2 - PAX */
      case 2:
        return (
          <div className="text-center space-y-6">
            <Users className="w-16 h-16 mx-auto text-sky-500"/>
            <h2 className="text-3xl font-bold">How many travelers?</h2>
            <div className="text-4xl font-bold text-sky-600 mt-2">{pax} traveler{pax > 1 ? "s" : ""}</div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={() => setPax(prev => Math.max(1, prev - 1))} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md">-</button>
              <input type="range" min={1} max={20} value={pax} onChange={e => setPax(+e.target.value)} className="w-64 accent-sky-500"/>
              <button onClick={() => setPax(prev => Math.min(20, prev + 1))} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md">+</button>
            </div>
          </div>
        );

      /* STEP 3 - DAYS */
      case 3:
        return (
          <div className="text-center space-y-6">
            <Calendar className="w-16 h-16 mx-auto text-sky-500"/>
            <h2 className="text-3xl font-bold">Trip duration (Days)</h2>
            <div className="text-4xl font-bold text-sky-600 mt-2">{days} day{days > 1 ? "s" : ""}</div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={() => setDays(prev => Math.max(1, prev - 1))} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md">-</button>
              <input type="range" min={1} max={maxDays} value={days} onChange={e => setDays(+e.target.value)} className="w-64 accent-sky-500"/>
              <button onClick={() => setDays(prev => Math.min(maxDays, prev + 1))} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md">+</button>
            </div>
            <p className="text-sm text-gray-500">
              Maximum {maxDays} days based on {totalSpots} selected spots
            </p>
          </div>
        );

      /* STEP 4 - ACCOMMODATION CAROUSEL */
      case 4:
        return (
          <div className="space-y-4 text-black">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Choose your accommodation</h2>
              <p className="text-gray-600">Browse and select a hotel for your stay</p>
            </div>
            <HotelCarousel
              hotels={province.hotels}
              selected={accommodation}
              onSelect={setAccommodation}
            />
          </div>
        );

      /* STEP 5 - ACTIVITIES (NEW) */
      case 5:
        return (
          <ActivitiesStep
            province={province}
            selectedActivities={selectedActivities}
            onToggle={toggleActivity}
          />
        );

      /* STEP 6 - TRANSPORT */
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Choose your transport</h2>
              <p className="text-gray-600">Select how you'll get around</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {transportOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <button key={opt.id} onClick={() => setTransport(opt.id)} className={`p-6 rounded-2xl border-2 transition-all ${transport===opt.id?"border-sky-500 bg-sky-50 shadow-lg":"border-gray-200 hover:border-sky-300"}`}>
                    <Icon className="mx-auto mb-3 w-12 h-12"/>
                    <h3 className="font-bold text-center">{opt.label}</h3>
                    <p className="text-sm text-gray-500 text-center">{opt.capacity}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      /* STEP 7 - REVIEW */
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-center mb-6">Review Your Trip</h2>
            <div className="p-6 rounded-2xl border-2 border-sky-200 bg-sky-50 space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Province:</span>
                <span className="font-bold text-gray-800">{province.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Preferences:</span>
                <span className="font-bold text-gray-800">{preferences.join(", ")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Total Spots:</span>
                <span className="font-bold text-gray-800">{totalSpots} places</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Travelers:</span>
                <span className="font-bold text-gray-800">{pax}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Days:</span>
                <span className="font-bold text-gray-800">{days}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Spots per day:</span>
                <span className="font-bold text-gray-800">~{Math.ceil(totalSpots / days)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Hotel:</span>
                <span className="font-bold text-gray-800">{accommodation}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Transport:</span>
                <span className="font-bold text-gray-800">{transport}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Activities:</span>
                <span className="font-bold text-gray-800">
                  {selectedActivities.length > 0
                    ? `${selectedActivities.length} selected`
                    : <span className="text-gray-400 font-normal italic">None selected</span>
                  }
                </span>
              </div>
              {selectedActivities.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {selectedActivities.map(id => {
                    const act = province.activities.find(a => a.id === id);
                    if (!act) return null;
                    const style = activityCategoryStyles[act.category];
                    return (
                      <span key={id} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
                        {act.emoji} {act.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    if (currentStep === 8 && itineraryRef.current) itineraryRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-white px-6 py-16">
      <div className="max-w-5xl mx-auto text-black">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 mt-5 cursor-pointer hover:text-sky-600 transition-colors"><ArrowLeft/> Back</button>
        <h1 className="text-4xl font-bold text-center mb-10">Plan your trip to {province.name}</h1>

        {currentStep < 8 && <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8">{renderStep()}</div>}

        <div className="flex justify-between mb-8">
          {currentStep < 8 && <>
            <button disabled={currentStep===1} onClick={() => setCurrentStep(s=>s-1)} className="px-6 py-3 rounded-xl bg-white shadow disabled:opacity-40 hover:bg-gray-50 transition-colors">Previous</button>
            <button disabled={!canProceed()} onClick={() => setCurrentStep(s=>s+1)} className="px-6 py-3 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-white disabled:opacity-40 hover:shadow-lg transition-all">
              {currentStep === 5 && selectedActivities.length === 0 ? "Skip" : "Next"}
            </button>
          </>}
        </div>

        {/* STEP 8 - ITINERARY DISPLAY */}
        {currentStep === 8 && (
          <div ref={itineraryRef}>
            <ItineraryDisplay
              province={province}
              preferences={preferences}
              pax={pax}
              days={days}
              accommodation={accommodation}
              transport={transport}
              selectedActivities={selectedActivities}
              currentStep={currentStep}
              onEdit={() => setCurrentStep(1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}