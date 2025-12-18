

// export default Services;
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";

const Services = () => {
  const axiosSecure = useAxiosSecure();

  // 🔍 Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  // 📡 Fetch services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axiosSecure.get("/services");
      return res.data;
    },
  });

  // 🧠 Get unique service types
  const serviceTypes = useMemo(() => {
    const types = services.map(service => service.service_category);
    return ["all", ...new Set(types)];
  }, [services]);

  // 🎯 Filtered services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchName = service.service_name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchType =
        selectedType === "all" ||
        service.service_category === selectedType;

      const matchMin =
        minBudget === "" || service.cost >= Number(minBudget);

      const matchMax =
        maxBudget === "" || service.cost <= Number(maxBudget);

      return matchName && matchType && matchMin && matchMax;
    });
  }, [services, searchText, selectedType, minBudget, maxBudget]);

  if (isLoading) {
    return <p className="text-center mt-10">Loading services...</p>;
  }

  return (
    <div className="p-4 space-y-6">

      {/* 🔎 Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-base-200 p-4 rounded-lg">

        {/* Search */}
        <input
          type="text"
          placeholder="Search service name..."
          className="input input-bordered w-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Service Type */}
        <select
          className="select select-bordered w-full"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {serviceTypes.map((type, index) => (
            <option key={index} value={type}>
              {type === "all" ? "All Services" : type}
            </option>
          ))}
        </select>

        {/* Min Budget */}
        <input
          type="number"
          placeholder="Min Budget"
          className="input input-bordered w-full"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
        />

        {/* Max Budget */}
        <input
          type="number"
          placeholder="Max Budget"
          className="input input-bordered w-full"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
        />
      </div>

      {/* 🧾 Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service._id} className="card bg-base-100 shadow-md">
              <figure>
                <img
                  className="w-full h-48 object-cover"
                  src={service.image}
                  alt={service.service_name}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{service.service_name}</h2>
                <p className="text-sm text-gray-500">
                  {service.service_category}
                </p>
                <p className="font-semibold">৳ {service.cost}</p>
                <div className="card-actions justify-end">
                  <Link to={`/service-detail/${service._id}`} className="btn btn-primary ">
                   Service Detail
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No services found 😕
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
