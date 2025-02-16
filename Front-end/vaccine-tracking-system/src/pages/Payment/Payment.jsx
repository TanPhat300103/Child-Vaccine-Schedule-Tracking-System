import React, { useState } from "react";
import { BiQrScan } from "react-icons/bi";
import { FaHistory } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

const PaymentGateway = () => {
  const [selectedMethod, setSelectedMethod] = useState("momo");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    purpose: "",
  });

  const paymentMethods = [
    {
      id: "momo",
      name: "MoMo",
      icon: "https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0=w240-h480-rw",
      color: "bg-pink-500",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: "https://imgs.search.brave.com/rfY93YyvfENY_jDt7P1JEAD62kaofoSQQKSZu0P5OPA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4w/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvZWxhc3RvLW9u/bGluZS1zdG9yZS8y/Ni8wMC1FTEFTVE9G/T05ULVNUT1JFLVJF/QURZX2JhbmstNTEy/LnBuZw",
      color: "bg-blue-500",
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      icon: "https://imgs.search.brave.com/kuhBYYOS4Of87j8gT-3_ICF8ostGBgC9AdowOIkC1c8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS93b1lBelBDRzFJ/OFo4SFhDc2RIM2Rp/TDdvbHkwTjh1dGhf/MWc2azdSXzlHdTds/Ynhyc1llcmlFWExl/Y1JHMkU5clAwPXcy/NDAtaDQ4MC1ydw",
      color: "bg-cyan-500",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment processing...", {
      method: selectedMethod,
      ...formData,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 py-6 px-4 sm:px-6">
            <h1 className="text-2xl font-bold text-yellow-300 text-center">
              Vietnamese Payment Gateway
            </h1>
          </div>

          <div className="p-6 space-y-8">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`${
                    selectedMethod === method.id
                      ? "ring-2 ring-yellow-400"
                      : "hover:bg-gray-50"
                  } p-4 rounded-lg border transition-all flex items-center space-x-3`}
                >
                  <img
                    src={method.icon}
                    alt={method.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount (VND)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Purpose
                    </label>
                    <textarea
                      name="purpose"
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-yellow-300 py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </div>

              {/* QR Code and Instructions */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <BiQrScan className="w-6 h-6 text-gray-600" />
                    <h3 className="text-lg font-medium">Scan QR Code</h3>
                  </div>
                  <div className="aspect-square bg-white p-4 rounded-lg border flex items-center justify-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <img
                        src="https://img.freepik.com/premium-vector/qr-code-icon-qr-code-sample-icon-abstract-style-white-background-qr-code-scanner-blac-scan-code-business-illustration-bar-code-icon-line-symbol-modern-vector-illustration-eps-10_564974-442.jpg"
                        alt="QR Code"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Open your payment app and scan this QR code to proceed
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border rounded-md hover:bg-gray-50">
                    <FaHistory className="w-5 h-5 text-gray-600" />
                    <span>History</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border rounded-md hover:bg-gray-50">
                    <MdSecurity className="w-5 h-5 text-gray-600" />
                    <span>Security</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
