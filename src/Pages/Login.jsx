import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import API from "../Utils/api";
import { toast } from "react-toastify";

// Import Login Illustration
import loginIllustration from "../assets/images/landingpage/loginillustration.png";

const schema = z.object({
  login: z.string().min(3, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (isAdmin) {
        const res = await API.post("/admin/login", { password: data.password });
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Admin Login Successful!");
        navigate("/admin/dashboard", { replace: true });
      } else {
        const res = await API.post("/auth/login", {
          login: data.login,
          password: data.password,
        });

        authLogin(res.data.user, res.data.token);
        toast.success("Login successful!");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
        {/* Left Side Illustration */}
        <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-10">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="max-w-full h-auto drop-shadow-2xl"
          />
        </div>

        {/* Right Side Form */}
        <div className="p-8 md:p-12 lg:p-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            {isAdmin ? "Admin Login" : "Welcome Back"}
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setIsAdmin(false)}
              className={`px-6 py-2 rounded-full font-medium transition ${!isAdmin ? "bg-green-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              User Login
            </button>
            {/* <button
              onClick={() => setIsAdmin(true)}
              className={`px-6 py-2 rounded-full font-medium transition ${isAdmin ? "bg-red-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              Admin Login
            </button> */}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email or Username
                </label>
                <input
                  {...register("login")}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-slate-700 dark:border-slate-600"
                  placeholder="you@example.com"
                />
                {errors.login && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.login.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {isAdmin ? "Admin Password" : "Password"}
              </label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-slate-700 dark:border-slate-600"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-lg transition text-lg"
            >
              {loading
                ? "Logging in..."
                : isAdmin
                  ? "Login as Admin"
                  : "Log In"}
            </button>
          </form>

          {!isAdmin && (
            <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
              New here?{" "}
              <Link
                to="/register"
                className="text-green-500 font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
