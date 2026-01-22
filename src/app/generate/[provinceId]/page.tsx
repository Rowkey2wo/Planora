"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { ArrowLeft, Check, Users, Calendar, DollarSign, Car, Bus, Waves, TreePine, Building2, Landmark } from "lucide-react";
import ItineraryDisplay from "./ItineraryDisplay";
import { provinces, getAvailableCategories, type Category, getSpotsByCategory } from "@/app/data/davaoData";

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
  const [transport, setTransport] = useState("");

  const totalSteps = 7;
  const canProceed = () => {
    switch (currentStep) {
      case 1: return preferences.length > 0;
      case 2: return pax > 0;
      case 3: return days > 0;
      case 4: return accommodation !== "";
      case 5: return transport !== "";
      case 6: return true;
      default: return true;
    }
  };

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
                          <p className="text-sm text-gray-500">{province.spots.filter(s => s.category === cat).length} places</p>
                        </div>
                      </div>
                      {selected && <Check className="text-sky-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Budget */}
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
              <input type="range" min={1} max={14} value={days} onChange={e => setDays(+e.target.value)} className="w-64 accent-sky-500"/>
              <button onClick={() => setDays(prev => Math.min(14, prev + 1))} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md">+</button>
            </div>
          </div>
        );

      /* STEP 4 - ACCOMMODATION */
      case 4:
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {province.hotels.slice(0, 6).map(h => (
              <button key={h.name} onClick={() => setAccommodation(h.name)} className={`p-6 rounded-2xl border-2 text-left ${accommodation===h.name?"border-sky-500 bg-sky-50":"border-gray-200"}`}>
                <h3 className="font-bold">{h.name}</h3>
                <p className="text-sm text-gray-500">⭐ {h.rating} · {h.priceRange}</p>
              </button>
            ))}
          </div>
        );

      /* STEP 5 - TRANSPORT */
      case 5:
        return (
          <div className="grid md:grid-cols-3 gap-6">
            {transportOptions.map(opt => {
              const Icon = opt.icon;
              return (
                <button key={opt.id} onClick={() => setTransport(opt.id)} className={`p-6 rounded-2xl border-2 ${transport===opt.id?"border-sky-500 bg-sky-50":"border-gray-200"}`}>
                  <Icon className="mx-auto mb-3"/>
                  <h3 className="font-bold">{opt.label}</h3>
                  <p className="text-sm text-gray-500">{opt.capacity}</p>
                </button>
              );
            })}
          </div>
        );

      /* STEP 6 - REVIEW */
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-center">Review</h2>
            <div className="p-6 rounded-2xl border">
              <p><b>Province:</b> {province.name}</p>
              <p><b>Preferences:</b> {preferences.join(", ")}</p>
              <p><b>Travelers:</b> {pax}</p>
              <p><b>Days:</b> {days}</p>
              <p><b>Hotel:</b> {accommodation}</p>
              <p><b>Transport:</b> {transport}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    if (currentStep === 7 && itineraryRef.current) itineraryRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-white px-6 py-16">
      <div className="max-w-5xl mx-auto text-black">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 mt-5 cursor-pointer"><ArrowLeft/> Back</button>
        <h1 className="text-4xl font-bold text-center mb-10">Plan your trip to {province.name}</h1>

        {currentStep < 7 && <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8">{renderStep()}</div>}

        <div className="flex justify-between mb-8">
          {currentStep < 7 && <>
            <button disabled={currentStep===1} onClick={() => setCurrentStep(s=>s-1)} className="px-6 py-3 rounded-xl bg-white shadow disabled:opacity-40">Previous</button>
            <button disabled={!canProceed()} onClick={() => setCurrentStep(s=>s+1)} className="px-6 py-3 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-white disabled:opacity-40">Next</button>
          </>}
        </div>

        {/* STEP 7 - ITINERARY DISPLAY */}
        {currentStep===7 && (
          <div ref={itineraryRef}>
            <ItineraryDisplay
              province={province}
              preferences={preferences}
              pax={pax}
              days={days}
              accommodation={accommodation}
              transport={transport}
              currentStep={currentStep}
              onEdit={() => setCurrentStep(1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
