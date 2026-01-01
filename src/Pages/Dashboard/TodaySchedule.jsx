
import useAxiosSecure from "../../hooks/useAxiosSecure";

import useAuth from "../../hooks/useAuth";

import { useQuery } from "@tanstack/react-query";

import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const TodaySchedule = () => {
  const axiosSecure = useAxiosSecure();

  const { user } = useAuth();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["todaysSchedule", user?.email],

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/decorator?decoratorEmail=${user.email}`
      );

      return res.data;
    },

    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  const today = new Date().toISOString().split("T")[0];

  const todaysSchedule = bookings.filter(
    (b) => b.serviceDate === today && b.serviceStatus !== "completed"
  );

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-primary">
        Today’s Schedule
      </h3>

      {todaysSchedule.length === 0 ? (
        <p className="text-gray-500">No services scheduled for today 🎉</p>
      ) : (
        <ul className="space-y-3">
          {todaysSchedule.map((job) => (
            <li
              key={job._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{job.serviceName}</p>

                <p className="text-sm text-gray-500">
                  Customer: {job.userEmail}
                </p>
              </div>

              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
                {job.serviceStatus.replaceAll("-", " ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodaySchedule;
// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";
// import LoadingSpinner from "../../components/Loading/LoadingSpinner";

// const TodaySchedule = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();

//   // get today's date (YYYY-MM-DD)
//   const today = new Date().toISOString().split("T")[0];

//   const { data: schedules = [], isLoading } = useQuery({
//     queryKey: ["todaySchedule", user?.email, today],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/bookings/decorator/today`, {
//         params: {
//           decoratorEmail: user.email,
//           date: today,
//         },
//       });
//       return res.data;
//     },
//   });

//   if (isLoading) return <LoadingSpinner />;

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h2 className="text-3xl font-bold text-center text-primary mb-8">
//         Today’s Schedule
//       </h2>

//       {schedules.length === 0 && (
//         <p className="text-center text-gray-500">
//           No services scheduled for today
//         </p>
//       )}

//       <div className="grid md:grid-cols-2 gap-6">
//         {schedules.map((booking) => (
//           <div
//             key={booking._id}
//             className="border rounded-xl p-6 bg-white shadow"
//           >
//             {/* HEADER */}
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="text-xl font-semibold">{booking.serviceName}</h3>
//                 <p className="text-sm text-gray-500">
//                   Tracking ID: {booking.trackingId}
//                 </p>
//               </div>

//               <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
//                 {booking.serviceStatus.replaceAll("-", " ")}
//               </span>
//             </div>

//             {/* DETAILS */}
//             <div className="mt-4 space-y-2 text-sm">
//               <p>
//                 <span className="font-medium">Client:</span> {booking.userEmail}
//               </p>
//               <p>
//                 <span className="font-medium">Location:</span>{" "}
//                 {booking.location}
//               </p>
//               <p>
//                 <span className="font-medium">Service Date:</span>{" "}
//                 {booking.serviceDate}
//               </p>
//               <p>
//                 <span className="font-medium">Payment:</span>{" "}
//                 <span className="text-green-600 font-semibold">
//                   {booking.paymentStatus}
//                 </span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TodaySchedule;
