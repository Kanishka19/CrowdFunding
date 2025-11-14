import React, { useState, useEffect, useRef } from "react";
import { fetchHistory } from "../api";
import { useAuth } from "../context/AuthContext";

const Confetti = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-10"
    style={{ opacity: 0.18 }}
  >
    <defs>
      <linearGradient id="confetti1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#B39DDB" />
        <stop offset="100%" stopColor="#7C5BA3" />
      </linearGradient>
      <linearGradient id="confetti2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5EFFF" />
        <stop offset="100%" stopColor="#EDE7FF" />
      </linearGradient>
    </defs>
    {[...Array(18)].map((_, i) => (
      <rect
        key={i}
        x={Math.random() * 100 + "%"}
        y={Math.random() * 100 + "%"}
        width={6 + Math.random() * 8}
        height={2 + Math.random() * 4}
        rx={2}
        fill={`url(#confetti${(i % 2) + 1})`}
        opacity={0.7}
        transform={`rotate(${Math.random() * 360})`}
      />
    ))}
  </svg>
);

const TimelineDot = ({ status }) => (
  <span
    className={`w-4 h-4 rounded-full border-4 block mx-auto mb-1 shadow-lg ${
      status === "success"
        ? "bg-green-400 border-green-200"
        : status === "failed"
        ? "bg-red-400 border-red-200"
        : "bg-yellow-300 border-yellow-100"
    }`}
  ></span>
);

const MotivationalQuote = () => (
  <div className="relative z-20 flex flex-col items-center mb-8 animate-fadeIn">
    <svg
      width="48"
      height="48"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#B39DDB"
      className="mb-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 17a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v6a4 4 0 01-4 4zm10 0a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v6a4 4 0 01-4 4z"
      />
    </svg>
    <blockquote className="text-xl md:text-2xl text-[#694F8E] font-semibold text-center max-w-2xl mx-auto italic">
      "The smallest act of kindness is worth more than the grandest intention."
    </blockquote>
    <span className="text-[#7C5BA3] text-sm mt-2">— Oscar Wilde</span>
  </div>
);

const DonationStats = ({ payments }) => {
  const totalDonations = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successful = payments.filter((p) => p.status === "success").length;
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 animate-fadeIn">
      <div className="flex flex-col items-center bg-gradient-to-br from-[#EDE7FF] to-[#B39DDB] rounded-2xl shadow-lg px-8 py-5 min-w-[160px]">
        <span className="text-3xl font-extrabold text-[#694F8E]">
          {totalDonations}
        </span>
        <span className="text-[#7C5BA3] font-medium mt-1">Donations</span>
      </div>
      <div className="flex flex-col items-center bg-gradient-to-br from-[#F5EFFF] to-[#B39DDB] rounded-2xl shadow-lg px-8 py-5 min-w-[160px]">
        <span className="text-3xl font-extrabold text-[#694F8E]">
          ₹{totalAmount.toLocaleString()}
        </span>
        <span className="text-[#7C5BA3] font-medium mt-1">Total Donated</span>
      </div>
      <div className="flex flex-col items-center bg-gradient-to-br from-[#B39DDB] to-[#EDE7FF] rounded-2xl shadow-lg px-8 py-5 min-w-[160px]">
        <span className="text-3xl font-extrabold text-[#694F8E]">
          {successful}
        </span>
        <span className="text-[#7C5BA3] font-medium mt-1">Successful</span>
      </div>
    </div>
  );
};

