import React, { useEffect, useState } from "react";
import { FaSyringe, FaUpload, FaTimes } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { comment } from "postcss";
import { toast } from "react-toastify";
import { postFeedback } from "../../apis/api";
import { useAuth } from "../../components/common/AuthContext";
const PaymentVnpay = () => {
  const [formData, setFormData] = useState({
    ranking: "",
    comment: "",
    bookingId: "",
  });
  const { userInfo } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [proFileData, setProFileData] = useState(null);
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const data = fetch("http://localhost:8080/auth/myprofile", {
      method: "GET",
      credentials: "include", // Gửi cookie/session
    })
      .then((response) => {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
      });
    setProFileData(data);
    console.log("my profile data: ", proFileData);
  }, []);
  // take data
  console.log("user id la: ", userInfo.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case "phone":
        newErrors.phone = /^[0-9]{10}$/.test(value)
          ? ""
          : "Số điện thoại không hợp lệ";
        break;
      case "email":
        newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email không hợp lệ";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert("Chỉ được tải lên tối đa 3 ảnh");
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const navigate = useNavigate();
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    if (validateForm()) {
      setIsLoading(true);
      const loadingToast = toast.loading("Đang đặt lịch, vui lòng chờ...");
      console.log("Loading form...");
      try {
        const payload = {
          booking: {
            bookingId: "C001-B1",
          },
          ranking: formData.ranking,
          comment: formData.comment,
        };
        const params = {
          paymentId: "P-C001-B10",
          coupon: "DISCOUNT2025",
          method: "FALSE",
          bank: "VietinBank",
        };

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

        console.log("API Response:", result);
        if (result.success) {
          toast.update(loadingToast, {
            render: "Đặt lịch thành công!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          // Chuyển vaccineComboId và childId qua trang tiếp theo
          navigate("/customer", {});
        } else {
          toast.update(loadingToast, {
            render: result.message || "Đặt lịch thất bại. Vui lòng thử lại.",
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h1 className="text-xl font-bold mb-4 text-center">Create Feedback</h1>
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Submit
          </button>
        </form>
        <button
          onClick={() => navigate("/vnpay")}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default PaymentVnpay;
