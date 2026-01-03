import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useRef, useState } from "react";
import {
  FaUserPlus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

const AssignDecorator = () => {
  const axiosSecure = useAxiosSecure();
  const modalRef = useRef(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 1. Fetch Pending Bookings
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

  // 2. Fetch Available Decorators based on selection
  const { data: decorators = [], isFetching } = useQuery({
    queryKey: [
      "available-decorators",
      selectedBooking?.serviceDate,
      selectedBooking?.location,
    ],
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

  // 3. Easy Date Selection via SweetAlert
  const openDateModal = async (booking) => {
    const { value: date } = await Swal.fire({
      title: '<span class="text-xl font-black">Set Service Date</span>',
      input: "date",
      inputLabel: `Scheduling: ${booking.serviceName}`,
      inputValue: booking.serviceDate || new Date().toISOString().split("T")[0],
      confirmButtonText: "Confirm Date",
      confirmButtonColor: "#0F766E",
      showCancelButton: true,
      customClass: {
        popup: "rounded-[2rem] p-6",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3",
      },
    });

    if (date) {
      updateServiceDate(booking._id, date);
    }
  };

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
          title: "Assignment Successful",
          text: `${decorator.name} is now in charge!`,
          confirmButtonColor: "#0F766E",
          timer: 2000,
        });
      }
    } catch (e) {
      Swal.fire("Error", "Assignment failed", "error",e);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black text-primary">
              Assign Decorators
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Connect available staff with pending event bookings.
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-primary text-xl font-bold">
              {bookings.length}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Pending
              </p>
              <p className="font-bold text-slate-700">Assignments</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="py-5 px-6 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Service Details
                </th>
                <th className="text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Location
                </th>
                <th className="text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Service Date
                </th>
                <th className="text-center text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-base">
                        {booking.serviceName}
                      </span>
                      <span className="text-[10px] font-bold text-primary uppercase mt-1 tracking-wider">
                        {booking.serviceCategory}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <FaMapMarkerAlt className="text-rose-500" />
                      <span>{booking.location}</span>
                    </div>
                  </td>
                  <td>
                    {booking.serviceDate ? (
                      <button
                        onClick={() => openDateModal(booking)}
                        className="flex flex-col items-start group hover:bg-white p-2 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                          <FaCalendarAlt className="text-primary" />
                          {new Date(booking.serviceDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <span className="text-[9px] text-slate-300 font-black uppercase ml-6 group-hover:text-primary transition-colors">
                          Change Date
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openDateModal(booking)}
                        className="btn btn-sm border-dashed border-2 bg-transparent text-slate-400 hover:border-primary hover:text-primary rounded-xl px-4"
                      >
                        <FaCalendarAlt /> Set Date
                      </button>
                    )}
                  </td>
                  <td className="text-center">
                    {booking.serviceDate ? (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          modalRef.current.showModal();
                        }}
                        className="btn bg-primary hover:bg-teal-800 text-white btn-md shadow-lg shadow-teal-900/10 border-none rounded-xl px-6"
                      >
                        <FaUserPlus /> Assign Staff
                      </button>
                    ) : (
                      <div
                        className="tooltip tooltip-left"
                        data-tip="Please set a date first"
                      >
                        <button className="btn btn-disabled btn-md rounded-xl opacity-40">
                          Assign Decorator
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

      {/* --- SCROLLABLE MODAL --- */}
      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box max-w-3xl p-0 flex flex-col max-h-[85vh] rounded-4xl border-none shadow-2xl">
          {/* Fixed Header */}
          <div className="bg-primary p-8 text-white shrink-0 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-black text-2xl flex items-center gap-3">
                <FaUserPlus className="text-teal-400" /> Available Decorators
              </h3>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                Matches for {selectedBooking?.serviceDate} in{" "}
                {selectedBooking?.location}
              </p>
            </div>
            <FaCalendarAlt className="absolute -right-4 -bottom-4 text-white/5 text-9xl rotate-12" />
          </div>

          {/* Scrollable Content */}
          <div className="p-8 overflow-y-auto grow bg-white">
            {isFetching ? (
              <div className="py-20 text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
                  Checking Availability...
                </p>
              </div>
            ) : decorators.length === 0 ? (
              <div className="py-12 px-6 text-center bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-rose-600 font-bold">
                  No decorators available for this specific date and location.
                </p>
                <p className="text-rose-400 text-xs mt-1">
                  Try changing the service date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decorators.map((decorator) => (
                  <div
                    key={decorator._id}
                    className="group border border-slate-100 bg-slate-50/50 rounded-2xl p-5 hover:border-primary hover:bg-white transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-black text-slate-800 group-hover:text-primary transition-colors">
                          {decorator.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {decorator.email}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-primary text-xs">
                        <FaCheckCircle />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4 mb-5">
                      {decorator.expertise?.slice(0, 3).map((ex) => (
                        <span
                          key={ex}
                          className="px-2 py-0.5 bg-white border border-slate-200 text-[9px] font-bold text-slate-500 rounded-md uppercase tracking-wider"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAssignDecorator(decorator)}
                      className="w-full py-2.5  text-white text-xs font-bold rounded-xl bg-primary transition-colors"
                    >
                      Confirm Assignment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="modal-action p-6 bg-slate-50 border-t border-slate-100 shrink-0">
            <form method="dialog" className="w-full">
              <button className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors">
                Cancel and Go Back
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignDecorator;