const DonationIllustration = () => (
  <div className="flex justify-center mb-8 animate-fadeIn">
    <svg width="220" height="110" viewBox="0 0 220 110" fill="none">
      <ellipse cx="110" cy="100" rx="90" ry="10" fill="#EDE7FF" />
      <g>
        <rect
          x="90"
          y="30"
          width="40"
          height="40"
          rx="20"
          fill="#FFD700"
          stroke="#E6B800"
          strokeWidth="3"
        />
        <text
          x="110"
          y="55"
          textAnchor="middle"
          fill="#fff"
          fontSize="22"
          fontWeight="bold"
          dy=".3em"
        >
          ₹
        </text>
      </g>
      <g>
        <path
          d="M110 30 Q120 10 130 30"
          stroke="#B39DDB"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="120" cy="10" r="6" fill="#B39DDB" />
      </g>
      <g>
        <path
          d="M110 30 Q100 10 90 30"
          stroke="#7C5BA3"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="100" cy="10" r="6" fill="#7C5BA3" />
      </g>
      <g>
        <rect
          x="60"
          y="60"
          width="20"
          height="20"
          rx="10"
          fill="#B39DDB"
          opacity="0.18"
        />
        <rect
          x="140"
          y="60"
          width="20"
          height="20"
          rx="10"
          fill="#B39DDB"
          opacity="0.18"
        />
      </g>
    </svg>
  </div>
);

const statusColors = {
  success: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  failed: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
  },
};

const TimelineItem = ({ payment, isLast }) => {
  const color = statusColors[payment.status] || statusColors.pending;
  return (
    <div className="flex items-start relative group">
      <div className="flex flex-col items-center mr-6">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-4 ${color.border} bg-white z-10`}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#694F8E"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 0C7.582 4 4 7.582 4 12c0 4.418 3.582 8 8 8s8-3.582 8-8c0-4.418-3.582-8-8-8z"
            />
          </svg>
        </div>
        {!isLast && (
          <div
            className="w-1 bg-gradient-to-b from-[#EDE7FF] to-[#B39DDB] flex-1 mt-1 mb-1"
            style={{ minHeight: 40 }}
          />
        )}
      </div>
      <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between bg-white rounded-2xl shadow p-5 mb-6 border border-[#F5EFFF] group-hover:shadow-lg transition">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-mono">Order ID:</span>
            <span className="text-[#694F8E] font-bold text-base tracking-wide">
              {payment.orderId}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 font-mono">Donated To:</span>
            <span className="text-[#7C5BA3] font-semibold text-base">
              {payment.donatedto}
            </span>
          </div>
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${color.bg} ${color.text} mb-1`}
          >
            {payment.status}
          </span>
        </div>
        <div className="flex flex-col items-end min-w-[120px] mt-4 md:mt-0">
          <span className="text-lg font-bold text-[#694F8E]">
            ₹{payment.amount ? payment.amount.toLocaleString() : "-"}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {new Date(payment.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

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
      } catch {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentHistory();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFFF] via-[#EDE7FF] to-[#D1C4E9] flex items-center justify-center py-16 px-2 relative overflow-hidden">
      {/* Confetti for successful donations */}
      {payments.length > 0 &&
        payments.some((p) => p.status === "success") && <Confetti />}
      <div className="w-full max-w-3xl mx-auto relative z-20">
        <MotivationalQuote />
        <DonationIllustration />
        {!loading && payments.length > 0 && <DonationStats payments={payments} />}
        <div className="bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl px-0 py-10 md:p-10 border border-[#EDE7FF] glass-card animate-fadeInUp">
          <h2 className="text-2xl font-bold text-[#694F8E] mb-8 px-8">
            Donation History
          </h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
              <div className="w-12 h-12 border-4 border-[#B39DDB] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-[#694F8E] font-medium">
                Loading your donation history...
              </p>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
              <svg
                width="60"
                height="60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#B39DDB"
                className="mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 0C7.582 4 4 7.582 4 12c0 4.418 3.582 8 8 8s8-3.582 8-8c0-4.418-3.582-8-8-8z"
                />
              </svg>
              <p className="text-center text-[#694F8E] text-lg italic mb-6">
                No donation history found.
                <br />
                Start making a difference today!
              </p>
              <a
                href="/causes"
                className="inline-block bg-gradient-to-r from-[#694F8E] to-[#B39DDB] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
              >
                Start Donating
              </a>
            </div>
          ) : (
            <div className="px-4 md:px-8">
              <div className="flex flex-col">
                {payments.map((payment, idx) => (
                  <TimelineItem
                    key={payment._id}
                    payment={payment}
                    isLast={idx === payments.length - 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Animations & Glassmorphism */}
      <style>{`
        .glass-card {
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          border-radius: 2rem;
          border: 1px solid rgba(255,255,255,0.18);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentHistory;