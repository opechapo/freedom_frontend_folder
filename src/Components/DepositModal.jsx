import { useState } from "react";
import { toast } from "react-toastify";
import { Copy, X } from "lucide-react";

const DepositModal = ({ isOpen, onClose, method = "USDT" }) => {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // =============== DYNAMIC BACKEND URL ===============
  const getBackendUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    return "http://localhost:5000";
  };

  const API_BASE = getBackendUrl();

  // Wallet Addresses (You can later fetch from backend)
  const walletAddresses = {
    USDT: "0x2021207B37e95D31325C5402F2aEBCaE3Ee80a5A",
    BTC: "bc1qxy2kdykj9s5q5z5f5f5f5f5f5f5f5f5f5f5f5", // Replace with real address
  };

  const address = walletAddresses[method];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      toast.error("Please upload proof of payment");
      return;
    }
    if (!amount) {
      toast.error("Please enter the amount sent");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("method", method);
    formData.append("amount", amount);
    formData.append("txHash", txHash);
    formData.append("proofImage", proofFile);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/deposit/upload-proof`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Proof uploaded successfully! Awaiting confirmation.");
        onClose();
        // Reset form
        setAmount("");
        setTxHash("");
        setProofFile(null);
      } else {
        toast.error(data.msg || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-700 max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 px-6 py-5">
          <h2 className="text-2xl font-bold text-white">{method} DEPOSIT</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-slate-400 text-center text-sm">
            Top Up Your Account Using This Method
          </p>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Address</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={address}
                readOnly
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-sm font-mono text-white break-all"
              />
              <button
                onClick={copyToClipboard}
                className="bg-slate-700 hover:bg-slate-600 px-6 rounded-xl flex items-center gap-2 transition flex-shrink-0"
              >
                <Copy size={18} />
                Copy
              </button>
            </div>
          </div>

          {/* Visual Image */}
          <div className="bg-slate-800 rounded-2xl p-4 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600"
              alt="Crypto Network"
              className="rounded-xl max-h-56 object-contain"
            />
          </div>

          <div className="text-center">
            <p className="text-emerald-400 text-sm font-medium">
              Account Will Be Funded Once Payment Is Confirmed.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Contact Live Chat with Proof of Payment to speed up the process.
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUploadProof} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Amount Sent ({method})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-purple-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                Transaction Hash (Optional)
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter TX hash if available"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-white font-mono text-sm focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Upload Proof of Payment
              </label>
              <label className="border border-dashed border-slate-600 hover:border-purple-500 rounded-2xl h-32 flex items-center justify-center cursor-pointer transition hover:bg-slate-800/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="text-center px-4">
                  <p className="text-purple-400 text-sm">
                    {proofFile
                      ? proofFile.name
                      : "Click to upload receipt / screenshot"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, JPEG • Max 5MB
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-medium transition text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !proofFile || !amount}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-slate-600 disabled:to-slate-600 rounded-2xl font-semibold transition text-white"
              >
                {uploading ? "Uploading Proof..." : "Upload Proof"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
