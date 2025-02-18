import React, { useState, useCallback } from "react";
import { FaQrcode, FaDownload, FaCopy, FaClock } from "react-icons/fa";
import { MdPayment, MdSecurity } from "react-icons/md";
import { RiBankFill } from "react-icons/ri";

const PaymentGatewayOnline = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [copied, setCopied] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      name: "Bank Transfer",
      icon: <RiBankFill className="w-8 h-8" />,
      qrCode: "https://images.unsplash.com/photo-1582439170934-d2fbb57f6906",
      available: true,
    },
    {
      id: 2,
      name: "Zalo Pay",
      icon: <MdPayment className="w-8 h-8" />,
      qrCode: "https://images.unsplash.com/photo-1582439170934-d2fbb57f6906",
      available: true,
    },
    {
      id: 3,
      name: "Momo",
      icon: <MdPayment className="w-8 h-8" />,
      qrCode: "https://images.unsplash.com/photo-1582439170934-d2fbb57f6906",
      available: false,
    },
  ];

  const handleMethodSelect = (method) => {
    if (method.available) {
      setSelectedMethod(method);
    }
  };

  const handleCopyQR = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vaccine Payment Gateway
          </h1>
          <p className="text-gray-600">
            Secure Payment for Child Vaccination Schedule
          </p>
          <MdSecurity className="w-8 h-8 mx-auto mt-4 text-blue-500" />
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Total Amount
              </h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">$150.00</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Package: Complete Vaccination</p>
              <p className="text-sm text-gray-500 mt-1">Valid until: 24hrs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedMethod?.id === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              } ${
                method.available
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
              disabled={!method.available}
            >
              <div className="flex flex-col items-center">
                {method.icon}
                <span className="mt-4 font-medium text-gray-900">
                  {method.name}
                </span>
                {!method.available && (
                  <span className="text-sm text-red-500 mt-2">
                    Currently Unavailable
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedMethod && (
          <div className="animate-fade-in">
            <div className="text-center p-8 border-2 border-blue-100 rounded-xl bg-white">
              <h3 className="text-xl font-semibold mb-4">
                Scan QR Code to Pay
              </h3>
              <div className="relative inline-block">
                <img
                  src={selectedMethod.qrCode}
                  alt="QR Code"
                  className="w-64 h-64 mx-auto rounded-lg"
                />
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={() => window.open(selectedMethod.qrCode, "_blank")}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaDownload className="mr-2" /> Download
                  </button>
                  <button
                    onClick={handleCopyQR}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaCopy className="mr-2" /> {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center text-gray-500">
                <FaClock className="mr-2" />
                <span>QR Code expires in 15 minutes</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <MdSecurity className="mr-2" />
            Secured by SSL Encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayOnline;
