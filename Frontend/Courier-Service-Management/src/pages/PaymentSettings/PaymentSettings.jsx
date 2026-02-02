import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/NavBar/Navbar";
import { getPartnerProfile, getPartnerPayouts, transferEarnings, updatePartnerProfile } from "../../services/users";

export default function PaymentSettings() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileResp, payoutsResp] = await Promise.allSettled([
          getPartnerProfile(),
          getPartnerPayouts()
        ]);

        if (profileResp.status === "fulfilled" && profileResp.value?.data?.responseStatus === "SUCCESS") {
          const p = profileResp.value.data;
          setPartnerProfile(p);
          setBankDetails({
            bankAccountNumber: p.bankAccountNumber?.toString() || "",
          });
        }

        if (payoutsResp.status === "fulfilled") {
          setPayouts(payoutsResp.value.data || []);
        }
      } catch (e) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTransferEarnings = async () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setTransferring(true);
      const resp = await transferEarnings(amount);
      if (resp.data.status === "SUCCESS") {
        toast.success(resp.data.message || "Transfer request submitted");
        setTransferAmount("");
        // Reload payouts
        const payoutsResp = await getPartnerPayouts();
        setPayouts(payoutsResp.data || []);
      } else {
        toast.error(resp.data.message || "Transfer failed");
      }
    } catch (e) {
      toast.error("Transfer failed");
    } finally {
      setTransferring(false);
    }
  };

  const handleSaveBankDetails = async () => {
    try {
      const resp = await updatePartnerProfile({
        bankAccountNumber: bankDetails.bankAccountNumber ? parseInt(bankDetails.bankAccountNumber) : null,
      });
      if (resp.data.responseStatus === "SUCCESS") {
        toast.success("Bank details updated");
        setEditingBank(false);
        setPartnerProfile(resp.data);
      } else {
        toast.error(resp.data.message || "Update failed");
      }
    } catch (e) {
      toast.error("Update failed");
    }
  };
const profilePhotoUrl = partnerProfile?.profilePhotoUrl || null;

  // Calculate today's earnings (from dashboard stats - would need separate call, simplified here)
  const todayEarnings = 0; // This should come from dashboard stats

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar profileImage={profilePhotoUrl}/>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/partner-dashboard")}
            className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Payment Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your payments and bank details</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Transfer Today's Earnings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Transfer Earnings</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Transfer your earnings to your bank account
              </p>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  onClick={handleTransferEarnings}
                  disabled={transferring || !transferAmount}
                  className="px-6 py-2.5 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {transferring ? "Transferring..." : "Transfer"}
                </button>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Bank Account Details</h3>
                </div>
                {!editingBank && (
                  <button
                    onClick={() => setEditingBank(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingBank ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.bankAccountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankAccountNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter bank account number"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveBankDetails}
                      className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingBank(false);
                        setBankDetails({
                          bankAccountNumber: partnerProfile?.bankAccountNumber?.toString() || "",
                        });
                      }}
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Account Number:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {partnerProfile?.bankAccountNumber ? `****${partnerProfile.bankAccountNumber.toString().slice(-4)}` : "Not set"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Transferred Payments */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Transferred Payments</h3>
              </div>
              {payouts.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">No payments transferred yet</p>
              ) : (
                <div className="space-y-3">
                  {payouts.map((payout) => (
                    <div
                      key={payout.payoutId}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          ₹{payout.amount?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status: {payout.paymentStatus || "PENDING"}
                        </p>
                        {payout.paidAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Paid: {new Date(payout.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payout.paymentStatus === "PAID" 
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : payout.paymentStatus === "PENDING"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}>
                        {payout.paymentStatus || "PENDING"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
