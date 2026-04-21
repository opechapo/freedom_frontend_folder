// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Utils/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [kycs, setKycs] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, kycRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/kyc"),
      ]);

      setUsers(usersRes.data);
      setKycs(kycRes.data);
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-700 py-4 px-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            Freedom Trade Admin
          </h1>
          <p className="text-slate-400 text-sm">System Administration</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-medium"
        >
          Logout Admin
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-slate-900 border-r border-slate-700 min-h-[calc(100vh-73px)] p-6">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-5 py-3 rounded-2xl transition-all ${activeTab === "users" ? "bg-cyan-600 text-white" : "hover:bg-slate-800"}`}
            >
              👥 All Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("kyc")}
              className={`w-full text-left px-5 py-3 rounded-2xl transition-all ${activeTab === "kyc" ? "bg-cyan-600 text-white" : "hover:bg-slate-800"}`}
            >
              🪪 KYC Submissions ({kycs.length})
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "users" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">All Users</h2>
              <div className="bg-slate-900 rounded-3xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="text-left p-5">Username</th>
                      <th className="text-left p-5">Email</th>
                      <th className="text-left p-5">Country</th>
                      <th className="text-left p-5">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-slate-700 hover:bg-slate-800"
                      >
                        <td className="p-5">{user.username}</td>
                        <td className="p-5">{user.email}</td>
                        <td className="p-5">{user.country || "N/A"}</td>
                        <td className="p-5 text-sm text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "kyc" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">KYC Submissions</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {kycs.map((kyc) => (
                  <div
                    key={kyc._id}
                    className="bg-slate-900 rounded-3xl p-6 border border-slate-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-lg">
                          {kyc.user?.username}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {kyc.user?.email}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm ${kyc.status === "under_review" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}
                      >
                        {kyc.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Front ID</p>
                        <img
                          src={`http://localhost:5000/${kyc.frontImage}`}
                          alt="Front"
                          className="rounded-2xl w-full h-52 object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Back ID</p>
                        <img
                          src={`http://localhost:5000/${kyc.backImage}`}
                          alt="Back"
                          className="rounded-2xl w-full h-52 object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
