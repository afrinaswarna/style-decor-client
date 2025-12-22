// import React from "react";
// import { useLoaderData } from "react-router";
// import useAuth from "../../hooks/useAuth";
// import { useForm, useWatch } from "react-hook-form";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// const Decorator = () => {
//   const serviceAreas = useLoaderData();
//   const { user } = useAuth();
//   const { register, handleSubmit, control } = useForm();

//   const axiosSecure = useAxiosSecure();
//   console.log(serviceAreas);

//   const regionsDuplicate = serviceAreas.map((c) => c.region);
//   console.log(regionsDuplicate);
//   const regions = [...new Set(regionsDuplicate)];
//   console.log(regions);
//   const region = useWatch({ control, name: "region" });
//   const districtByRegion = (region) => {
//     if (!region) return [];
//     return serviceAreas
//       .filter((c) => c.region === region)
//       .map((d) => d.district);
//   };
//   const serviceCategories = [
//     "Wedding Decoration",
//     "Birthday Decoration",
//     "Stage Decoration",
//     "Corporate Event Decoration",
//     "Home Decoration",
//   ];

//   const handleDecoratorApplication = (data) => {
//     // console.log(data)
//     axiosSecure.post("/decorators", data).then((res) => {
//       if (res.data.insertedId) {
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Your application has been register. We will contact you soon",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     });
//   };

//   return (
//     <div>
//       <h2 className="text-primary text-4xl font-bold text-center mt-10">
//         Welcome to our Company
//       </h2>
//       <p className="text-xl text-primary font-semibold text-center">
//         Are you interested to be a decorator?? Please fill up the form.
//       </p>
//       <form onSubmit={handleSubmit(handleDecoratorApplication)}>
//         <fieldset className="fieldset">
//           <h4 className="text-2xl font-semibold">Earn Money your way</h4>
//           <label className="label text-black">Name</label>
//           <input
//             type="text"
//             {...register("name")}
//             defaultValue={user?.displayName}
//             className="input w-full text-black"
//             placeholder="Decorator Name"
//           />
//         </fieldset>
//         <fieldset className="fieldset">
//           <label className="label text-black">Email</label>
//           <input
//             type="text"
//             {...register("email")}
//             defaultValue={user?.email}
//             className="input w-full text-black"
//             placeholder="Decorator Email"
//           />
//         </fieldset>
//         <fieldset className="fieldset">
//           <label className="label text-black">Age</label>
//           <input
//             type="number"
//             {...register("age")}
//             className="input w-full text-black"
//             placeholder="Decorator Age"
//           />
//         </fieldset>
//         <fieldset className="fieldset">
//           <legend className="fieldset-legend">Select Your Expertise</legend>

//           <select {...register("expertise")} multiple className="select h-40">
//             <option value="" disabled>
//               Select a Service Category
//             </option>

//             {serviceCategories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </fieldset>

//         <fieldset className="fieldset">
//           <legend className="fieldset-legend">Select Your Region</legend>
//           <select
//             {...register("region")}
//             defaultValue="Pick a Region"
//             className="select"
//           >
//             <option disabled={true}>Pick a Region</option>
//             {regions.map((r, i) => (
//               <option key={i}>{r}</option>
//             ))}
//           </select>
//         </fieldset>
//         <fieldset className="fieldset">
//           <legend className="fieldset-legend">Select Your District</legend>
//           <select
//             {...register("district")}
//             defaultValue="Pick a District"
//             className="select"
//           >
//             <option disabled={true}>Pick a District</option>
//             {districtByRegion(region).map((r, i) => (
//               <option key={i}>{r}</option>
//             ))}
//           </select>
//         </fieldset>
//         <h2 className="text-4xl font-bold">
//           $50<span className="text-xl">per hour</span>
//         </h2>
//         <button type="submit" className="btn btn-primary">
//           Get Started
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Decorator;
import React from "react";
import { useLoaderData } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useForm, useWatch } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Decorator = () => {
  const serviceAreas = useLoaderData();
  const { user } = useAuth();
  const { register, handleSubmit, control } = useForm();
  const axiosSecure = useAxiosSecure();

  // Unique regions
  const regions = [...new Set(serviceAreas.map((c) => c.region))];

  // Watch selected region
  const region = useWatch({ control, name: "region" });

  // Filter districts by region
  const districtByRegion = (region) => {
    if (!region) return [];
    return serviceAreas
      .filter((c) => c.region === region)
      .map((d) => d.district);
  };

  const serviceCategories = [
    "Wedding Decoration",
    "Birthday Decoration",
    "Stage Decoration",
    "Corporate Event Decoration",
    "Home Decoration",
  ];

  const handleDecoratorApplication = (data) => {
    axiosSecure.post("/decorators", data).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "We will contact you soon.",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <h2 className="text-4xl font-bold text-center text-primary">
          Become a Decorator
        </h2>
        <p className="text-center mt-2 text-gray-600">
          Earn money your way by joining our professional decorator team
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleDecoratorApplication)}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div>
            <label className="label font-semibold text-gray-700">Name</label>
            <input
              type="text"
              {...register("name")}
              defaultValue={user?.displayName}
              className="input input-bordered w-full"
                disabled
            />
          </div>

          {/* Email */}
          <div>
            <label className="label font-semibold text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              defaultValue={user?.email}
              disabled
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Age */}
          <div>
            <label className="label font-semibold text-gray-700">Age</label>
            <input
              type="number"
              {...register("age", { required: true })}
              className="input input-bordered w-full"
              placeholder="Your age"
            />
          </div>

          {/* Expertise */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend font-semibold text-gray-700">
              Select Your Expertise
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {serviceCategories.map((category, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={category}
                    {...register("expertise", { required: true })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Region */}
          <div>
            <label className="label font-semibold text-gray-700">Region</label>
            <select
              {...register("region", { required: true })}
              className="select select-bordered w-full"
              defaultValue=""
            >
              <option value="" disabled>
                Select a Region
              </option>
              {regions.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="label font-semibold text-gray-700">
              District
            </label>
            <select
              {...register("district", { required: true })}
              className="select select-bordered w-full"
              defaultValue=""
            >
              <option value="" disabled>
                Select a District
              </option>
              {districtByRegion(region).map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Submit */}
          <div className="md:col-span-2 flex flex-col items-center gap-4 mt-4">
            <h2 className="text-3xl font-bold text-primary">
              $50 <span className="text-lg font-medium">/ hour</span>
            </h2>
            <button type="submit" className="btn btn-primary w-full md:w-1/2">
              Apply Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Decorator;
