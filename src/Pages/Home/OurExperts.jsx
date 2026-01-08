import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";

const OurExperts = () => {
  const axiosSecure = useAxiosSecure();

  const { data: decorators = [] } = useQuery({
    queryKey: ["top-decorators"],
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators");
      return res.data.filter((d) => d.status === "approved").slice(0, 4);
    },
  });
  return (
    <div>
      <section className="py-24 bg-slate-50 px-6 md:px-20">
        <div className=" mb-16">
          <h2 className="text-4xl font-black text-primary tracking-tighter">The Experts</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Our highly-rated partners
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {decorators.map((deco) => (
            <div
              key={deco._id}
              className="bg-white p-8 rounded-4xl text-center border border-slate-100 shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center text-teal-600 font-black text-2xl uppercase">
                {deco.name.charAt(0)}
              </div>
              <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                {deco.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-bold italic">
                {deco.workStatus || "Professional Decorator"}
              </p>
              <div className="flex justify-center gap-1 mt-4 text-amber-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OurExperts;
