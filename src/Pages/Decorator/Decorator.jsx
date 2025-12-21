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
  // console.log(serviceAreas)

  const regionsDuplicate = serviceAreas.map((c) => c.region);
  const regions = [...new Set(regionsDuplicate)];
  const region = useWatch({ control, name: "region" });
  const districtByRegion = (region) => {
    const districtRegion = serviceAreas.filter((c) => c.region === region);
    const districts = districtRegion.map((d) => d.district);
    return districts;
  };

  const handleDecoratorApplication = (data) => {
    // console.log(data)
    axiosSecure.post("/decorators", data).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your application has been register. We will contact you soon",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <div>
      <h2 className="text-primary text-4xl font-bold text-center mt-10">
        Welcome to our Company
      </h2>
      <p className="text-xl text-primary font-semibold text-center">
        Are you interested to be a decorator?? Please fill up the form.
      </p>
      <form onSubmit={handleSubmit(handleDecoratorApplication)}>
        <fieldset className="fieldset">
          <h4 className="text-2xl font-semibold">Earn Money your way</h4>
          <label className="label text-black">Name</label>
          <input
            type="text"
            {...register("name")}
            defaultValue={user?.displayName}
            className="input w-full text-black"
            placeholder="Decorator Name"
          />
        </fieldset>
        <fieldset className="fieldset">
          <label className="label text-black">Email</label>
          <input
            type="text"
            {...register("email")}
            defaultValue={user?.email}
            className="input w-full text-black"
            placeholder="Decorator Email"
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Select Your Region</legend>
          <select
            {...register("region")}
            defaultValue="Pick a Region"
            className="select"
          >
            <option disabled={true}>Pick a Region</option>
            {regions.map((r, i) => (
              <option key={i}>{r}</option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Select Your District</legend>
          <select
            {...register("district")}
            defaultValue="Pick a District"
            className="select"
          >
            <option disabled={true}>Pick a District</option>
            {districtByRegion(region).map((r, i) => (
              <option key={i}>{r}</option>
            ))}
          </select>
        </fieldset>
        <h2 className="text-4xl font-bold">
          $50<span className="text-xl">per hour</span>
        </h2>
        <button type="submit" className="btn btn-primary">
          Get Started
        </button>
      </form>
    </div>
  );
};

export default Decorator;
