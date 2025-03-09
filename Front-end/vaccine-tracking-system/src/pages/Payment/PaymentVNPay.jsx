import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import { getMarketing, getPaymentByBookingID } from "../../apis/api";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

// Import icons
import {
  CreditCard,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Percent,
  Receipt,
} from "lucide-react";
import { FaHandPaper, FaMoneyBill, FaSpinner } from "react-icons/fa";

const PaymentVnpay = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentData, setPaymentData] = useState(null);
  const [marketingData, setMarketingData] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [isCouponValid, setIsCouponValid] = useState(false);

  const navigate = useNavigate();
  const { userInfo } = useAuth();

  // Get booking data from localStorage
  const getBookingData = () => {
    const storedData = localStorage.getItem("bookingData");
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      console.log("No data in localStorage");
      return null;
    }
  };

  const bookingDataFromStorage = getBookingData();

  const bookingDetails = {
    bookingId: bookingDataFromStorage?.bookingId || "",
    customerName: localStorage.getItem("userName") || "",
    bookingDate: bookingDataFromStorage?.bookingDate || "",
    vaccineType: "Viêm gan B",
    quantity: 2,
    totalAmount: bookingDataFromStorage?.totalAmount || 0,
  };

  const banks = [
    {
      value: "Vietcombank",
      label: "Vietcombank",
      code: "VCB",
    },
    {
      value: "NCB",
      label: "NCB",
      code: "NCB",
    },
    {
      value: "Techcombank",
      label: "Techcombank",
      code: "TCB",
    },
    {
      value: "Bidv",
      label: "BIDV",
      code: "BIDV",
    },
    {
      value: "VPBank",
      label: "VPBank",
      code: "VPB",
    },
    {
      value: "MBBank",
      label: "MB Bank",
      code: "MB",
    },
    {
      value: "TPBank",
      label: "TPBank",
      code: "TPB",
    },
    {
      value: "Agribank",
      label: "Agribank",
      code: "AGR",
    },
  ];

  // Fetch marketing data
  useEffect(() => {
    const fetchMarketing = async () => {
      try {
        const data = await getMarketing();
        setMarketingData(data);
      } catch (error) {
        console.error("Error fetching marketing data:", error.message);
      }
    };
    fetchMarketing();
  }, []);

  // Fetch payment data
  useEffect(() => {
    if (bookingDataFromStorage?.bookingId) {
      const fetchPaymentData = async () => {
        try {
          const data = await getPaymentByBookingID(
            bookingDataFromStorage.bookingId
          );
          setPaymentData(data);
        } catch (error) {
          console.error("Error fetching payment data:", error.message);
        }
      };
      fetchPaymentData();
    }
  }, [bookingDataFromStorage]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "online" && !selectedBank) {
      newErrors.bank = "Vui lòng chọn ngân hàng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle coupon validation
  const handleCouponValidation = () => {
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsValidatingCoupon(true);

    const foundCoupon = marketingData.find(
      (item) => item.coupon === couponCode
    );

    setTimeout(() => {
      if (foundCoupon) {
        setDiscount(foundCoupon.discount);
        setCoupon(foundCoupon.coupon);
        setIsCouponValid(true);
        toast.success(
          `Áp dụng mã giảm giá ${foundCoupon.discount}% thành công!`
        );
      } else {
        setDiscount(0);
        setIsCouponValid(false);
        toast.error("Mã giảm giá không hợp lệ!");
      }
      setIsValidatingCoupon(false);
    }, 800);
  };

  const totalAmount = bookingDetails.totalAmount || 0;
  const discountAmount = Math.round((totalAmount * discount) / 100);
  const finalAmount = totalAmount - discountAmount;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Đang xử lý thanh toán...");

    try {
      const params = {
        paymentId: paymentData?.paymentId,
        coupon: coupon,
        method: paymentMethod === "online" ? "TRUE" : "FALSE",
        bank: selectedBank,
      };

      const queryString = new URLSearchParams(params).toString();
      const url = `http://localhost:8080/payment/update?${queryString}`;

      const result = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      const data = await result.json();

      if (paymentMethod === "online") {
        window.location.href = data.VNPAYURL;
      } else if (data.message === "COD") {
        toast.update(loadingToast, {
          render: "Đặt lịch thành công!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        window.location.href = "/customer/payment";
      } else {
        toast.update(loadingToast, {
          render: data.message || "Đặt lịch thất bại. Vui lòng thử lại.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.update(loadingToast, {
        render: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        {/* Left Column - Booking Information */}
        <div className="lg:col-span-2 mt-15">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-blue-600 py-4 px-6">
              <h1 className="text-xl font-semibold text-white flex items-center">
                <FaHandPaper className="mr-2" />
                Thông Tin Hóa Đơn
              </h1>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Mã Booking:</p>
                  <p className="font-medium text-gray-900">
                    {bookingDetails.bookingId || "1-B4"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Ngày Booking:</p>
                  <p className="font-medium text-gray-900">
                    {bookingDetails.bookingDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Tên Khách Hàng:</p>
                  <p className="font-medium text-gray-900">
                    {bookingDetails.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Tổng Tiền:</p>
                  <p className="font-medium text-red-500">
                    {totalAmount.toLocaleString()} VND
                  </p>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-medium mb-4">
                  Phương Thức Thanh Toán
                </h2>

                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-3">
                    Mã Coupon (nếu có):
                  </p>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className={`w-full p-3 border ${
                          isCouponValid ? "border-green-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10`}
                      />
                      {isCouponValid && (
                        <CheckCircle
                          className="absolute right-3 top-3 text-green-500"
                          size={20}
                        />
                      )}
                    </div>
                    <button
                      onClick={handleCouponValidation}
                      disabled={isValidatingCoupon}
                      className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
                    >
                      {isValidatingCoupon ? (
                        <FaSpinner className="animate-spin mr-2" size={18} />
                      ) : (
                        <Percent size={18} className="mr-2" />
                      )}
                      Áp Dụng
                    </button>
                  </div>

                  {isCouponValid && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center">
                      <CheckCircle size={18} className="text-green-500 mr-2" />
                      <span className="text-green-700">
                        Mã giảm giá "T4" đã được áp dụng! Giảm {discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div>
                  <p className="text-gray-500 text-sm mb-3">
                    Chọn Phương Thức Thanh Toán:
                  </p>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center p-4 border rounded-xl cursor-pointer ${
                        paymentMethod === "online"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="form-radio text-blue-600 mr-3 h-5 w-5"
                      />
                      <CreditCard className="text-blue-600 mr-3" size={24} />
                      <div>
                        <p className="font-medium">Thanh Toán Qua Ngân Hàng</p>
                        <p className="text-sm text-gray-500">
                          Chuyển khoản qua VNPAY
                        </p>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === "online" && (
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm mb-3">
                        Chọn Ngân Hàng:
                      </p>
                      <select
                        className={`w-full p-3 border ${
                          errors.bank ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        <option value="">-- Chọn ngân hàng --</option>
                        {banks.map((bank) => (
                          <option key={bank.value} value={bank.value}>
                            {bank.label} ({bank.code})
                          </option>
                        ))}
                      </select>
                      {errors.bank && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bank}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24">
            <div className="bg-blue-600 py-4 px-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Receipt className="mr-2" />
                Tóm Tắt Thanh Toán
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng Hóa Đơn:</span>
                  <span className="font-medium">
                    {totalAmount.toLocaleString()} VND
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phần Trăm Giảm:</span>
                  <span className="font-medium">{discount}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm Giá:</span>
                  <span className="font-medium text-red-500">
                    -{discountAmount.toLocaleString()} VND
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">
                      Thanh Tiền:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {finalAmount.toLocaleString()} VND
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="p-4 bg-blue-50 rounded-lg flex items-start">
                    <CheckCircle
                      className="text-blue-500 mr-3 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <p className="text-blue-700 text-sm">
                      Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    !paymentMethod ||
                    (paymentMethod === "online" && !selectedBank)
                  }
                  className={`w-full py-4 rounded-xl text-white flex items-center justify-center mt-4 transition-colors 
    ${
      isLoading ||
      !paymentMethod ||
      (paymentMethod === "online" && !selectedBank)
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" size={20} />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>Xác Nhận Thanh Toán</span>
                      <ChevronRight size={20} className="ml-1" />
                    </>
                  )}
                </button>
                {paymentMethod === "online" && !selectedBank && !isLoading && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    Vui lòng chọn ngân hàng để tiếp tục
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentVnpay;
