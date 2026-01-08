import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
const ServiceDemandChart = ({ bookings = [] }) => {
  
  const processData = () => {
    const counts = bookings.reduce((acc, booking) => {
      const category = booking.serviceCategory || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

   
    return Object.keys(counts)
      .map((key) => ({
        name: key,
        count: counts[key],
      }))
      .sort((a, b) => b.count - a.count);
  };

  const data = processData();

  
  const COLORS = ["#0d9488", "#0f172a", "#6366f1", "#f59e0b", "#ec4899"];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm w-full h-[450px] animate-in fade-in zoom-in duration-700">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
          Service Demand
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
          Booking Volume by Category
        </p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: "800" }}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{
              borderRadius: "20px",
              border: "none",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              padding: "15px",
            }}
            itemStyle={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "10px",
            }}
          />
          <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={50}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceDemandChart;
