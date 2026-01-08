import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
const Packages = () => {
     const axiosSecure = useAxiosSecure();
 
const { data: services = [] } = useQuery({
    queryKey: ["home-services"],
    queryFn: async () => {
      const res = await axiosSecure.get("/services");
      return res.data.slice(0, 6);
    },
  });
  return (
    <div>
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-primary tracking-tighter">
            Luxury Packages
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
            Created for excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, idx) => 
         
            <motion.div
            key={service._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group">
              
            
               <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-xl">
                <img
                  src={service.image || "https://via.placeholder.com/400x400"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={service.service_name}
                />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-slate-900">
                  ৳{service.cost}
                </div>
              </div>
              <div className="mt-6 px-4">
                <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest">
                  {service.serviceCategory}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {service.service_name}
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  {service.description}
                </p>
              </div> 
          
</motion.div>
            
            
          )}
        </div>
      </section>
    </div>
  );
};

export default Packages;
