import React from 'react';

import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { CiEdit } from 'react-icons/ci';
import { FaRegTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MyBookings = () => {
    const { user} = useAuth();
    // console.log(user)
  const axiosSecure = useAxiosSecure();
//   if(loading){
//     return <LoadingSpinner></LoadingSpinner>
//   }
  const {data:bookings=[],dataLoading,refetch} = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
     
      return res.data;
    },
  });
//   console.log(bookings)
  if(dataLoading){
    return <LoadingSpinner></LoadingSpinner>
  }
const handleDelete = (id) => {
    // console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/bookings/${id}`).then((res) => {
          console.log(res.data);
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your booking request has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handlePayment = async (booking) => {
    // console.log(booking)
    const paymentInfo = {
      price: booking.price,
      bookingId: booking._id,
      serviceName: booking.serviceName,
      userEmail: booking.userEmail,
    }
     const res = await axiosSecure.post("/servicePayment-checkout-session", paymentInfo)
    //  console.log(res.data)
     
    
    window.location.assign(res.data.url);
}

    return (
        <div>
            <h2 className='text-4xl font-bold text-center text-primary my-10'>My bookings:{bookings.length}</h2>
             <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Payment</th>
              <th>TrackingId</th>
               <th>Service Status</th>
              {/* <th>TrackingId</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{booking.serviceName}</td>
                <td>{booking.price}</td>
                <td>
                  {booking.paymentStatus === "paid" ? (
                    <span className="text-primary">Paid</span>
                  ) : (
                    <button
                      onClick={() => handlePayment(booking)}
                      className="btn btn-sm text-small bg-primary text-white"
                    >
                     Please Pay
                    </button>
                  )}
                </td>
                
                <td>{booking.trackingId}</td>
                <td>{booking.status}</td>
                {/* <td>
                  <Link to={`/parcel-track/${parcel.trackingId}`}>
                  {parcel.trackingId}
                  </Link>
                </td> */}
                <td>
                  
                  
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="btn btn-square hover:bg-primary"
                  >
                    <FaRegTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
    );
};

export default MyBookings;
