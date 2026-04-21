// src/components/DepositModal.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { Copy, X } from "lucide-react"; // Install lucide-react if not installed

const DepositModal = ({ isOpen, onClose, method = "USDT" }) => {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Wallet Addresses (You can also fetch from backend later)
  const walletAddresses = {
    USDT: "0x2021207B37e95D31325C5402F2aEBCaE3Ee80a5A",
    BTC: "bc1qxy2kdykj9s5q5z5f5f5f5f5f5f5f5f5f5f5f5", // Replace with your real BTC address
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
      const res = await fetch(
        `http://localhost:5000/api/deposit/upload-proof`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Proof uploaded successfully! Awaiting confirmation.");
        onClose();
        // Optionally reset form
        setAmount("");
        setTxHash("");
        setProofFile(null);
      } else {
        toast.error(data.msg || "Upload failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{method} DEPOSIT</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-slate-400 text-center">
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
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm font-mono text-white"
              />
              <button
                onClick={copyToClipboard}
                className="bg-slate-700 hover:bg-slate-600 px-5 rounded-lg flex items-center gap-2 transition"
              >
                <Copy size={18} />
                Copy
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="bg-slate-800 rounded-xl p-4 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600"
              alt="Crypto Deposit"
              className="rounded-lg max-h-52 object-contain"
            />
          </div>

          <p className="text-center text-sm text-emerald-400">
            Account Will Be Funded Once Payment Is Confirmed.
          </p>

          <p className="text-xs text-slate-500 text-center">
            Contact Live Chat With Proof of Payment To Speed Up The Process.
          </p>

          {/* Upload Form */}
          <form onSubmit={handleUploadProof} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Amount Sent ({method})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Transaction Hash (Optional)
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter TX hash if available"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Upload Proof of Payment
              </label>
              <label className="border border-dashed border-slate-600 hover:border-purple-500 rounded-xl h-28 flex items-center justify-center cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="text-center">
                  <p className="text-purple-400 text-sm">
                    {proofFile
                      ? proofFile.name
                      : "Click to upload receipt/screenshot"}
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !proofFile || !amount}
                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 rounded-lg font-medium transition"
              >
                {uploading ? "Uploading..." : "Upload Proof"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
