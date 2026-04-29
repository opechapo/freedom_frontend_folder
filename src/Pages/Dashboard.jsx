import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import TradingViewWidget from "../Components/TradingViewWidget";

import underReviewImg from "../assets/Images/under-review.png";
import DepositModal from "../Components/DepositModal";

// ==================== FOOTER ====================
import Footer from "../Components/Footer";

// ==================== CHART.JS ====================
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

// ==================== ICONS ====================
import {
  MdAccountBalance,
  MdSignalCellularAlt,
  MdTrendingUp,
  MdSavings,
  MdStar,
  MdCardGiftcard,
  MdRocketLaunch,
  MdSecurity,
  MdVerifiedUser,
  MdReceipt,
  MdSupportAgent,
  MdLogout,
  MdAttachMoney,
} from "react-icons/md";

import { FaUserCircle, FaBitcoin, FaEthereum } from "react-icons/fa";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("USDT");

  // Withdrawal Modal
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  // Eye toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // KYC states
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  // User Data
  const [accountBalance, setAccountBalance] = useState(5004);
  const [totalDeposited, setTotalDeposited] = useState(5004);
  const [totalWithdrawn, setTotalWithdrawn] = useState(120);
  const [signalStrength, setSignalStrength] = useState(30);
  const [earnedProfits, setEarnedProfits] = useState(1250.75);
  const [currentPlan, setCurrentPlan] = useState("Premium");
  const [tradingBonus, setTradingBonus] = useState(450);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchUserData = async (showToast = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setAccountBalance(data.accountBalance || 5004);
        setTotalDeposited(data.totalDeposited || 5004);
        setEarnedProfits(data.earnedProfits || 1250.75);
        setSignalStrength(data.signalStrength || 30);
        setCurrentPlan(data.currentPlan || "Premium");
        setTradingBonus(data.tradingBonus || 450);
        if (showToast) toast.success("Dashboard updated successfully!");
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => fetchUserData(), 4000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword)
      return toast.error("Passwords do not match");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoadingBtn(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(data.msg || "Failed to change password");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleKycSubmit = (e) => {
    e.preventDefault();
    if (!frontFile || !backFile)
      return toast.error("Please upload both images");

    setUploading(true);
    setTimeout(() => {
      setKycSubmitted(true);
      setUploading(false);
      toast.success("KYC submitted for review");
      setShowWithdrawalModal(true);
    }, 1500);
  };

  // ==================== CHARTS DATA ====================
  const totalBalanceData = {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"],
    datasets: [
      {
        label: "This Year",
        data: [3200, 4800, 6500, 5200, 7100, 8900],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3.5,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Last Year",
        data: [2800, 3900, 5200, 4600, 5800, 6700],
        borderColor: "#64748b",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.4,
        fill: false,
        borderDash: [5, 3],
      },
    ],
  };

  const totalBalanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: { color: "#94a3b8", boxWidth: 8 },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#94a3b8", callback: (v) => "$" + v / 1000 + "K" },
      },
    },
  };

  const waveData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Profits",
        data: [420, 680, 920, 1150, 1380, 1250],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        tension: 0.45,
        fill: true,
      },
    ],
  };

  const depositVsWithdrawData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Deposited",
        data: [200, 450, 300, 600, 400, 540],
        backgroundColor: "#64748b",
      },
      {
        label: "Withdrawn",
        data: [50, 120, 80, 200, 150, 120],
        backgroundColor: "#ef4444",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  const darkGlass =
    "bg-slate-900/95 backdrop-blur-2xl border border-slate-700 shadow-2xl rounded-3xl";

  // ==================== RENDER PROFILE PAGE ====================
  const renderProfilePage = () => {
    if (!user)
      return <div className="text-center py-20 text-slate-400">Loading...</div>;

    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Welcome back, {user.username}!
          </h2>
          <button
            onClick={() => setShowDepositModal(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 shadow-lg shadow-purple-500/30 w-full sm:w-auto"
          >
            <MdAttachMoney size={24} />
            Deposit Funds
          </button>
        </div>

        {/* TOTAL BALANCE - Full Width Big Card */}
        <div className={`${darkGlass} p-6 sm:p-8 lg:p-10 mb-10`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center flex-shrink-0">
                <MdAccountBalance size={36} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-base sm:text-lg font-medium">
                  TOTAL BALANCE
                </p>
                <p className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tighter">
                  ${accountBalance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-emerald-400 flex items-center gap-2 text-lg">
              <MdTrendingUp size={28} /> +12.4%{" "}
              <span className="text-sm text-slate-400">this month</span>
            </div>
          </div>

          <div className="h-64 sm:h-80 lg:h-[420px] w-full bg-slate-950/60 rounded-2xl p-3 sm:p-4 border border-slate-700">
            <Line data={totalBalanceData} options={totalBalanceOptions} />
          </div>

          <div className="flex justify-between text-xs sm:text-sm text-slate-400 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-emerald-400"></div> This Year
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-slate-500 border-dashed"></div> Last
              Year
            </div>
          </div>
        </div>

        {/* OTHER CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* SIGNAL STRENGTH */}
          <div className={`${darkGlass} p-6 sm:p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <MdSignalCellularAlt size={32} className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-lg text-white">
                  Signal Strength
                </p>
                <p className="text-slate-400 text-sm">
                  Investment Earning Power
                </p>
              </div>
            </div>
            <div className="flex justify-center my-4">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data: [signalStrength, 100 - signalStrength],
                        backgroundColor: ["#10b981", "#334155"],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    cutout: "78%",
                    plugins: { legend: { display: false } },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div className="text-5xl sm:text-6xl font-bold text-emerald-400">
                    {signalStrength}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EARNED PROFITS */}
          <div className={`${darkGlass} p-6 sm:p-8`}>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-slate-400">Earned Profits</p>
                <p className="text-4xl sm:text-5xl font-semibold text-emerald-400">
                  ${earnedProfits.toLocaleString()}
                </p>
              </div>
              <MdTrendingUp size={42} className="text-emerald-400" />
            </div>
            <div className="h-44 sm:h-48">
              <Line data={waveData} options={chartOptions} />
            </div>
          </div>

          {/* TOTAL DEPOSITED */}
          <div className={`${darkGlass} p-6 sm:p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-500/10 rounded-2xl flex items-center justify-center">
                <MdSavings size={32} className="text-slate-400" />
              </div>
              <div>
                <p className="text-slate-400">Total Deposited</p>
                <p className="text-4xl sm:text-5xl font-semibold text-white">
                  ${totalDeposited.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="h-44 sm:h-48">
              <Bar data={depositVsWithdrawData} options={chartOptions} />
            </div>
          </div>

          {/* CURRENT PLAN */}
          <div className={`${darkGlass} p-6 sm:p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                <MdStar size={32} className="text-amber-400" />
              </div>
              <p className="font-semibold text-xl text-white">Current Plan</p>
            </div>
            <div className="text-center py-8">
              <p className="text-6xl font-semibold text-white mb-4">
                {currentPlan}
              </p>
            </div>
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-black py-4 rounded-2xl font-semibold transition">
              Upgrade Plan
            </button>
          </div>

          {/* TRADING BONUS */}
          <div className={`${darkGlass} p-6 sm:p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                <MdCardGiftcard size={32} className="text-pink-400" />
              </div>
              <p className="font-semibold text-xl text-white">Trading Bonus</p>
            </div>
            <div className="text-center py-6">
              <p className="text-6xl font-semibold text-pink-400 mb-2">
                ${tradingBonus}
              </p>
              <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-400 px-4 py-1 rounded-full text-sm">
                🎁 Bonus Ready
              </div>
            </div>
            <button className="w-full border border-pink-500 text-pink-400 py-4 rounded-2xl hover:bg-pink-500/10 transition">
              Claim Bonus
            </button>
          </div>

          {/* BTC Equivalent */}
          <div className={`${darkGlass} p-6 sm:p-8 text-center`}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center">
                <FaBitcoin size={48} className="text-orange-400" />
              </div>
            </div>
            <p className="font-semibold text-xl text-white mb-2">
              BTC Equivalent
            </p>
            <p className="text-5xl font-mono font-bold text-orange-400">
              {(accountBalance / 105000).toFixed(6)}
            </p>
            <p className="text-slate-400">BTC</p>
          </div>

          {/* ETH Equivalent */}
          <div className={`${darkGlass} p-6 sm:p-8 text-center`}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center">
                <FaEthereum size={48} className="text-blue-400" />
              </div>
            </div>
            <p className="font-semibold text-xl text-white mb-2">
              ETH Equivalent
            </p>
            <p className="text-5xl font-mono font-bold text-blue-400">
              {(accountBalance / 4200).toFixed(4)}
            </p>
            <p className="text-slate-400">ETH</p>
          </div>

          {/* BOOSTER */}
          <div
            className={`${darkGlass} p-6 sm:p-8 col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center">
                  <MdRocketLaunch size={32} className="text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-xl text-white">
                    Booster Status
                  </p>
                  <p className="text-teal-400">No Booster Active</p>
                </div>
              </div>
              <MdTrendingUp size={42} className="text-teal-400" />
            </div>
            <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-5 rounded-2xl font-semibold">
              Activate Multiplier
            </button>
          </div>
        </div>

        {/* LIVE MARKET FEED */}
        <div ref={chartRef} className="mt-12 sm:mt-16">
          <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
            Live Market Feed
          </h3>
          <div className={`${darkGlass} overflow-hidden`}>
            <div className="h-[380px] sm:h-[480px] lg:h-[620px]">
              <TradingViewWidget />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSecurityPage = () => (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-10">
        Password & Security
      </h2>
      <div className={`${darkGlass} p-6 sm:p-10`}>
        <h3 className="text-2xl font-semibold mb-8">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-6">
          {[
            {
              label: "Current Password",
              value: currentPassword,
              setter: setCurrentPassword,
              show: showCurrentPassword,
              setShow: setShowCurrentPassword,
            },
            {
              label: "New Password",
              value: newPassword,
              setter: setNewPassword,
              show: showNewPassword,
              setShow: setShowNewPassword,
            },
            {
              label: "Confirm New Password",
              value: confirmNewPassword,
              setter: setConfirmNewPassword,
              show: showConfirmPassword,
              setShow: setShowConfirmPassword,
            },
          ].map(({ label, value, setter, show, setShow }) => (
            <div key={label}>
              <label className="block text-sm text-slate-400 mb-2">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={loadingBtn}
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-lg text-white transition mt-4"
          >
            {loadingBtn ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderDepositPage = () => (
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-10">
        Deposit Methods
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {["USDT", "BTC"].map((method) => (
          <div
            key={method}
            className={`${darkGlass} p-8 sm:p-12 text-center cursor-pointer hover:scale-[1.02] transition-all`}
            onClick={() => {
              setSelectedMethod(method);
              setShowDepositModal(true);
            }}
          >
            <div className="text-7xl sm:text-8xl mb-8">
              {method === "USDT" ? "💵" : "₿"}
            </div>
            <h3 className="text-3xl sm:text-4xl font-semibold mb-4">
              {method}
            </h3>
            <p className="text-slate-400 mb-10">Instant • Secure • Low fees</p>
            <button className="bg-blue-600 hover:bg-blue-700 w-full py-5 rounded-2xl font-semibold text-white text-lg">
              Deposit with {method}
            </button>
          </div>
        ))}
      </div>

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        method={selectedMethod}
      />
    </div>
  );

  const renderWithdrawalsPage = () => (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-10">
        Withdrawals / KYC
      </h2>
      {!kycSubmitted ? (
        <div className={`${darkGlass} p-8 sm:p-12`}>
          <div className="flex items-center gap-4 mb-8">
            <MdVerifiedUser size={48} className="text-blue-400" />
            <h3 className="text-3xl font-semibold">
              Complete KYC Verification
            </h3>
          </div>
          <form onSubmit={handleKycSubmit} className="space-y-8">
            <div>
              <label className="block text-sm text-slate-400 mb-3">
                Select ID Type
              </label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white">
                <option>Passport</option>
                <option>Driver's License</option>
                <option>National ID</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-3">
                  Front View
                </label>
                <label className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-3xl h-56 flex items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div className="text-center text-slate-400">
                    Choose Front Image
                  </div>
                </label>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-3">
                  Back View
                </label>
                <label className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-3xl h-56 flex items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div className="text-center text-slate-400">
                    Choose Back Image
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !frontFile || !backFile}
              className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl text-white text-lg font-semibold"
            >
              {uploading ? "Uploading..." : "Submit for Verification"}
            </button>
          </form>
        </div>
      ) : (
        <div className={`${darkGlass} p-12 sm:p-16 text-center`}>
          <img
            src={underReviewImg}
            alt="Under Review"
            className="mx-auto rounded-3xl"
          />
          <p className="mt-10 text-xl text-slate-400">
            Your KYC documents are currently under review.
          </p>
        </div>
      )}
    </div>
  );

  const WithdrawalModalComponent = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      toast.success(`Withdrawal of $${withdrawAmount} submitted successfully!`);
      setWalletAddress("");
      setWithdrawAmount("");
      onClose();
    };

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
        <div className={`${darkGlass} w-full max-w-md p-8 sm:p-10`}>
          <h2 className="text-3xl font-semibold mb-8">Withdraw Funds</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Wallet Address (TRC20 / ERC20)"
              className="w-full p-5 bg-slate-800 border border-slate-700 rounded-2xl focus:border-blue-500 text-white"
              required
            />
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount (USD)"
              className="w-full p-5 bg-slate-800 border border-slate-700 rounded-2xl focus:border-blue-500 text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl text-xl font-semibold text-white transition"
            >
              Confirm Withdrawal
            </button>
          </form>
        </div>
      </div>
    );
  };

  const sidebarItems = [
    { name: "Profile", icon: <FaUserCircle size={24} /> },
    { name: "Deposit", icon: <MdAttachMoney size={24} /> },
    { name: "Withdrawals", icon: <MdSavings size={24} /> },
    { name: "Security", icon: <MdSecurity size={24} /> },
    { name: "Live Trade", icon: <MdTrendingUp size={24} /> },
    { name: "KYC", icon: <MdVerifiedUser size={24} /> },
    { name: "Transaction Form", icon: <MdReceipt size={24} /> },
    { name: "Support", icon: <MdSupportAgent size={24} /> },
    { name: "Log Out", icon: <MdLogout size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black tracking-tighter bg-gradient-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              TN
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                TradeNixPro
              </h1>
              <p className="text-xs text-slate-500 -mt-1">PRO</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 pt-8 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Log Out") handleLogout();
                else if (item.name === "Live Trade") {
                  setActiveMenu("Profile");
                  setTimeout(
                    () =>
                      chartRef.current?.scrollIntoView({ behavior: "smooth" }),
                    200,
                  );
                } else setActiveMenu(item.name);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-6 py-4 rounded-2xl mb-2 flex items-center gap-4 text-lg font-medium transition-all ${
                activeMenu === item.name
                  ? "bg-violet-600/20 text-violet-400"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <span
                className={
                  activeMenu === item.name
                    ? "text-violet-400"
                    : "text-slate-500"
                }
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto flex flex-col min-h-screen">
        <div className="md:hidden bg-slate-900 p-5 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-4xl text-slate-300"
          >
            ☰
          </button>
          <h1 className="text-2xl font-semibold">TradeNixPro</h1>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeMenu === "Profile" && renderProfilePage()}
          {activeMenu === "Security" && renderSecurityPage()}
          {(activeMenu === "Deposit" || activeMenu === "Transaction Form") &&
            renderDepositPage()}
          {(activeMenu === "Withdrawals" || activeMenu === "KYC") &&
            renderWithdrawalsPage()}

          <DepositModal
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            method={selectedMethod}
          />
          <WithdrawalModalComponent
            isOpen={showWithdrawalModal}
            onClose={() => setShowWithdrawalModal(false)}
          />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {/* PROFESSIONAL FOOTER */}
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
