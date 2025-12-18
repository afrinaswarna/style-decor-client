import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const axiosSecure = useAxiosSecure();
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axiosSecure.get("/services/home");
      return res.data;
    },
  });
  return (
    <div>
        <h2 className="text-4xl font-bold my-10">Popular Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {services.map((service) => (
          <div className="card bg-base-100 shadow-lg">
            <figure>
              <img
              className="w-full h-48 object-cover"
                src={service.image}
                alt="Shoes"
              />
            </figure>
            <div className="p-4">
              <p className="text-lg font-medium text-center">{service.service_name}</p>
             
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
