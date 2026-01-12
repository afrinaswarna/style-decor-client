import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
// Add this line right after your imports
console.log(motion ? "Motion Ready" : "Motion Missing");
const slides = [
  {
    id: 1,
    title: "EVENTS",
    subtitle: "REIMAGINED.",
    description:
      "Premium on-site decoration services for weddings and corporate galas.",
    bg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070",
  },
  {
    id: 2,
    title: "WEDDINGS",
    subtitle: "PERFECTED.",
    description:
      "Creating magical moments with our bespoke floral and lighting arrangements.",
    bg: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069",
  },
  {
    id: 3,
    title: "SPACES",
    subtitle: "TRANSFORMED.",
    description:
      "Modern home and office transformations that inspire and excite.",
    bg: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <section className="relative h-[400px] bg-slate-800 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110"
              style={{ backgroundImage: `url(${slides[current].bg})` }}
            />
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="z-10 text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-tight">
                {slides[current].title}{" "}
                <span className="text-teal-400 font-normal">
                  {slides[current].subtitle}
                </span>
              </h1>
              <p className="text-slate-200 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                {slides[current].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10"
          >
            <Link
              to="/services"
              className="bg-teal-500 text-slate-900 px-5 lg:px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 hover:bg-white transition-all"
            >
              Book Decoration Service
            </Link>
          </motion.div>
        </div>

        {/* Slide Indicators (Dots) */}
        <div className="absolute bottom-10 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1 transition-all duration-500 rounded-full ${
                current === index ? "w-12 bg-teal-400" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -right-64 -bottom-64 w-[800px] h-[800px] border border-white/5 rounded-full z-0 pointer-events-none"
        />
      </section>
    </div>
  );
};

export default Banner;
