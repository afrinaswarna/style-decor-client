import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaRegTrashAlt, FaUserCheck } from "react-icons/fa";
import { IoPersonRemove } from "react-icons/io5";
import Swal from "sweetalert2";

const ApproveDecorator = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch, data: decorators = [] } = useQuery({
    queryKey: ["decorator", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/decorators");
      return res.data;
    },
  });

  const updatedApprovalStatus = (decorator, status) => {
    const updatedInfo = { status: status, email: decorator.email };
    axiosSecure
      .patch(`/decorators/${decorator._id}`, updatedInfo)
      .then((res) => {
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Decorator application has been ${status}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const handleApproval = (decorator) => {
    updatedApprovalStatus(decorator, "approved");
  };

  const handleRejected = (decorator) => {
    updatedApprovalStatus(decorator, "rejected");
  };
  const handleDeleted = (decorator) => {
    axiosSecure.delete(`/decorators/${decorator._id}`).then((res) => {
      if (res.data.deletedCount) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Decorator application has been deleted`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  return (
    <div>
      <h2 className="my-8 text-center text-secondary text-4xl font-bold mt-10">
        Decorator Application Approval:{decorators.length}
      </h2>
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Application Status</th>
            <th>Work Status</th>
            <th>District</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {decorators.map((decorator, index) => (
            <tr>
              <th>{index + 1}</th>
              <td>{decorator.name}</td>
              <td>{decorator.email}</td>
              <td>
                <p
                  className={`${
                    decorator.status === "approved"
                      ? "text-green-900"
                      : "text-red-800"
                  }`}
                >
                  {decorator.status}
                </p>
              </td>
              <td>{decorator.workStatus}</td>
              <td>{decorator.district}</td>
              <td>
                <button
                  onClick={() => handleApproval(decorator)}
                  className="btn"
                >
                  <FaUserCheck />
                </button>
                <button
                  onClick={() => handleRejected(decorator)}
                  className="btn"
                >
                  <IoPersonRemove />
                </button>
                <button
                  onClick={() => handleDeleted(decorator)}
                  className="btn"
                >
                  <FaRegTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApproveDecorator;
