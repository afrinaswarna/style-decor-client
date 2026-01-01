import React from "react";
import { FaTasks, FaCalendarDay, FaMoneyBillWave } from "react-icons/fa";
import MyAssignedProjects from "./MyAssignedProjects";

const DecoratorDashboard = () => {
  return (
    <div className="space-y-8">
     
      <h2 className="text-3xl md:text-4xl text-center text-primary font-bold">
        Decorator Dashboard
      </h2>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
          <FaTasks className="text-3xl text-primary" />
          <div>
            <p className="text-gray-500 text-sm">Assigned Projects</p>
            <p className="text-2xl font-bold">—</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
          <FaCalendarDay className="text-3xl text-secondary" />
          <div>
            <p className="text-gray-500 text-sm">Today’s Schedule</p>
            <p className="text-2xl font-bold">—</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
          <FaMoneyBillWave className="text-3xl text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Earnings</p>
            <p className="text-2xl font-bold">৳ —</p>
          </div>
        </div>
      </div>

     
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          Today’s Schedule
        </h3>
        <p className="text-gray-500">
          Today’s assigned services will appear here.
        </p>
      </div>

      
      <div>
        <MyAssignedProjects />
      </div>
    </div>
  );
};

export default DecoratorDashboard;
