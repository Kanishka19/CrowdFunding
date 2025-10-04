import React, { useState, useEffect } from "react";
import { fetchHistory } from "../api";
import { useAuth } from "../context/AuthContext";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetchHistory(user.id);
        setPayments(response || []);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setPayments([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EFFF] to-[#EDE7FF] py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#694F8E] mb-8">
          💳 Payment History
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading payment history...</p>
        ) : payments.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No payment history found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-[#694F8E] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Donated To
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-purple-50 transition`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.donatedto}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          payment.status === "success"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
