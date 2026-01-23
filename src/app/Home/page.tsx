"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Hotel, ChevronRight, LogOut, Sparkles, Compass, Tag } from "lucide-react";
import { provinces, getAvailableCategories, getSpotsByCategory, type Category, Province, Destination } from "@/app/data/davaoData";

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const router = useRouter();

  const handleLogout = () => {
    alert("Logout functionality - integrate with your Firebase auth");
  };

  const selected = provinces.find(p => p.id === selectedProvince);
  const availableCategories = selected ? getAvailableCategories(selected) : [];

  const categoryColors: Record<Category, string> = {
    "Beach": "bg-cyan-100 text-cyan-700 border-cyan-300",
    "Rural": "bg-green-100 text-green-700 border-green-300",
    "City Tours": "bg-purple-100 text-purple-700 border-purple-300",
    "Cultural": "bg-amber-100 text-amber-700 border-amber-300"
  };

  // Helper to get top 5 spots for "All" with a mix of categories
  const getTop5Spots = (province: Province, category: Category | "All") => {
    if (category === "All") {
      const categories = getAvailableCategories(province);
      const result: Destination[] = [];
      let idx = 0;

      while (result.length < 5) {
        let added = false;
        for (const cat of categories) {
          const spotsInCat = province.spots.filter(s => s.category === cat && !result.includes(s));
          if (spotsInCat[idx]) {
            result.push(spotsInCat[idx]);
            added = true;
            if (result.length === 5) break;
          }
        }
        if (!added) break; // no more spots to add
        idx++;
      }

      return result;
    } else {
      return getSpotsByCategory(province, category).slice(0, 5);
    }
  };

  const filteredSpots = selected ? getTop5Spots(selected, selectedCategory) : [];

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-white">

      <div className="max-w-7xl mx-auto px-16 py-32">
        {/* Welcome Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="bg-linear-to-r p-10 from-sky-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
              Hello there, Explorer! 👋
            </div>
          </div>

          <h2 className="text-5xl pb-5 font-bold mb-4 bg-linear-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Explore Davao Region
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your destination and discover amazing tourist spots, hotels, and experiences
          </p>
        </div>

        {/* Province Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {provinces.map((province, index) => {
            const Icon = province.icon;
            const isHovered = hoveredProvince === province.id;
            const isSelected = selectedProvince === province.id;

            return (
              <div
                key={province.id}
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                  transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => setHoveredProvince(province.id)}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => setSelectedProvince(isSelected ? null : province.id)}
                className="cursor-pointer relative group"
              >
                <div className={`relative h-full bg-white rounded-3xl p-6 shadow-xl transition-all duration-300 overflow-hidden ${isSelected ? 'ring-4 ring-sky-400' : ''}`}>
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${province.color} transition-opacity duration-300 ${isHovered ? 'opacity-10' : 'opacity-0'}`}
                    style={{ transform: isHovered ? 'scale(1.5) rotate(45deg)' : 'scale(1) rotate(0)', transition: 'all 0.6s ease' }}
                  />

                  {/* Icon */}
                  <div style={{ transform: isHovered ? 'rotate(10deg) scale(1.1)' : 'rotate(0) scale(1)', transition: 'all 0.5s ease' }} className={`w-16 h-16 rounded-2xl bg-linear-to-br ${province.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{province.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{province.tagline}</p>

                  {/* Spots Preview */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-sky-500" />
                      <span>{province.spots.length} Tourist Spots</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Hotel className="w-4 h-4 text-blue-500" />
                      <span>{province.hotels.length} Hotels</span>
                    </div>
                  </div>

                  {/* View Button */}
                  <div style={{ transform: isHovered ? 'translateX(5px)' : 'translateX(0)', transition: 'all 0.3s ease' }} className={`flex items-center gap-2 text-sm font-medium ${isSelected ? 'text-sky-600' : 'text-gray-400 group-hover:text-sky-600'}`}>
                    {isSelected ? 'Selected' : 'View Details'}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Province Details */}
        {selected && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ animation: 'scaleIn 0.5s ease-out' }}>
            {/* Header with Gradient */}
            <div className={`bg-linear-to-r ${selected.color} p-8 text-white relative overflow-hidden`}>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full animate-spin-slow" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full animate-spin-reverse" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-2">{selected.name}</h2>
                <p className="text-white/90 text-lg">{selected.tagline}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 p-8">
              {/* Tourist Spots */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Tourist Spots</h3>
                </div>

                {/* Category Filter */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === "All" ? "bg-sky-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All ({selected.spots.length > 5 ? 5 : selected.spots.length})
                  </button>
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        selectedCategory === category
                          ? "bg-sky-500 text-white shadow-md border-sky-500"
                          : `${categoryColors[category]} hover:shadow-sm`
                      }`}
                    >
                      {category} ({getSpotsByCategory(selected, category).length > 5 ? 5 : getSpotsByCategory(selected, category).length})
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredSpots.map((spot, idx) => (
                    <div key={spot.name} style={{ animation: `slideRight 0.5s ease-out ${0.3 + idx * 0.1}s both` }} className="bg-linear-to-r from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-100 hover:shadow-lg transition-all cursor-pointer group hover:translate-x-1">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-gray-700 block">{spot.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Tag className="w-3 h-3" />
                            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[spot.category]}`}>{spot.category}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Hotel className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Hotels</h3>
                </div>

                <div className="space-y-3">
                  {selected.hotels.slice(0, 5).map((hotel, idx) => (
                    <div key={hotel.name} style={{ animation: `slideLeft 0.5s ease-out ${0.4 + idx * 0.1}s both` }} className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-all cursor-pointer group hover:translate-x-1">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-gray-700 block">{hotel.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {hotel.rating && <span className="text-xs text-yellow-600">⭐ {hotel.rating}</span>}
                            {hotel.priceRange && <span className="text-xs text-gray-500">{hotel.priceRange}</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="p-8 pt-0">
              <div className="bg-linear-to-br from-sky-100 to-blue-100 rounded-2xl overflow-hidden">
                <div className="p-4 bg-white/50 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    <span className="font-semibold text-gray-700">Interactive Map</span>
                  </div>
                  <span className="text-sm text-gray-500">{selected.coordinates.lat}°N, {selected.coordinates.lng}°E</span>
                </div>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.coordinates.lng - 0.5},${selected.coordinates.lat - 0.3},${selected.coordinates.lng + 0.5},${selected.coordinates.lat + 0.3}&layer=mapnik&marker=${selected.coordinates.lat},${selected.coordinates.lng}`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  title={`Map of ${selected.name}`}
                  className="w-full"
                />
                <div className="p-4 bg-white/50 backdrop-blur-sm">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selected.coordinates.lat}&mlon=${selected.coordinates.lng}#map=10/${selected.coordinates.lat}/${selected.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                  >
                    View larger map
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-8 pt-0">
            <button
              onClick={() => router.push(`/generate/${selected.id}`)}
              className="w-full py-4 rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
            >
              <Compass className="w-6 h-6" />
              Start Planning Your Trip
              <ChevronRight className="w-6 h-6" />
            </button>

            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(50px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-fade-in { animation: slideUp 0.8s ease-out; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 15s linear infinite; }
      `}</style>
    </div>
  );
}
