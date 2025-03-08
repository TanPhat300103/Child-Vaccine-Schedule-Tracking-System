import React, { useEffect, useState } from "react";
import { FaCreditCard, FaMoneyBill, FaSpinner } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { MdLocalHospital, MdOutlineDiscount } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import { getMarketing, getPaymentByBookingID } from "../../apis/api";

const PaymentVnpay = () => {
  const [paymentMethod, setPaymentMethod] = useState("direct");
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setErrors] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [marketingData, setMarketingData] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  function getBookingData() {
    const storedData = localStorage.getItem("bookingData"); // Lấy dữ liệu từ localStorage
    const userName = localStorage.getItem("userName"); // Lấy dữ liệu từ localStorage

    if (storedData) {
      return JSON.parse(storedData); // Chuyển đổi dữ liệu JSON thành đối tượng JavaScript
    } else {
      console.log("Không có dữ liệu trong localStorage");
      return null; // Trả về null nếu không có dữ liệu
    }
  }
  console.log("usurinfo: ", userInfo);
  const bookingDataFromStorage = getBookingData();
  console.log("Dữ liệu lấy từ localStorage:", bookingDataFromStorage);

  const bookingDetails = {
    customerName: localStorage.getItem("userName"),
    bookingDate: bookingDataFromStorage.bookingDate,
    vaccineType: "Viêm gan B",
    quantity: 2,
    pricePerUnit: bookingDataFromStorage.totalAmount,
  };

  const banks = [
    {
      value: "Vietcombank",
      label: "VCB",
      icon: "https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-11.png",
    },
    {
      value: "Techcombank",
      label: "TCB",
      icon: "https://plus.vtc.edu.vn/wp-content/uploads/2020/09/techcombank.png",
    },
    {
      value: "Bidv",
      label: "BIDV",
      icon: "https://diadiembank.com/wp-content/uploads/2024/11/icon-bidv-smartbanking.svg",
    },
    {
      value: "VPBank",
      label: "VPBank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd&AQ6RwsYuDPp1ZlmeUwSBcdMZFmNFgcDplEDxJcig&s",
    },
    {
      value: "MBBank",
      label: "MBBank",
      icon: "https://www.mbbank.com.vn/images/logo.png",
    },
    {
      value: "TPBank",
      label: "TPBank",
      icon: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-TPBank.png",
    },
    {
      value: "NCB",
      label: "NCB",
      icon: "https://uudai.ncb-bank.vn/images/common/logo_loading.png",
    },
    {
      value: "Agribank",
      label: "Agribank",
      icon: "https://www.inlogo.vn/wp-content/uploads/2023/04/logo-agribank.png",
    },
    {
      value: "Eximbank",
      label: "Eximbank",
      icon: "https://image.sggp.org.vn/w1000/Uploaded/2025/nkdkswkqoc/original/2012/01/images406537_1.jpg.webp",
    },
    {
      value: "Scb",
      label: "SCB",
      icon: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-SCB.png",
    },
  ];
  useEffect(() => {
    const fetchMarketing = async () => {
      try {
        const data = await getMarketing();
        console.log("data: ", data);
        setMarketingData(data);
        console.log("marketing data: ", marketingData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchMarketing();
  }, []);
  useEffect(() => {
    console.log("marketingData đã được cập nhật: ", marketingData);
  }, [marketingData]); // Log khi marketingData thay đổi
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra nếu ngày đặt lịch không được để trống
    if (true) {
    }

    // // Kiểm tra các trường khác
    // if (!formData.vaccineId.length && !formData.vaccineComboId.length) {
    //   newErrors.vaccineId = "Vui lòng chọn vắc-xin hoặc combo vắc-xin";
    // }
    // if (!formData.childId) newErrors.childId = "Vui lòng chọn trẻ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    const fetchMarketingId = async () => {
      try {
        const data = await getPaymentByBookingID(
          bookingDataFromStorage.bookingId
        );
        console.log("datapayment: ", data.paymentId);
        setPaymentData(data);
        console.log("setPaymentData: ", paymentData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchMarketingId();
  }, []);

  const handleCouponValidation = () => {
    setIsLoading(true);
    const foundCoupon = marketingData.find(
      (item) => item.coupon === couponCode
    );

    if (foundCoupon) {
      // Nếu tìm thấy coupon, áp dụng discount
      setDiscount(foundCoupon.discount);
      console.log("foundcounpon: ", foundCoupon.discount);
      setCoupon(foundCoupon.coupon);
    } else {
      // Nếu không tìm thấy coupon hợp lệ
      setDiscount(0);
      alert("Mã giảm giá không hợp lệ!");
    }
    setTimeout(() => {
      if (couponCode === foundCoupon.coupon) {
        setDiscount(foundCoupon.discount);
      } else {
        setDiscount(0);
        alert("Mã giảm giá không hợp lệ!");
      }
      setIsLoading(false);
    }, 1000);
  };

  const totalAmount = bookingDetails.pricePerUnit;
  const discountedAmount = totalAmount - (totalAmount * discount) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    if (validateForm()) {
      setIsLoading(true);
      const loadingToast = toast.loading("Đang đặt lịch, vui lòng chờ...");
      console.log("Loading form...");
      try {
        const params = {
          paymentId: paymentData.paymentId,
          coupon: coupon,
          method: paymentMethod === "online" ? "TRUE" : "FALSE",
          bank: selectedBank,
        };
        console.log("param: ", params);
        // Chuyển object params thành query string đúng chuẩn
        const queryString = new URLSearchParams(params).toString();

        // Tạo URL chuẩn
        const url = `http://localhost:8080/payment/update?${queryString}`;

        console.log("Generated URL:", url);

        // Gọi API
        const result = await fetch(url, {
          method: "POST",
          credentials: "include",
        });
        const data = await result.json();
        const { VNPAYURL } = data;
        console.log("vnpayurl: ", VNPAYURL);
        console.log("API Response:", data);

        if (paymentMethod === "online") {
          // Điều hướng tới trang /vnpay
          window.location.href = VNPAYURL;
        } else if (data.message === "COD") {
          // Kiểm tra thành công
          toast.update(loadingToast, {
            render: "Đặt lịch thành công!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          // Navigate to /customer

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
        console.error("Lỗi khi gửi dữ liệu:", error);
        toast.update(loadingToast, {
          render: "Đã có lỗi xảy ra. Vui lòng thử lại.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center">
            <MdLocalHospital className="text-3xl mr-2" />
            <h1 className="text-2xl font-bold">Thanh Toán Tiêm Chủng</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Thông Tin Đặt Lịch</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-gray-600">Khách hàng:</p>
                  <p className="font-medium">{bookingDetails.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ngày đặt:</p>
                  <p className="font-medium">{bookingDetails.bookingDate}</p>
                </div>

                <div>
                  <p className="text-gray-600">Số lượng:</p>
                  <p className="font-medium">{bookingDetails.quantity}</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Mã Giảm Giá</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleCouponValidation}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <MdOutlineDiscount />
                  )}
                  <span className="ml-2">Áp dụng</span>
                </button>
              </div>
            </div>

            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">
                Phương Thức Thanh Toán
              </h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="direct"
                    checked={paymentMethod === "direct"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <FaMoneyBill className="text-green-600" />
                  <span>Thanh toán trực tiếp</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <FaCreditCard className="text-blue-600" />
                  <span>Thanh toán online</span>
                </label>

                {paymentMethod === "online" && (
                  <div className="mt-4">
                    <select
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      {banks.map((bank) => (
                        <option key={bank.value} value={bank.value}>
                          <img
                            src={bank.icon}
                            alt={bank.label}
                            className="inline-block mr-2 w-6 h-6"
                          />
                          {bank.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-medium">
                  {totalAmount.toLocaleString()}đ
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Giảm giá ({discount}%):</span>
                  <span className="font-medium text-green-600">
                    -{((totalAmount * discount) / 100).toLocaleString()}đ
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Thành tiền:</span>
                <span className="text-blue-600">
                  {discountedAmount.toLocaleString()}đ
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <BsBank2 className="mr-2" />
              )}
              Xác Nhận Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVnpay;
