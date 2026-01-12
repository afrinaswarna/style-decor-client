import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaUserShield, FaUserSlash, FaSearch } from "react-icons/fa";

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  const [searchUser, setSearchUser] = useState("");

  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users", searchUser],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchUser=${searchUser}`);
      return res.data;
    },
  });

  const handleMakeAdmin = (user) => {
    const roleInfo = { role: "admin" };
    axiosSecure.patch(`/users/${user._id}/role`, roleInfo).then((res) => {
      console.log(res.data)
      if (res.data.modifiedCount) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.displayName} marked as admin`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleRemoveAdmin = (user) => {
    const roleInfo = { role: "user" };
    axiosSecure.patch(`/users/${user._id}/role`, roleInfo).then((res) => {
      if (res.data.modifiedCount) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.displayName} removed from admin`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl text-secondary font-extrabold tracking-tight">
          Manage Users
        </h2>
        <div className="badge badge-outline badge-secondary p-4 font-semibold">
          Total Users: {users.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            onChange={(e) => setSearchUser(e.target.value)}
            type="search"
            className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-secondary focus:border-transparent rounded-full shadow-sm"
            placeholder="Search name or email..."
          />
        </div>
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="card bg-base-100 shadow-md border border-base-200"
          >
            <div className="card-body p-4 flex-row items-center gap-4">
              <div className="avatar">
                <div className="mask mask-squircle w-16 h-16">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/150"}
                    alt={user.displayName}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold truncate">{user.displayName}</h3>
                <p className="text-xs opacity-60 truncate">{user.email}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`badge badge-sm ${
                      user.role === "admin" ? "badge-secondary" : "badge-ghost"
                    }`}
                  >
                    {user.role}
                  </span>
                  <div className="flex gap-2">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleRemoveAdmin(user)}
                        className="btn btn-error btn-xs text-white"
                      >
                        <FaUserSlash /> Demote
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="btn btn-primary btn-xs"
                      >
                        <FaUserShield /> Promote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-base-200 shadow-sm bg-base-100">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="rounded-none">#</th>
                <th>User Info</th>
                <th>Role</th>
                <th className="text-center">Set Admin</th>
                <th className="rounded-none">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-base-200/50 transition-colors"
                >
                  <th className="font-medium">{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={
                              user.photoURL || "https://via.placeholder.com/150"
                            }
                            alt="User"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.displayName}</div>
                        <div className="text-sm opacity-50">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin"
                          ? "badge-secondary"
                          : "badge-ghost"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="text-center">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleRemoveAdmin(user)}
                        className="btn btn-error btn-sm text-white"
                        title="Remove Admin"
                      >
                        <FaUserSlash />
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleMakeAdmin(user)}
                        title="Make Admin"
                      >
                        <FaUserShield />
                      </button>
                    )}
                  </td>
                  <th>
                    <button className="btn btn-ghost btn-sm">details</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
