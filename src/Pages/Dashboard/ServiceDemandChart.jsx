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
  const data = React.useMemo(() => {
    const counts = bookings.reduce((acc, booking) => {
      const category = booking.serviceCategory || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [bookings]);

  const COLORS = ["#0d9488", "#0f172a", "#6366f1", "#f59e0b", "#ec4899"];

  return (
    <div className="bg-white p-5 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm w-full min-h-[320px] sm:min-h-[420px]">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Service Demand
        </h3>
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Booking Volume by Category
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 40 }}
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
            interval="preserveStartEnd"
            angle={-30}
            textAnchor="end"
            height={50}
            tick={{
              fill: "#64748b",
              fontSize: 9,
              fontWeight: 800,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#cbd5e1",
              fontSize: 10,
              fontWeight: 700,
            }}
          />

          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 15px 25px rgba(0,0,0,0.1)",
              padding: "12px",
            }}
            itemStyle={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "10px",
            }}
          />

          <Bar
            dataKey="count"
            radius={[10, 10, 0, 0]}
            barSize={data.length > 5 ? 28 : 40}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceDemandChart;
