import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { FaArrowRight, FaFilter, FaSearch } from "react-icons/fa";


const Services = () => {
  const axiosSecure = useAxiosSecure();

  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axiosSecure.get("/services");
      return res.data;
    },
  });

  const serviceTypes = useMemo(() => {
    const types = services.map((service) => service.service_category);
    return ["all", ...new Set(types)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchName = service.service_name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchType =
        selectedType === "all" || service.service_category === selectedType;
      const matchMin = minBudget === "" || service.cost >= Number(minBudget);
      const matchMax = maxBudget === "" || service.cost <= Number(maxBudget);

      return matchName && matchType && matchMin && matchMax;
    });
  }, [services, searchText, selectedType, minBudget, maxBudget]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
            Our <span className="text-teal-600">Services</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            Discover bespoke decoration packages tailored for your lifestyle.
          </p>

          {/* Filter Bar */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-teal-900/10">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search styles..."
                className="w-full bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Category Select */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <select
                className="w-full bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none cursor-pointer"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {serviceTypes.map((type, index) => (
                  <option key={index} value={type} className="bg-slate-900">
                    {type === "all" ? "All Categories" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Budget */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ৳
              </span>
              <input
                type="number"
                placeholder="Min Budget"
                className="w-full bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
              />
            </div>

            {/* Max Budget */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ৳
              </span>
              <input
                type="number"
                placeholder="Max Budget"
                className="w-full bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={service._id}
                  className="group bg-white rounded-4xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={service.image}
                      alt={service.service_name}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                        {service.service_category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-black text-slate-800 leading-tight mb-2 italic">
                      {service.service_name}
                    </h2>
                    <p className="text-slate-400 text-xs font-medium mb-4 line-clamp-2 italic">
                      Premium decor solutions designed for contemporary spaces.
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                          Budget Starting
                        </span>
                        <span className="text-lg font-black text-teal-600">
                          ৳ {service.cost.toLocaleString()}
                        </span>
                      </div>

                      <Link
                        to={`/service-detail/${service._id}`}
                        className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-teal-600 transition-colors shadow-lg"
                      >
                        <FaArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="bg-white inline-block p-10 rounded-[3rem] shadow-sm border border-slate-100">
                  <span className="text-5xl">🎨</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-4">
                    No services match your filters
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Try adjusting your budget or category.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
