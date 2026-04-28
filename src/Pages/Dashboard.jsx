import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import TradingViewWidget from "../Components/TradingViewWidget";

import underReviewImg from "../assets/Images/under-review.png";
import DepositModal from "../Components/DepositModal";

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
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

  // Balance states
  const [accountBalance, setAccountBalance] = useState(0);
  const [totalDeposited, setTotalDeposited] = useState(0);

  // Smart Backend URL
  const getBackendUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    return "http://localhost:5000";
  };

  const API_BASE = getBackendUrl();

  // Fetch User Balance
  const fetchUserBalance = async (showToast = false) => {
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
        if (showToast) toast.success("Balance updated successfully!");
      }
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  // Initial Load
  useEffect(() => {
    if (user) fetchUserBalance();
  }, [user]);

  // Auto Refresh every 4 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => fetchUserBalance(), 4000);
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

  // ====================== RENDER FUNCTIONS ======================
  const renderProfilePage = () => {
    if (!user)
      return <div className="text-center py-20 text-slate-400">Loading...</div>;

    return (
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          Welcome {user.username}!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {/* Account Balance */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <p className="text-slate-400">Account Balance</p>
            <p className="text-4xl font-bold mt-2 text-green-400">
              ${accountBalance.toLocaleString()}
            </p>

            <div className="flex gap-3 mt-auto pt-6">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-sm font-medium transition"
              >
                Deposit Funds
              </button>
              <button
                onClick={() => fetchUserBalance(true)}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2"
              >
                🔄 Refresh Now
              </button>
            </div>
          </div>

          {/* Signal Strength */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-medium">Signal Strength: 100%</p>
                <p className="text-sm text-slate-400">
                  Higher Strength Guarantees Faster Earning
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full w-full"></div>
            </div>
          </div>

          {/* Earned Profits */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">Earned Profits</p>
                <p className="text-sm text-slate-400">All Tallied</p>
              </div>
              <span className="text-2xl">📈</span>
            </div>
            <div className="w-full h-32 bg-gradient-to-r from-green-900 to-green-700 rounded-xl flex items-end justify-end p-4">
              <p className="text-3xl font-bold">$0.00</p>
            </div>
          </div>

          {/* Amount Deposited */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl sm:col-span-2 lg:col-span-1">
            <p className="font-medium mb-4">Amount Deposited</p>
            <div className="flex gap-2 justify-center">
              {[50, 70, 60, 90, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-10 sm:w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                  style={{ height: `${h}px` }}
                ></div>
              ))}
            </div>
            <p className="text-center text-3xl font-bold mt-6">
              ${totalDeposited.toLocaleString()}
            </p>
          </div>

          {/* Remaining Cards */}
          {[
            { title: "Your Plan", value: "No Plan", btn: "Earning Plan" },
            { title: "Bonus", value: "$0.00", btn: "Trading Bonus" },
            { title: "Bitcoin", value: "0.000 BTC" },
            { title: "Ethereum", value: "0.000 ETH" },
            {
              title: "Booster",
              value: "No Booster Active",
              btn: "Multiply Return Rate",
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl p-6 shadow-xl">
              <p className="font-medium mb-4">{item.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-center py-6 text-slate-400">
                {item.value}
              </p>
              {item.btn && (
                <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-sm font-medium transition">
                  {item.btn}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Live Market Chart */}
        <div ref={chartRef} className="mt-8">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400">
            Live Market Chart
          </h3>
          <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
            <div className="h-[340px] sm:h-[420px] md:h-[520px] lg:h-[600px]">
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
      <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xl"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={loadingBtn}
            className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-medium text-white"
          >
            {loadingBtn ? "Changing Password..." : "Change Password"}
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
            className="bg-slate-800 rounded-2xl p-8 text-center shadow-xl cursor-pointer hover:scale-105 transition-all"
            onClick={() => {
              setSelectedMethod(method);
              setShowDepositModal(true);
            }}
          >
            <div className="text-5xl mb-4">
              {method === "USDT" ? "💵" : "₿"}
            </div>
            <h3 className="text-2xl font-bold mb-3">{method}</h3>
            <p className="text-slate-400 mb-8">
              Quickly fund your account using this deposit method!
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 px-12 py-3 rounded-xl w-full">
              Show Details
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
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🪪</span>
            <h3 className="text-xl font-semibold">KYC Verification</h3>
          </div>
          <form onSubmit={handleKycSubmit} className="space-y-8">
            <div>
              <label className="block text-sm text-slate-400 mb-3">
                Select ID Type
              </label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white">
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
                <label className="border border-dashed border-slate-600 hover:border-purple-500 rounded-xl h-44 flex items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFrontFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-purple-400">Choose File</p>
                  </div>
                </label>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Back View
                </label>
                <label className="border border-dashed border-slate-600 hover:border-purple-500 rounded-xl h-44 flex items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBackFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-purple-400">Choose File</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !frontFile || !backFile}
              className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl text-lg"
            >
              {uploading ? "Uploading..." : "Verify My Account"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl p-12 text-center">
          <img
            src={underReviewImg}
            alt="Under Review"
            className="mx-auto rounded-lg"
          />
          <p className="mt-8 text-slate-400">
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
      toast.success(`Withdrawal of $${withdrawAmount} submitted!`);
      setWalletAddress("");
      setWithdrawAmount("");
      onClose();
    };

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
        <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-6">Withdraw Funds</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Wallet Address"
              className="w-full p-4 bg-slate-900 rounded-2xl"
              required
            />
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-4 bg-slate-900 rounded-2xl"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 py-5 rounded-2xl text-xl font-bold"
            >
              Confirm Withdrawal
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row">
      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-800 border-r border-slate-700 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">TRADENIXPRO</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-3xl"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 px-4 pt-6 overflow-y-auto">
          {[
            { name: "Profile", icon: "👤" },
            { name: "Deposit", icon: "💵" },
            { name: "Withdrawals", icon: "💸" },
            { name: "Security", icon: "🔒" },
            { name: "Live Trade", icon: "📊" },
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
                  setTimeout(scrollToChart, 300);
                } else setActiveMenu(item.name);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3.5 rounded-xl mb-1 flex items-center gap-3 ${
                activeMenu === item.name
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "hover:bg-slate-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden bg-slate-800 p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-700">
          <button onClick={() => setSidebarOpen(true)} className="text-3xl">
            ☰
          </button>
          <h1 className="text-xl font-bold text-cyan-400">Dashboard</h1>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
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
