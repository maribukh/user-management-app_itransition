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

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      setMessage("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

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
    const token = localStorage.getItem("token");
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      setMessage(successMessage);
      fetchUsers();
      setSelectedUsers(new Set());
    } catch (error) {
      setMessage(errorMessage);
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
          <h1 className="text-2xl font-bold">User Management</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Logout
          </button>
        </header>

        {message && (
          <p className="bg-blue-100 text-blue-800 p-3 rounded-md mb-4">
            {message}
          </p>
        )}

        <div className="flex items-center space-x-2 mb-4 p-4 bg-white rounded-lg shadow-sm">
          <button
            onClick={handleBlock}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
          >
            <LockClosedIcon className="h-5 w-5" /> Block
          </button>
          <button
            onClick={handleUnblock}
            className="p-2 text-gray-600 hover:text-green-600"
            title="Unblock"
          >
            <LockOpenIcon className="h-6 w-6" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600"
            title="Delete"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      users.length > 0 && selectedUsers.size === users.length
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registration Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={(e) =>
                        handleSelectSingle(user.id, e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.registration_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
