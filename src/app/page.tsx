"use client";

import { Clock, Heart, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { provinces, Province } from "@/app/data/davaoData";

const davaoDelSur: Province | undefined = provinces.find(
  (p) => p.id === "davao-del-sur"
);

interface ExperienceCard {
  id: number;
  title: string;
  location: string;
  image: string;
  rating: number;
  reviews: string;
  price: string;
}

let topExperiences: ExperienceCard[] = [];

if (davaoDelSur) {
  topExperiences = [
    ...davaoDelSur.spots.slice(0, 4).map((spot, i) => ({
      id: i + 1,
      title: spot.name,
      location: "Davao del Sur",
      image: `/davao/${spot.image}`,
      rating: 4.8,
      reviews: "1,000",
      price: "₱2,000",
    })),
    ...davaoDelSur.hotels.slice(0, 4).map((hotel, i) => ({
      id: i + 5,
      title: hotel.name,
      location: "Davao del Sur",
      image: `/davao/${hotel.image}`,
      rating: hotel.rating || 4.7,
      reviews: "800",
      price: hotel.priceRange || "₱3,000",
    })),
  ];
}

export default function Home() {
  const [showAll, setShowAll] = useState(false);
  const visibleCards = showAll ? topExperiences : topExperiences.slice(0, 4);

  return (
    <main className="min-h-screen w-full overflow-x-hidden text-black">
      {/* HERO */}
      <section className="bg-linear-to-b from-sky-500 via-blue-400 to-white px-4 sm:px-8 lg:px-16 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/PlanoraTextOnly.png"
              alt="Planora"
              className="w-48 sm:w-90 mb-6"
            />

            <h1 className="text-sm sm:text-2xl tracking-widest text-white/80 mb-6">
              Smart planning, goals aligning
            </h1>

            <p className="text-sm sm:text-base lg:text-lg tracking-wider text-white leading-relaxed max-w-xl">
              Planora is a smart itinerary generator designed for foreigners and
              first-time visitors exploring the Davao Region—suggesting
              destinations, routes, and experiences tailored to local culture.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="LoginAndRegister"
                className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold text-center hover:bg-blue-500 transition"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src="/NoPlanoraTextBG.png"
              alt="Planora Graphic"
              className="w-64 sm:w-80 lg:w-full max-w-md"
            />
          </motion.div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 bg-white">
        <motion.div
          className="rounded-3xl bg-amber-50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10 items-center">
            <video
              src="/WakeUpDavao.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="rounded-2xl w-full"
            />

            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
                Discover Davao Without the Guesswork
              </h2>
              <p className="text-sm sm:text-base mb-6">
                Find things to do for everything you're into.
              </p>

              <Link href="LoginAndRegister">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-black text-white px-6 py-3 rounded-lg"
                >
                  Search Here
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* EXPERIENCES */}
      <section className="px-4 sm:px-8 lg:px-16 py-16 bg-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Top Experiences in Davao del Sur
        </h2>
        <p className="text-gray-500 mb-8">Best spots and hotels we recommend</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCards.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="rounded-xl bg-white shadow hover:shadow-xl transition overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <span className="text-xs text-gray-500">{item.location}</span>
                <h3 className="font-semibold text-base leading-snug mt-1 truncate">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm">
                  from{" "}
                  <span className="text-green-700 font-semibold">{item.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAll && (
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={() => setShowAll(true)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
            >
              See more experiences
            </motion.button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d1a44] text-white px-4 sm:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-2xl font-bold text-[#efd1a1] mb-4">Planora</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Smart itinerary planning for stress-free travel in the Davao Region.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Destinations</li>
              <li>Beaches</li>
              <li>Mountains</li>
              <li>City Tours</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Planora</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>About</li>
              <li>How It Works</li>
              <li>Travel Tips</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4">Get Started</h4>
            <Link
              href="LoginAndRegister"
              className="inline-block mt-2 rounded-full bg-[#efd1a1] px-6 py-3 font-semibold text-[#0d1a44]"
            >
              Create My Itinerary
            </Link>
          </motion.div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-12">
          © {new Date().getFullYear()} Planora. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
