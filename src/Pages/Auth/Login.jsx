import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import SocialLogin from "./SocialLogin";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate=useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLogin = (data) => {
   
    signInUser(data.email, data.password)
      .then(() => {
       
        navigate(location.state|| '/')
      })
      .catch(() => {
       
      });
  };
  return (
   <div className="flex">
      <div><img src="https://i.ibb.co.com/B2Bf3dq4/Homepage-Assembly.webp" alt="" /></div>
     <div className=' className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl my-20 p-2'>
        <h2 className="text-4xl font-bold  mt-4">Welcome Back</h2>
        <h4 className="text-sm">Login with ZapShift</h4>
      <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
        <fieldset className="fieldset ">
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input"
            placeholder="Email"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-500">Email is required</p>
          )}

          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
            })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500"> Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">Password must bd 6 characters</p>
          )}
          {errors.password?.type === "pattern" && (
            <p className="text-red-500">
              Password must have one uppercase,one lowercase and at least 6
              characters
            </p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn bg-primary mt-4">Login</button>
          <p>
            New to Zap Shift?{" "}
            <Link to="/register" state={location.state} className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>

          <SocialLogin></SocialLogin>
        </fieldset>
      </form>
    </div>
   </div>
  );
};

export default Login;
