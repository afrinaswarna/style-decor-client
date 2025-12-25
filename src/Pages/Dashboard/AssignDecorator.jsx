// import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useRef, useState } from "react";

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
    queryKey: [
      "decorators",
      selectedBooking?.district,
      selectedBooking?.expertise,
    ],
    enabled: !!selectedBooking,
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators", {
        params: {
          status: "approved",
          workStatus: "available",
          district: selectedBooking.district,
          expertise: selectedBooking.expertise,
        },
      });
      return res.data;
    },
  });

  const openModal = (booking) => {
    setSelectedBooking(booking);
    modalRef.current?.showModal();
  };

  const handleAssignDecorator = async (decorator) => {
    try {
      const decoratorAssignInfo = {
        decoratorId: decorator._id,
        decoratorName: decorator.name,
        decoratorEmail: decorator.email,
      };

      const res = await axiosSecure.patch(
        `/bookings/${selectedBooking._id}`,
        decoratorAssignInfo
      );

      console.log("Server Response:", res.data);

      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        modalRef.current.close();
        refetchBookings();
        Swal.fire({ icon: "success", title: "Assigned!", timer: 1500 });
      } else {
        
        Swal.fire({
          icon: "info",
          title: "No changes made",
          text: "Decorator might already be assigned.",
        });
      }
    } catch (error) {
      console.error("Assignment Error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: error.response?.data?.message || "Check console for details",
      });
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading bookings...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-6">
        Assign Decorators ({bookings.length})
      </h2>

      {/* ---------------- Bookings Table ---------------- */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th></th>
              <th>Service</th>
              <th>Price</th>
              <th>Location</th>
              <th>TrackingId</th>
              
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{booking.serviceName}</td>
                <td>${booking.price}</td>
                <td>{booking.location}</td>
                <th>{booking.trackingId}</th>
                <td>
                  <button
                    onClick={() => openModal(booking)}
                    className="btn btn-sm bg-primary text-black"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-center mt-4 text-gray-500">
            No pending bookings found
          </p>
        )}
      </div>

      {/* ---------------- Assign Decorator Modal ---------------- */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">
            Available Decorators ({decorators.length})
          </h3>

          {isFetching ? (
            <p>Loading decorators...</p>
          ) : decorators.length === 0 ? (
            <p className="text-center text-red-500">
              No matching decorators available
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Expertise</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {decorators.map((decorator, i) => (
                    <tr key={decorator._id}>
                      <td>{i + 1}</td>
                      <td>{decorator.name}</td>
                      <td>{decorator.email}</td>
                      <td>{decorator.expertise?.join(", ")}</td>
                      <td>
                        <button
                          onClick={() => handleAssignDecorator(decorator)}
                          className="btn btn-sm bg-primary text-black"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignDecorator;
