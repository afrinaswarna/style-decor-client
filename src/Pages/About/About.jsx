import React from "react";
import { FaPaintRoller, FaLightbulb, FaUsers, FaAward } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-slate-900 leading-none">
              WE DESIGN <br />
              <span className="text-teal-600 font-black">MEMORIES.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              At StyleDecor, we believe every space has a story to tell. Since
              our inception, we've been dedicated to transforming ordinary
              environments into extraordinary experiences through innovative
              design and meticulous craftsmanship.
            </p>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-50 -skew-x-12 translate-x-1/2 hidden lg:block"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Projects Completed", value: "1,200+" },
              { label: "Happy Clients", value: "950+" },
              { label: "Design Experts", value: "45" },
              { label: "Years Experience", value: "12" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-3xl font-black text-slate-900">
                  {stat.value}
                </h3>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">
            Our Core <span className="text-teal-600">Values</span>
          </h2>
          <div className="w-16 h-1 bg-teal-600 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard
            icon={<FaLightbulb />}
            title="Innovation"
            desc="We blend contemporary trends with timeless classics to create unique aesthetics."
          />
          <ValueCard
            icon={<FaPaintRoller />}
            title="Quality"
            desc="Using only premium materials to ensure your decor looks stunning and lasts longer."
          />
          <ValueCard
            icon={<FaUsers />}
            title="Client Focused"
            desc="Your vision is our blueprint. We listen, adapt, and deliver exactly what you imagine."
          />
          <ValueCard
            icon={<FaAward />}
            title="Excellence"
            desc="From the first sketch to the final reveal, we maintain the highest industry standards."
          />
        </div>
      </section>

      {/* Mission/Vision Section */}
      <section className="py-20 bg-slate-900 text-white rounded-[3rem] mx-4 mb-20 overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <h2 className="text-3xl font-black italic tracking-tighter mb-8">
            OUR MISSION
          </h2>
          <p className="text-xl md:text-2xl font-light text-slate-300 leading-relaxed italic">
            "To become the leading name in decoration by consistently providing
            creative, sustainable, and breath-taking design solutions that
            enrich the lives of our clients and the beauty of their
            communities."
          </p>
          <button className="mt-12 px-8 py-4 bg-teal-600 hover:bg-teal-500 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all">
            Start Your Project
          </button>
        </div>
        {/* Abstract background circle */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-white transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-teal-600/10 flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className="text-xl font-black text-slate-900 mb-3">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed italic">{desc}</p>
  </div>
);

export default About;
