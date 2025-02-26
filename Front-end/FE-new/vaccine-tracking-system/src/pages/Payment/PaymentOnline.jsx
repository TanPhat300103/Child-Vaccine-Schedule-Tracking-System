import React, { useState, useCallback, useEffect } from "react";
import { FaDownload, FaCopy, FaClock } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

const PaymentGatewayOnline = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [copied, setCopied] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      name: "Chuyển Khoản Ngân Hàng",
      logo: "https://static.vecteezy.com/system/resources/previews/013/948/616/non_2x/bank-icon-logo-design-vector.jpg", // Link logo
      qrCode:
        "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
      available: true,
    },
    {
      id: 2,
      name: "Zalo Pay",
      logo: "https://play-lh.googleusercontent.com/woYAzPCG1I8Z8HXCsdH3diL7oly0N8uth_1g6k7R_9Gu7lbxrsYeriEXLecRG2E9rP0", // Link logo Zalo Pay
      qrCode:
        "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
      available: true,
    },
    {
      id: 3,
      name: "Momo",
      logo: "https://developers.momo.vn/v3/vi/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png", // Link logo Momo
      qrCode:
        "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
      available: true, // Momo giờ sẽ luôn có sẵn giống Zalo Pay
    },
  ];

  // Set mặc định là "Chuyển Khoản Ngân Hàng"
  useEffect(() => {
    setSelectedMethod(paymentMethods[0]);
  }, []);

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
            Cổng Thanh Toán Vắc-Xin
          </h1>
          <p className="text-gray-600">
            Thanh toán an toàn cho lịch tiêm chủng cho trẻ
          </p>
          <MdSecurity className="w-8 h-8 mx-auto mt-4 text-blue-500" />
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Tổng Số Tiền
              </h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">207.000đ</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Gói: Tiêm Chủng Hoàn Chỉnh</p>
              <p className="text-sm text-gray-500 mt-1">Hạn sử dụng: 24 giờ</p>
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
                <img
                  src={method.logo}
                  alt={method.name}
                  className="w-16 h-16 object-contain transition-all duration-300 hover:scale-110"
                />
              </div>
            </button>
          ))}
        </div>

        {selectedMethod && (
          <div className="animate-fade-in">
            <div className="text-center p-8 border-2 border-blue-100 rounded-xl bg-white">
              <h3 className="text-xl font-semibold mb-4">
                Quét QR Code để Thanh Toán
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
                    <FaDownload className="mr-2" /> Tải Xuống
                  </button>
                  <button
                    onClick={handleCopyQR}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaCopy className="mr-2" />{" "}
                    {copied ? "Đã Sao Chép!" : "Sao Chép"}
                  </button>
                  <button
                    onClick={() => navigate("/react-vaccine")}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center text-gray-500">
                <FaClock className="mr-2" />
                <span>QR Code hết hạn sau 15 phút</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <MdSecurity className="mr-2" />
            Được bảo mật bởi mã hóa SSL
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayOnline;
