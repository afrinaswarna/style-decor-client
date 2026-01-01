import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useRef, useState } from "react";
import { FaUserPlus, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const AssignDecorator = () => {
  const axiosSecure = useAxiosSecure();
  const modalRef = useRef(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const {
    data: bookings = [],
    refetch: refetchBookings,
    isLoading,
  } = useQuery({
    queryKey: ["bookings", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings?serviceStatus=pending");
      return res.data;
    },
  });

  const { data: decorators = [], isFetching } = useQuery({
    queryKey: ["available-decorators", selectedBooking?.serviceDate],
    enabled: !!selectedBooking?.serviceDate,
    queryFn: async () => {
      const res = await axiosSecure.get("/available-decorators", {
        params: {
          date: selectedBooking.serviceDate,
          district: selectedBooking.location,
        },
      });
      return res.data;
    },
  });

  const updateServiceDate = async (id, date) => {
    try {
      await axiosSecure.patch(`/bookings/${id}/service-date`, {
        serviceDate: date,
      });
      refetchBookings();
      Swal.fire({
        icon: "success",
        title: "Date Updated",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch {
      Swal.fire("Error", "Failed to set date", "error");
    }
  };

  const handleAssignDecorator = async (decorator) => {
    try {
      const res = await axiosSecure.patch(`/bookings/${selectedBooking._id}`, {
        decoratorId: decorator._id,
        decoratorName: decorator.name,
        decoratorEmail: decorator.email,
      });

      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        modalRef.current.close();
        refetchBookings();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${decorator.name} has been assigned!`,
          timer: 2000,
        });
      }
    } catch (e) {
      Swal.fire("Error", "Assignment failed", e);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-black text-secondary">
              Assign Decorators
            </h2>
            <p className="text-gray-500">
              Manage and allocate staff to pending bookings
            </p>
          </div>
          <div className="stats shadow bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title text-primary-content opacity-70">
                Pending Tasks
              </div>
              <div className="stat-value">{bookings.length}</div>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-base-200">
          <table className="table table-lg w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Service Details</th>
                <th>Location</th>
                <th>Service Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-base-50 transition-colors"
                >
                  <td>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">
                        {booking.serviceName}
                      </span>
                      <span className="badge badge-ghost badge-sm">
                        {booking.serviceCategory}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        ID: {booking.trackingId}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-error" />
                      <span>{booking.location}</span>
                    </div>
                  </td>
                  <td>
                    <input
                      type="date"
                      value={booking.serviceDate || ""}
                      onChange={(e) =>
                        updateServiceDate(booking._id, e.target.value)
                      }
                      className="input input-bordered input-md focus:input-primary"
                    />
                  </td>
                  <td className="text-center">
                    {booking.serviceDate ? (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          modalRef.current.showModal();
                        }}
                        className="btn btn-primary btn-md shadow-md hover:scale-105 transition-transform"
                      >
                        <FaUserPlus /> Assign Staff
                      </button>
                    ) : (
                      <div
                        className="tooltip tooltip-left"
                        data-tip="Select a date first"
                      >
                        <button className="btn btn-disabled btn-md">
                          Assign Staff
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REDESIGN */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-4xl p-0 overflow-hidden">
          <div className="bg-secondary p-6 text-white">
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <FaCalendarAlt /> Available Decorators
            </h3>
            <p className="opacity-80">
              Showing results for {selectedBooking?.serviceDate} in{" "}
              {selectedBooking?.location}
            </p>
          </div>

          <div className="p-6">
            {isFetching ? (
              <div className="py-10 text-center">
                <span className="loading loading-spinner text-secondary"></span>
              </div>
            ) : decorators.length === 0 ? (
              <div className="alert alert-error">
                No staff available for this date/location.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decorators.map((decorator) => (
                  <div
                    key={decorator._id}
                    className="card side bg-base-100 border hover:shadow-md transition-shadow"
                  >
                    <div className="card-body p-4 flex-row items-center justify-between">
                      <div>
                        <h4 className="font-bold">{decorator.name}</h4>
                        <p className="text-sm opacity-60">{decorator.email}</p>
                        <div className="flex gap-1 mt-2">
                          {decorator.expertise?.slice(0, 2).map((ex) => (
                            <span
                              key={ex}
                              className="badge badge-outline badge-xs"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignDecorator(decorator)}
                        className="btn btn-secondary btn-sm"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-ghost">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignDecorator;
