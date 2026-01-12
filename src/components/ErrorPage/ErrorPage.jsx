import React from "react";

const ErrorPage = () => {
  return (
    <div className="w-[300px] mx-auto mt-40 text-center">
      <h1 className="font-bold text-4xl">404</h1>
      <h2 className="font-bold">OPPS! This page not found</h2>
      <p className="text-gray-600">
        the page you are looking for is not available.Please try again
      </p>
    </div>
  );
};

export default ErrorPage;
