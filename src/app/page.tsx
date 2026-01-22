"use client";

import { Clock, Heart, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { provinces, Province, Destination, Hotel } from "@/app/data/davaoData";

const davaoDelSur: Province | undefined = provinces.find(p => p.id === "davao-del-sur");
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
  const allSpots: Destination[] = davaoDelSur.spots;
  const allHotels: Hotel[] = davaoDelSur.hotels;

  topExperiences = [
    ...allSpots.slice(0, 4).map((spot, idx) => ({
      id: idx + 1,
      title: spot.name,
      location: "Davao del Sur",
      image: `/davao/${spot.image}`,
      rating: 4.8,
      reviews: "1,000",
      price: "₱2,000",
    })),
    ...allHotels.slice(0, 4).map((hotel, idx) => ({
      id: idx + 5,
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
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full flex-col items-center justify-between sm:items-start text-black">

        {/* Hero Section */}
        <section className="py-30 md:px-16 px-0 bg-linear-to-b from-sky-500 via-blue-400 to-white">
          <div className="grid md:grid-cols-2 grid-cols-1 w-full p-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <img src="/PlanoraTextOnly.png" className="w-3/5" alt="planoraText" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="text-2xl tracking-widest text-white/80 mb-10">
                  Smart planning, goals aligning
                </h1>
                <p className="text-md text-white tracking-widest">
                  Planora is a smart itinerary generator designed for foreigners and first-time visitors
                  exploring the Davao Region. It helps travelers plan easy, enjoyable trips by suggesting
                  destinations, routes, and activities tailored specifically to Davao’s culture, landmarks,
                  and local experiences.
                </p>
              </motion.div>

              <motion.div
                className="flex gap-5 mt-5 md:flex-row flex-col w-full justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Link
                  href={"LoginAndRegister"}
                  className="text-center mt:0 md:mt-15 p-3 w-3/4 md:w-5/12 tracking-wider rounded-4xl cursor-pointer text-white bg-blue-600 font-bold hover:bg-blue-200 hover:text-slate-800"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="p-5 flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <img src="/NoPlanoraTextBG.png" className="w-3/4" alt="planoraLogo" />
            </motion.div>
          </div>
        </section>

        {/* Video Section */}
        <section className="min-h-screen w-full py-30 md:px-16 px-0 bg-white flex justify-center">
          <motion.div
            className="w-full p-1 bg-linear-to-r from-[#ddbc5c] via-[#6baf45] to-blue-700 rounded-4xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="grid grid-cols-2 h-full rounded-4xl bg-amber-50">
              <motion.div
                className="flex justify-center px-4 py-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <video
                  src="/WakeUpDavao.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="rounded-3xl"
                ></video>
              </motion.div>

              <motion.div
                className="flex flex-col justify-center text-center items-center px-25"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <h1 className="text-4xl font-extrabold mb-7">
                  Discover Davao Without the Guesswork
                </h1>
                <p>Find things to do for everything you're into</p>
                <Link href={"/LoginAndRegister"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 bg-black w-fit text-white p-2 px-3 shadow-2xl rounded-md cursor-pointer"
                  >
                    Search Here
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Cards Section */}
        <section className="w-full py-20 md:px-16 px-5 bg-white">
          <div className="mb-10">
            <h2 className="text-2xl font-bold">Top Experiences in Davao del Sur</h2>
            <p className="text-gray-500">Best spots and hotels we recommend</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCards.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer"
              >
                <div className="relative h-56 w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="p-4">
                  <span className="text-sm text-gray-500">{item.location}</span>
                  <h3 className="font-semibold text-lg mt-1 leading-snug">{item.title}</h3>

                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-green-600 font-bold">{item.rating}</span>
                    <span className="text-green-600">★★★★★</span>
                    <span className="text-gray-500">({item.reviews})</span>
                  </div>

                  <p className="mt-2 font-semibold">
                    from <span className="text-green-700">{item.price}</span> per adult
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* See More Button */}
          {!showAll && topExperiences.length > 4 && (
            <div className="flex justify-center mt-12">
              <motion.button
                onClick={() => setShowAll(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold tracking-wide hover:bg-blue-700 transition"
              >
                See more experiences
              </motion.button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-[#0d1a44] py-10 text-white w-full">
          <motion.div
            className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Brand */}
            <div>
              <h4 className="text-2xl font-bold text-[#efd1a1] mb-4 font-serif">Planora</h4>
              <p className="text-gray-400 leading-relaxed">
                Planora is a smart itinerary generator made for foreigners and first-time visitors exploring
                the Davao Region. We help you discover must-see places, plan routes, and enjoy stress-free travel.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-xl font-semibold mb-4 border-b border-[#1a3455] pb-2">Explore</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Popular Destinations</li>
                <li>Beaches & Islands</li>
                <li>Nature & Mountains</li>
                <li>City Tours</li>
              </ul>
            </div>

            {/* Planora */}
            <div>
              <h4 className="text-xl font-semibold mb-4 border-b border-[#1a3455] pb-2">Planora</h4>
              <ul className="space-y-3 text-gray-400">
                <li>About Planora</li>
                <li>How It Works</li>
                <li>Travel Tips</li>
                <li>Contact Us</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xl font-semibold mb-4 border-b border-[#1a3455] pb-2">Get Started</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-[#c59761]" />
                  Davao Region, Philippines
                </li>
                <li className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-[#c59761]" />
                  Available Anytime
                </li>
                <li className="mt-4">
                  <Link href={"LoginAndRegister"} className="rounded-full bg-[#efd1a1] px-6 py-3 font-semibold text-[#0d1a44] hover:bg-[#fcf191] transition shadow-lg">
                  Create My Itinerary
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 border-t border-[#1a3455] pt-10 text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>&copy; {new Date().getFullYear()} Planora. All rights reserved.</p>
          </motion.div>
        </footer>

      </main>
    </div>
  );
}
