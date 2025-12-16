
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import SocialLogin from "./SocialLogin";
// import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

   const { registerUser,updataUserProfile } = useAuth();
//   const axiosSecure = useAxiosSecure()
 const navigate = useNavigate()
    const location = useLocation()
  const handleRegistration = (data) => {
    console.log(data)
    const profileImage = data.photo[0]
    registerUser(data.email, data.password)
      .then(() => {
      
        const formData = new FormData()
        formData.append('image',profileImage)
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`

        axios.post(image_API_URL,formData)
        .then(res=>{
          
            const photoURL = res.data.data.url

            
            // const userInfo ={
            //   email: data.email,
            //   displayName:data.name,
            //     photoURL:photoURL

            // }
            // useAxiosSecure.post('/user',userInfo)
            // .then((res)=>{
            //   if(res.data.insertedId){
            
            //     
            // }

            const userProfile = {
                displayName:data.name,
                photoURL:photoURL
            }
            updataUserProfile(userProfile)
            .then(()=>{
             
               navigate(location.state||'/')

            })
            .catch(e=>{
                console.log(e)
            })
              }

            )
            
        // }).catch(e=>{
        //     console.log(e)
        // })
       
       
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className="flex">
      <div><img src="https://i.ibb.co.com/B2Bf3dq4/Homepage-Assembly.webp" alt="" /></div>
      <div className=' className="card w-full max-w-sm shrink-0 shadow-2xl my-20 p-2'>
        <h2 className="text-4xl font-bold  mt-4">Create an Account</h2>
       
        <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
          <fieldset className="fieldset">
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Name"
            />
            {errors.name?.type === "required" && (
              <p className="text-red-500">Name is required</p>
            )}
            <label className="label">Photo</label>
            <input
              type="file"
              {...register("photo", { required: true })}
              className="file-input"
              placeholder="Photo"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Email is required</p>
            )}
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
            <button className="btn bg-primary mt-4">Create Account</button>
            <p>
              Already have an account?
              <Link
                state={location.state}
                to="/login"
                className="text-violet-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </fieldset>
          <SocialLogin></SocialLogin>
        </form>
      </div>
    </div>
  );
};

export default Register;
