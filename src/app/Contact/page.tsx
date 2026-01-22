"use client";

import { motion } from "motion/react";
import { Mail, Phone, Send, Instagram, Facebook, Twitter } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 mb-4"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto"
        >
          We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, our team is ready to assist.
        </motion.p>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 mx-auto">
            <Mail size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-800">Email Us</h3>
          <p className="text-slate-600 mb-4">support@planora.com</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 mx-auto">
            <Phone size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-800">Call Us</h3>
          <p className="text-slate-600 mb-4">+63 912 345 6789</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 mx-auto">
            <Send size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-800">Quick Message</h3>
          <p className="text-slate-600 mb-4">Reach out directly via our contact form below</p>
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-12 shadow-2xl border border-slate-100"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-slate-800"
                required
            />
            <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-none h-32 text-slate-800"
                required
            />

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-4 rounded-full shadow-lg hover:shadow-2xl transition"
            >
                <Send size={20} /> Send Message
            </motion.button>

            {submitted && (
                <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 font-semibold text-center mt-4"
                >
                Your message has been sent!
                </motion.p>
            )}
            </form>

        </motion.div>
      </section>

      {/* Social Section */}
      <section className="py-16 px-4 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <h3 className="text-3xl font-bold text-slate-800 mb-6">Follow Us</h3>
          <div className="flex justify-center gap-8 text-slate-700 text-3xl">
            <a href="#" className="hover:text-blue-500 transition"><Instagram /></a>
            <a href="#" className="hover:text-blue-600 transition"><Facebook /></a>
            <a href="#" className="hover:text-blue-400 transition"><Twitter /></a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
