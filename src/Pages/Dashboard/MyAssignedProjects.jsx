import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const STATUS_STEPS = [
  { key: "planning", label: "Planning Phase" },
  { key: "materials-prepared", label: "Materials Prepared" },
  { key: "on-the-way", label: "On The Way" },
  { key: "setup-in-progress", label: "Setup In Progress" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);
console.log(STATUS_ORDER);

const canUpdateStatus = (current, next) => {
  const currentIndex = STATUS_ORDER.indexOf(current);
  console.log(currentIndex);
  const nextIndex = STATUS_ORDER.indexOf(next);
  return nextIndex === currentIndex + 1;
};

const MyAssignedProjects = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assignedTasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/decorator?decoratorEmail=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  /* ================= ACTIONS ================= */

  const acceptBooking = async (id) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/accept`);
      refetch();
      Swal.fire("Accepted", "You can now start the service", "success");
    } catch {
      Swal.fire("Error", "Unable to accept booking", "error");
    }
  };

  const rejectBooking = async (id) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/reject`);
      refetch();
      Swal.fire("Rejected", "Admin will reassign this service", "info");
    } catch {
      Swal.fire("Error", "Unable to reject booking", "error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/status`, {
        serviceStatus: status,
      });
      refetch();
      Swal.fire({
        icon: "success",
        title: `Status updated to ${status.replaceAll("-", " ")}`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "Unable to update status", "error");
    }
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
        Assigned Services
      </h2>

      {bookings.length === 0 && (
        <p className="text-center text-gray-500">No assigned services found</p>
      )}

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="border rounded-xl p-6 shadow-sm bg-white"
          >
            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{booking.serviceName}</h3>
                <p className="text-sm text-gray-500">
                  Tracking ID: {booking.trackingId}
                </p>
              </div>

              <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary capitalize">
                {booking.decoratorResponse}
              </span>
            </div>

            {/* ================= DETAILS ================= */}
            <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {booking.userEmail}
              </p>
              <p>
                <span className="font-medium">Service Date:</span>{" "}
                {booking.serviceDate || "N/A"}
              </p>
            </div>

            {/* ================= ACCEPT / REJECT ================= */}
            {booking.decoratorResponse === "pending" && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => acceptBooking(booking._id)}
                  className="px-6 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => rejectBooking(booking._id)}
                  className="px-6 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition"
                >
                  Reject
                </button>
              </div>
            )}

            {/* ================= STATUS STEPS ================= */}
            {booking.decoratorResponse === "accepted" && (
              <div className="mt-6">
                <p className="font-medium mb-3 text-primary">
                  Update Service Status
                </p>

                <div className="flex flex-wrap gap-3">
                  {STATUS_STEPS.map((step) => {
                    const isCurrent = booking.serviceStatus === step.key;
                    const canProceed = canUpdateStatus(
                      booking.serviceStatus,
                      step.key
                    );
                    const isCompleted = booking.serviceStatus === "completed";

                    return (
                      <button
                        key={step.key}
                        disabled={!canProceed || isCompleted}
                        onClick={() => updateStatus(booking._id, step.key)}
                        className={`px-4 py-2 rounded-lg text-sm transition
                          ${
                            isCurrent
                              ? "bg-primary text-white cursor-not-allowed"
                              : canProceed
                              ? "border border-primary text-primary hover:bg-primary hover:text-white"
                              : "border border-gray-300 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {step.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAssignedProjects;
