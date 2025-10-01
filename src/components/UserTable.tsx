import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3001";

interface User {
  id: number;
  name: string;
  email: string;
  last_login_time: string | null;
  status: "active" | "blocked" | "unverified";
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allUserIds = new Set(users.map((user) => user.id));
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleUserSelect = (userId: number) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.add(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleAction = async (action: "block" | "unblock" | "delete") => {
    const userIds = Array.from(selectedUsers);
    if (userIds.length === 0) {
      setMessage("Please select at least one user.");
      return;
    }

    let url = "";
    let body: any = {};

    switch (action) {
      case "block":
        url = `${API_URL}/api/users/update-status`;
        body = { userIds, status: "blocked" };
        break;
      case "unblock":
        url = `${API_URL}/api/users/update-status`;
        body = { userIds, status: "active" };
        break;
      case "delete":
        url = `${API_URL}/api/users/delete`;
        body = { userIds };
        break;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${action} users`);
      }

      setMessage(`Users have been ${action}ed successfully.`);
      setSelectedUsers(new Set());
      fetchUsers();
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("An unknown error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <div className="mb-4">
        <button
          onClick={() => handleAction("block")}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Block
        </button>
        <button
          onClick={() => handleAction("unblock")}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Unblock
        </button>
        <button
          onClick={() => handleAction("delete")}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedUsers.size === users.length && users.length > 0
                }
              />
            </th>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Last Login</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => handleUserSelect(user.id)}
                />
              </td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {user.last_login_time
                  ? new Date(user.last_login_time).toLocaleString()
                  : "N/A"}
              </td>
              <td className="py-2 px-4 border-b">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
