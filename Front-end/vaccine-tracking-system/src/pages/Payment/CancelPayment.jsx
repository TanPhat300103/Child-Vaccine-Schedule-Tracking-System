import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/common/Header";

const CancelPayment = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const [headerClass, setHeaderClass] = useState(""); // New state for header class
  const location = useLocation();

  useEffect(() => {
    // Lấy các tham số từ URL query string
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    const amount = params.get("amount");
    const bankCode = params.get("bankCode");
    const orderInfo = params.get("orderInfo");
    const transactionNo = params.get("transactionNo");
    const status = params.get("status");

    // Kiểm tra và hiển thị thông báo dựa trên status
    if (status === "SUCCESS") {
      setStatusMessage("Thành công");
      setStatusClass("bg-green-50 text-green-600");
      setHeaderClass("bg-green-600 text-white"); // Set header for success
    } else if (status === "FAIL") {
      setStatusMessage("Bị hủy");
      setStatusClass("bg-red-50 text-red-600");
      setHeaderClass("bg-red-600 text-white"); // Set header for failure
    }

    // Set thông tin hóa đơn
    setPaymentDetails({
      orderId,
      amount,
      bankCode,
      orderInfo,
      transactionNo,
      status,
    });
  }, [location]);

  if (!paymentDetails) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-15">
          {/* Header */}
          <div className={`${headerClass} p-6`}>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{statusMessage}</h1>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Thông Tin Hóa Đơn
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-gray-600">Mã Đơn Hàng:</p>
                    <p className="font-medium">{paymentDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Giá Trị Đơn Hàng:</p>
                    <p className="font-medium">
                      {parseInt(paymentDetails.amount).toLocaleString()} VND
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mã Ngân Hàng:</p>
                    <p className="font-medium">{paymentDetails.bankCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Thông Tin Đơn Hàng:</p>
                    <p className="font-medium">
                      {decodeURIComponent(paymentDetails.orderInfo)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số Giao Dịch:</p>
                    <p className="font-medium">
                      {paymentDetails.transactionNo || "Không có"}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${statusClass}`}>
                <div className="text-center">
                  <span className="text-xl font-semibold">{statusMessage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPayment;
