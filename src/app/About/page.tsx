"use client";

import { motion, AnimatePresence } from "motion/react";
import { Waypoints, Goal, MapPin, Sparkles, GraduationCap, Heart, ChevronDown, Eye } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const teamMembers = [
  "Bellezas, Sophia Christelle",
  "Bueno, Zhyriel Gwyn N.",
  "Buhe, Princess Joy M.",
  "Canindo, Joevan Xylex Yestine",
  "Cañones, Jullian T.",
  "Cesar, Maria Alexzhandra",
  "Delos Reyes, Leslie",
  "Deocades, Marycris",
  "Formoso, Trixzellyn Geyl C.",
  "Gasatan, Janney Lou E.",
  "Gonzaga, Xianelle Angelee L.",
  "Hingpit, Kyle",
  "Jamarolin, Kim Shaira P.",
  "Jorge, Jose T.",
  "Kando, Shiyota M.",
  "Libuit, Mishane A.",
  "Lituañas, Anthoniza Cassandra C.",
  "Lozaldo, Thalia Rose A.",
  "Magallon, Jianne Leigh T.",
  "Malaluan, Margaret C.",
  "Onda, Kenji R.",
  "Perez, Desiree Hope H.",
  "Revita, April Hope P.",
  "Retardo, Andrea Ehler",
  "Riego de Dios, Fe Ashley A.",
  "Salinas, Jezzel Mae F.",
  "Senajon, Jhon Benedict B.",
  "Siatan, Aadi Marzilo B.",
];

// Extract last name preserving original casing to match filenames on Vercel's case-sensitive filesystem
function getLastName(fullName: string): string {
  // Format is "LastName, FirstName MiddleInitial"
  return fullName.split(",")[0].trim();
}

const features = [
  {
    icon: Waypoints,
    title: "Smart Planning",
    description: "AI-powered itinerary generation that adapts to your preferences and creates optimized travel plans.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MapPin,
    title: "Davao Focused",
    description: "Comprehensive coverage of Davao Region's provinces, tourist spots, and hidden gems.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Goal,
    title: "Goals Aligning",
    description: "Every destination carefully selected to match your travel goals and create unforgettable experiences.",
    color: "from-orange-500 to-red-500",
  },
];

export default function About() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const toggleMember = (index: number) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg">
              Capstone Project
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
              Planora
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-semibold text-slate-700 mb-8"
          >
            "Smart planning, goals aligning"
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionizing travel planning in Davao Region with intelligent itinerary generation,
            personalized recommendations, and seamless trip organization.
          </motion.p>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 text-blue-400 opacity-20"
        >
          <MapPin size={80} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 right-10 text-purple-400 opacity-20"
        >
          <Goal size={100} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-800"
          >
            What Makes Planora Special
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-linear-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Waypoints size={32} />
                <h3 className="text-3xl font-bold">Our Mission</h3>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                To empower travelers with intelligent, personalized itinerary planning that maximizes
                their experience in Davao Region while promoting local tourism and sustainable travel practices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Eye size={32} />
                <h3 className="text-3xl font-bold">Our Vision</h3>
              </div>
              <p className="text-lg leading-relaxed text-white/90">
                To become the leading travel planning platform in the Philippines, setting new standards
                for smart tourism technology and inspiring unforgettable journeys across the archipelago.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-linear-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-6">
              <GraduationCap className="text-blue-600" size={24} />
              <span className="font-semibold text-slate-700">LPU Davao • BSTM 2-2</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-600">
              28 passionate students working together to revolutionize travel planning
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => {
              const lastName = getLastName(member);
              const isExpanded = expandedMember === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                  className="relative group"
                >
                  <div
                    className={`
                      bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300
                      border-2 ${isExpanded ? "border-blue-500" : "border-slate-100"}
                      overflow-hidden cursor-pointer
                    `}
                    onClick={() => toggleMember(index)}
                  >
                    {/* Member Header */}
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white
                            bg-linear-to-br ${
                              index % 4 === 0
                                ? "from-blue-500 to-cyan-500"
                                : index % 4 === 1
                                ? "from-purple-500 to-pink-500"
                                : index % 4 === 2
                                ? "from-orange-500 to-red-500"
                                : "from-green-500 to-teal-500"
                            }
                          `}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm leading-tight">
                            {member}
                          </p>
                        </div>
                      </div>

                      {/* Chevron Icon */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="ml-2 shrink-0 text-slate-400"
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </div>

                    {/* Dropdown Image */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="dropdown"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <motion.div
                              initial={{ scale: 0.92, y: -8 }}
                              animate={{ scale: 1, y: 0 }}
                              exit={{ scale: 0.92, y: -8 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-inner"
                            >
                              <Image
                                src={`/IndividualPics/${lastName}.JPG`}
                                alt={member}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Team Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-2">
                28
              </div>
              <p className="text-slate-600 font-semibold">Team Members</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 mb-2">
                1
              </div>
              <p className="text-slate-600 font-semibold">Shared Vision</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600 mb-2">
                ∞
              </div>
              <p className="text-slate-600 font-semibold">Possibilities</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Acknowledgment Section */}
      <section className="py-16 px-4 bg-linear-to-br from-slate-800 to-slate-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Heart className="mx-auto mb-6 text-pink-400" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">With Gratitude</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Special thanks to our advisers, faculty members, and the LPU Davao community for their
            unwavering support and guidance throughout this capstone journey. This project represents
            countless hours of collaboration, learning, and innovation.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <GraduationCap size={24} className="text-blue-400" />
            <span className="font-semibold">Lyceum of the Philippines University - Davao</span>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let Planora transform your travel dreams into perfectly planned realities
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Planning Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}