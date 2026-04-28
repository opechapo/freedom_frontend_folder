import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import TradingViewWidget from "../Components/TradingViewWidget";

import underReviewImg from "../assets/Images/under-review.png";
import DepositModal from "../Components/DepositModal";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("USDT");

  // Withdrawal Modal states
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  // Eye toggle states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // KYC states
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  // User Data from MongoDB
  const [accountBalance, setAccountBalance] = useState(0);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [signalStrength, setSignalStrength] = useState(1);
  const [earnedProfits, setEarnedProfits] = useState(0);
  const [currentPlan, setCurrentPlan] = useState("No Plan");
  const [tradingBonus, setTradingBonus] = useState(0);

  // Smart Backend URL
  const getBackendUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    return "http://localhost:5000";
  };

  const API_BASE = getBackendUrl();

  // Fetch User Data from Backend
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

        setAccountBalance(data.accountBalance || 0);
        setTotalDeposited(data.totalDeposited || 0);
        setSignalStrength(data.signalStrength || 1);
        setEarnedProfits(data.earnedProfits || 0);
        setCurrentPlan(data.currentPlan || "No Plan");
        setTradingBonus(data.tradingBonus || 0);

        if (showToast) toast.success("Dashboard updated successfully!");
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  // Initial Load
  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  // Auto Refresh every 4 seconds
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

  const scrollToChart = () => {
    chartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Crypto Equivalents
  const btcPrice = 105000;
  const ethPrice = 4200;
  const btcEquivalent = (accountBalance / btcPrice).toFixed(6);
  const ethEquivalent = (accountBalance / ethPrice).toFixed(4);

  // ====================== RENDER FUNCTIONS ======================
  const renderProfilePage = () => {
    if (!user)
      return <div className="text-center py-20 text-slate-400">Loading...</div>;

    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome back, {user.username}!
            </h2>
            <p className="text-slate-400 mt-2 text-lg">
              Your professional trading dashboard
            </p>
          </div>
          <button
            onClick={() => setShowDepositModal(true)}
            className="mt-6 md:mt-0 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-3 shadow-lg shadow-purple-500/30 transition-all active:scale-95"
          >
            <span className="text-2xl">💰</span>
            Deposit Funds
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Account Balance */}
          <div className="lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl">
                  💎
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    TOTAL BALANCE
                  </p>
                  <p className="text-5xl font-bold text-white tracking-tighter mt-1">
                    ${accountBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-emerald-400 text-4xl">📈</div>
            </div>

            <div className="mt-auto flex gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex-1 bg-white text-slate-900 font-semibold py-4 rounded-2xl hover:bg-slate-100 transition"
              >
                Deposit
              </button>
              <button
                onClick={() => fetchUserData(true)}
                className="flex-1 border border-slate-600 hover:border-slate-400 py-4 rounded-2xl font-medium transition"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Signal Strength */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl">
                📡
              </div>
              <div>
                <p className="font-semibold text-lg">Signal Strength</p>
                <p className="text-sm text-slate-400">
                  Investment Earning Power
                </p>
              </div>
            </div>

            <div className="text-6xl font-bold text-cyan-400 mb-2 tracking-tighter">
              {signalStrength}%
            </div>
            <p className="text-emerald-400 text-sm mb-6">
              Higher strength = Faster earnings
            </p>

            <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${signalStrength}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>1%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Earned Profits */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-semibold text-lg">Earned Profits</p>
                <p className="text-emerald-400 text-4xl font-bold mt-1">
                  ${earnedProfits.toLocaleString()}
                </p>
              </div>
              <div className="text-3xl">📈</div>
            </div>

            <div className="h-32 -mx-2 mt-2">
              <svg viewBox="0 0 500 140" className="w-full h-full">
                <defs>
                  <linearGradient
                    id="profitWave"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 130 Q70 100 130 118 Q190 60 260 105 Q330 45 390 88 Q460 30 500 75 L500 140 L0 140 Z"
                  fill="url(#profitWave)"
                />
                <path
                  d="M0 130 Q70 100 130 118 Q190 60 260 105 Q330 45 390 88 Q460 30 500 75"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-xs text-slate-500 text-center mt-1">
              All time profits • Real-time
            </p>
          </div>

          {/* Amount Deposited */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-11 h-11 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl">
                🏦
              </div>
              <div>
                <p className="font-semibold">Total Deposited</p>
                <p className="text-4xl font-bold text-purple-400 mt-1">
                  ${totalDeposited.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center -mb-2">
              {[65, 45, 85, 55, 72].map((h, i) => (
                <div
                  key={i}
                  className="w-8 bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400 rounded-t-xl transition-all"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>

          {/* Current Plan */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 bg-amber-500/10 rounded-2xl flex items-center justify-center text-3xl">
                ⭐
              </div>
              <p className="font-semibold text-lg">Current Plan</p>
            </div>
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-slate-300">{currentPlan}</p>
            </div>
            <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold py-4 rounded-2xl hover:brightness-110 transition">
              Upgrade Plan
            </button>
          </div>

          {/* Trading Bonus */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 bg-pink-500/10 rounded-2xl flex items-center justify-center text-3xl">
                🎁
              </div>
              <p className="font-semibold text-lg">Trading Bonus</p>
            </div>
            <p className="text-5xl font-bold text-pink-400 text-center py-10">
              ${tradingBonus.toLocaleString()}
            </p>
            <button className="w-full border border-pink-500 text-pink-400 hover:bg-pink-500/10 py-4 rounded-2xl font-medium transition">
              Claim Bonus
            </button>
          </div>

          {/* BTC & ETH Equivalent */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 bg-orange-500/10 rounded-2xl flex items-center justify-center text-3xl">
                ₿
              </div>
              <p className="font-semibold text-lg">BTC Equivalent</p>
            </div>
            <div className="text-center py-8">
              <p className="text-4xl font-mono font-bold text-orange-400">
                {btcEquivalent}
              </p>
              <p className="text-slate-400 mt-1">BTC</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl">
                ⟠
              </div>
              <p className="font-semibold text-lg">ETH Equivalent</p>
            </div>
            <div className="text-center py-8">
              <p className="text-4xl font-mono font-bold text-blue-400">
                {ethEquivalent}
              </p>
              <p className="text-slate-400 mt-1">ETH</p>
            </div>
          </div>

          {/* Booster */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-teal-500/10 rounded-2xl flex items-center justify-center text-3xl">
                  🚀
                </div>
                <div>
                  <p className="font-semibold text-lg">Booster Status</p>
                  <p className="text-teal-400 font-medium">No Booster Active</p>
                </div>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
            <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 py-5 rounded-2xl font-semibold text-black hover:brightness-110 transition">
              Activate Multiplier
            </button>
          </div>
        </div>

        {/* Live Market Chart */}
        <div ref={chartRef} className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold tracking-tight text-cyan-300">
              Live Market Feed
            </h3>
            <div className="px-5 py-2 bg-slate-800 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              REAL-TIME
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-[420px] md:h-[520px] lg:h-[620px]">
              <TradingViewWidget />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSecurityPage = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Password and Security</h2>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 shadow-xl">
        <h3 className="text-xl font-semibold mb-6">Change Password</h3>
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-2xl"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={loadingBtn}
            className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-semibold text-lg transition"
          >
            {loadingBtn ? "Changing Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderDepositPage = () => (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Deposit Methods</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["USDT", "BTC"].map((method) => (
          <div
            key={method}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center cursor-pointer hover:border-purple-500 transition-all group"
            onClick={() => {
              setSelectedMethod(method);
              setShowDepositModal(true);
            }}
          >
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">
              {method === "USDT" ? "💵" : "₿"}
            </div>
            <h3 className="text-3xl font-bold mb-3">{method}</h3>
            <p className="text-slate-400 mb-10">Instant • Secure • Low fees</p>
            <button className="bg-purple-600 hover:bg-purple-700 w-full py-4 rounded-2xl font-semibold">
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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Withdrawals / KYC</h2>
      {!kycSubmitted ? (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🪪</span>
            <h3 className="text-2xl font-semibold">
              Complete KYC Verification
            </h3>
          </div>
          <form onSubmit={handleKycSubmit} className="space-y-8">
            <div>
              <label className="block text-sm text-slate-400 mb-3">
                Select ID Type
              </label>
              <select className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white">
                <option>Passport</option>
                <option>Driver's License</option>
                <option>National ID</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Front View
                </label>
                <label className="border border-dashed border-slate-600 hover:border-purple-500 rounded-2xl h-44 flex items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFrontFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-purple-400">Choose Front Image</p>
                  </div>
                </label>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Back View
                </label>
                <label className="border border-dashed border-slate-600 hover:border-purple-500 rounded-2xl h-44 flex items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBackFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-purple-400">Choose Back Image</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !frontFile || !backFile}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-2xl text-lg font-semibold"
            >
              {uploading ? "Uploading..." : "Verify My Account"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-16 text-center">
          <img
            src={underReviewImg}
            alt="Under Review"
            className="mx-auto rounded-2xl"
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8">Withdraw Funds</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Wallet Address (TRC20 / ERC20)"
              className="w-full p-5 bg-slate-950 border border-slate-700 rounded-2xl focus:border-purple-500"
              required
            />
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount (USD)"
              className="w-full p-5 bg-slate-950 border border-slate-700 rounded-2xl focus:border-purple-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl text-xl font-bold transition"
            >
              Confirm Withdrawal
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col md:flex-row">
      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="text-4xl font-black tracking-tighter text-cyan-400">
            TN
          </div>
          <div>
            <h1 className="text-2xl font-bold">TradeNixPro</h1>
            <p className="text-xs text-slate-500 -mt-1">PRO</p>
          </div>
        </div>

        <nav className="flex-1 px-4 pt-8 overflow-y-auto">
          {[
            { name: "Profile", icon: "👤" },
            { name: "Deposit", icon: "💵" },
            { name: "Withdrawals", icon: "💸" },
            { name: "Security", icon: "🔒" },
            { name: "Live Trade", icon: "📈" },
            { name: "KYC", icon: "✅" },
            { name: "Transaction Form", icon: "📝" },
            { name: "Support", icon: "🎧" },
            { name: "Log Out", icon: "🚪" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Log Out") handleLogout();
                else if (item.name === "Live Trade") {
                  setActiveMenu("Profile");
                  setTimeout(scrollToChart, 200);
                } else setActiveMenu(item.name);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-6 py-4 rounded-2xl mb-2 flex items-center gap-4 text-lg transition-all ${
                activeMenu === item.name
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
                  : "hover:bg-slate-900"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden bg-slate-950 p-5 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
          <button onClick={() => setSidebarOpen(true)} className="text-4xl">
            ☰
          </button>
          <h1 className="text-2xl font-bold text-cyan-400">TradeNixPro</h1>
        </div>

        <div className="p-6 md:p-10">
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
      </main>
    </div>
  );
};

export default Dashboard;
