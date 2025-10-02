import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockClosedIcon,
  TrashIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid";

const API_URL = "http://localhost:3001";

interface User {
  id: number;
  name: string;
  email: string;
  registration_time: string;
  last_login_time: string | null;
  status: "active" | "blocked" | "unverified";
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Helper function to handle authenticated fetch requests
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    // If token is invalid or user is blocked/deleted, redirect to login
    if (
      response.status === 401 ||
      response.status === 403 ||
      response.status === 404
    ) {
      localStorage.removeItem("token");
      navigate("/", {
        state: {
          message:
            "Your session has expired or your account has been blocked. Please log in again.",
        },
      });
      throw new Error("Authentication failed");
    }

    return response;
  };

  const fetchUsers = async () => {
    try {
      const response = await authenticatedFetch(`${API_URL}/api/users`);
      if (!response.ok) throw new Error("Failed to fetch");

      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      if ((error as Error).message !== "Authentication failed") {
        setMessage("Failed to load users");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(users.map((user) => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectSingle = (userId: number, isChecked: boolean) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (isChecked) newSelectedUsers.add(userId);
    else newSelectedUsers.delete(userId);
    setSelectedUsers(newSelectedUsers);
  };

  const handleUserAction = async (
    url: string,
    body: object,
    successMessage: string,
    errorMessage: string
  ) => {
    try {
      const response = await authenticatedFetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(errorMessage);

      setMessage(successMessage);
      fetchUsers(); // Refresh users list
      setSelectedUsers(new Set());
    } catch (error) {
      if ((error as Error).message !== "Authentication failed") {
        setMessage(errorMessage);
      }
    }
  };

  const handleBlock = () => {
    handleUserAction(
      `${API_URL}/api/users/update-status`,
      { userIds: Array.from(selectedUsers), status: "blocked" },
      "Users have been blocked.",
      "Error blocking users."
    );
  };

  const handleUnblock = () => {
    handleUserAction(
      `${API_URL}/api/users/update-status`,
      { userIds: Array.from(selectedUsers), status: "active" },
      "Users have been unblocked.",
      "Error unblocking users."
    );
  };

  const handleDelete = () => {
    handleUserAction(
      `${API_URL}/api/users/delete`,
      { userIds: Array.from(selectedUsers) },
      "Users have been deleted.",
      "Error deleting users."
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </header>

        {message && (
          <p className="bg-blue-100 text-blue-800 p-3 rounded-lg mb-4">
            {message}
          </p>
        )}

        <div className="flex items-center space-x-2 mb-4 p-4 bg-white rounded-xl shadow-sm">
          <button
            onClick={handleBlock}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
            title="Block selected users"
          >
            <LockClosedIcon className="h-5 w-5" /> Block
          </button>
          <button
            onClick={handleUnblock}
            className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Unblock selected users"
          >
            <LockOpenIcon className="h-6 w-6" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Delete selected users"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={handleSelectAll}
                    checked={
                      users.length > 0 && selectedUsers.size === users.length
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedUsers.has(user.id)}
                      onChange={(e) =>
                        handleSelectSingle(user.id, e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.registration_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login_time
                      ? new Date(user.last_login_time).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "blocked"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
