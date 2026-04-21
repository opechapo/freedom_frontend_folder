import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../Utils/api";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ Form submitted! Password:", password);
    setLoading(true);

    try {
      console.log("🔄 Sending request to /admin/login...");
      const res = await API.post("/admin/login", { password });
      console.log("✅ Response received:", res.data);

      localStorage.setItem("adminToken", res.data.token);
      toast.success("Admin Login Successful!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.msg || "Invalid admin password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Admin Panel</h1>
          <p className="text-slate-400">Freedom Trade Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-cyan-500 outline-none text-lg"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-700 py-4 rounded-2xl text-xl font-semibold transition-all"
          >
            {loading ? "Verifying..." : "Login as Admin"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          Default Password: <span className="text-cyan-400">admin123</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
