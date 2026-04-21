import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import TradingViewWidget from "../Components/TradingViewWidget";

// Import the Under Review image
import underReviewImg from "../assets/Images/under-review.png";

// Import Deposit Modal
import DepositModal from "../Components/DepositModal";

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState("Profile");
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

  // Real Account Balance from Backend
  const [accountBalance, setAccountBalance] = useState(0);
  const [totalDeposited, setTotalDeposited] = useState(0);

  // Dashboard Protection
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Fetch latest user balance
  const fetchUserBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAccountBalance(data.accountBalance || 0);
        setTotalDeposited(data.totalDeposited || 0);
      }
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBalance();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setLoadingBtn(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );

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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleKycSubmit = (e) => {
    e.preventDefault();
    if (!frontFile || !backFile) {
      toast.error("Please upload both front and back images");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setKycSubmitted(true);
      setUploading(false);
      toast.success(
        "Your document was successfully uploaded and is being verified",
      );
      setShowWithdrawalModal(true);
    }, 1500);
  };

  const scrollToChart = () => {
    chartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ====================== RENDER FUNCTIONS ======================
  const renderProfilePage = () => {
    if (!user) {
      return (
        <div className="min-h-[400px] flex items-center justify-center text-slate-400 text-xl">
          Loading dashboard...
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Welcome {user.username}!</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Account Balance - Real Data */}
          <div className="bg-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-400">Account Balance</p>
              <p className="text-4xl font-bold mt-2">
                ${accountBalance.toLocaleString()}
              </p>
              <button
                onClick={() => setShowDepositModal(true)}
                className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full text-sm font-medium transition"
              >
                Deposit Funds
              </button>
            </div>
          </div>

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
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

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
            <p className="text-right text-cyan-400 mt-2 text-sm">In return</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <p className="font-medium mb-4">Amount Deposited</p>
            <div className="flex gap-2 justify-center">
              {[50, 70, 60, 90, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                  style={{ height: `${h}px` }}
                ></div>
              ))}
            </div>
            <p className="text-center text-3xl font-bold mt-6">
              ${totalDeposited.toLocaleString()}
            </p>
            <p className="text-center text-green-400 text-sm">Deposits</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <p className="font-medium mb-4">Your Plan</p>
            <p className="text-2xl font-bold text-center py-8 text-slate-500">
              No Plan
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm font-medium">
              Earning Plan
            </button>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <p className="font-medium mb-4">Bonus</p>
            <p className="text-4xl font-bold text-center">$0.00</p>
            <button className="w-full mt-4 bg-gray-700 py-2 rounded-lg text-sm">
              Here Is The Trading Bonus Earned
            </button>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-red-500 text-2xl mb-2">Bitcoin</p>
              <p className="text-sm text-slate-400">BTC Equivalent</p>
              <p className="text-xl font-bold">0.000 BTC</p>
              <p className="text-xs text-slate-400">Return In Crypto</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-red-500 text-2xl mb-2">Ethereum</p>
              <p className="text-sm text-slate-400">ETH Equivalent</p>
              <p className="text-xl font-bold">0.000 ETH</p>
              <p className="text-xs text-slate-400">Return In Crypto</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">❤️</span>
              <div>
                <p className="font-medium">Booster</p>
                <p className="text-sm text-slate-400">Current Boost Rate</p>
              </div>
            </div>
            <p className="text-xl font-bold">Booster: No Booster Active</p>
            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm font-medium">
              Multiply Return Rate
            </button>
          </div>
        </div>

        {/* Live Trading Chart */}
        <div ref={chartRef} className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400">
            Live Market Chart
          </h3>
          <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
            <div className="h-96 md:h-[600px]">
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 pr-12"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xl transition-colors"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loadingBtn}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 py-3.5 rounded-lg font-medium text-white transition-all mt-4"
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
        <div
          className="bg-slate-800 rounded-2xl p-8 text-center shadow-xl cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => {
            setSelectedMethod("USDT");
            setShowDepositModal(true);
          }}
        >
          <div className="text-5xl mb-4">💵</div>
          <h3 className="text-2xl font-bold mb-3">USDT</h3>
          <p className="text-slate-400 mb-8">
            Quickly fund your account using this deposit method!
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 px-12 py-3 rounded-lg font-medium transition-all">
            Show
          </button>
        </div>

        <div
          className="bg-slate-800 rounded-2xl p-8 text-center shadow-xl cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => {
            setSelectedMethod("BTC");
            setShowDepositModal(true);
          }}
        >
          <div className="text-5xl mb-4">₿</div>
          <h3 className="text-2xl font-bold mb-3">BTC</h3>
          <p className="text-slate-400 mb-8">
            Quickly fund your account using this deposit method!
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 px-12 py-3 rounded-lg font-medium transition-all">
            Show
          </button>
        </div>
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
          <p className="text-slate-400 mb-8">
            Upload required documents to get KYC completed for withdrawal.
          </p>

          <form onSubmit={handleKycSubmit} className="space-y-8">
            <div>
              <label className="block text-sm text-slate-400 mb-3">
                Select ID Type
              </label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                <option>Passport</option>
                <option>Driver&apos;s License</option>
                <option>National ID</option>
                <option>Others</option>
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
                    onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-purple-400">Choose File</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {frontFile ? frontFile.name : "No file chosen"}
                    </p>
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
                    onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-purple-400">Choose File</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {backFile ? backFile.name : "No file chosen"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !frontFile || !backFile}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 py-4 rounded-lg font-medium text-lg transition"
            >
              {uploading ? "Uploading..." : "Verify My Account"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl p-12 shadow-xl text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500 px-6 py-3 rounded-full mb-10 text-sm">
            ✅ Your document was successfully uploaded and is being verified
          </div>
          <h3 className="text-2xl font-semibold mb-10">
            Identification Status
          </h3>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg">
              <img
                src={underReviewImg}
                alt="Under Review"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
          <p className="mt-8 text-slate-400 text-sm">
            Your KYC documents are currently under review.
            <br />
            You will be notified once verification is complete.
          </p>
        </div>
      )}
    </div>
  );

  // Withdrawal Modal
  const WithdrawalModalComponent = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmitWithdrawal = (e) => {
      e.preventDefault();
      if (
        !walletAddress.trim() ||
        !withdrawAmount ||
        parseFloat(withdrawAmount) <= 0
      ) {
        toast.error("Please enter a valid wallet address and amount");
        return;
      }

      toast.success(
        `Withdrawal request of $${withdrawAmount} to ${walletAddress} has been submitted for admin review!`,
      );
      setWalletAddress("");
      setWithdrawAmount("");
      onClose();
    };

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
        <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Withdraw Funds</h2>
            <button
              onClick={onClose}
              className="text-4xl leading-none text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmitWithdrawal} className="space-y-8">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Crypto Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-cyan-400 outline-none"
                placeholder="0x123abc... or bc1q..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Amount to Withdraw (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:border-cyan-400 outline-none"
                placeholder="100.00"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl text-xl font-semibold text-white transition-all active:scale-95"
            >
              Confirm & Withdraw
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-cyan-400">TRADENIXPRO</h1>
          <p className="text-xs text-slate-500 mt-4">
            {new Date().toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            GMT+1
          </p>
        </div>

        <nav className="flex-1 px-4 pt-6">
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
                if (item.name === "Log Out") {
                  handleLogout();
                  return;
                }
                if (item.name === "Live Trade") {
                  setActiveMenu("Profile");
                  setTimeout(scrollToChart, 300);
                  return;
                }
                setActiveMenu(item.name);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center gap-3 transition-all ${
                activeMenu === item.name
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium"
                  : "hover:bg-slate-700 text-slate-300"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
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
      </main>
    </div>
  );
};

export default Dashboard;
