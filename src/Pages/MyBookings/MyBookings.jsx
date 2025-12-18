import React from 'react';

import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const MyBookings = () => {
    const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {data:bookings=[]} = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
    //   console.log(res)
      return res.data;
    },
  });
    return (
        <div>
            <h2>My bookings:{bookings.length}</h2>
        </div>
    );
};

export default MyBookings;
