import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  baseURL: "https://style-decor-server-dun.vercel.app",
});
const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
