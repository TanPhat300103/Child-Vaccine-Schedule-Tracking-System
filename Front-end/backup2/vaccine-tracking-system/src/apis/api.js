import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer`);
    console.log("API Response (Get Users):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const postUsers = async (formData) => {
  console.log("Form data being sent to API:", formData); // In dữ liệu gửi đi
  try {
    const response = await axios.post(`${API_BASE_URL}/customer/create`, {
      phoneNumber: formData.phoneNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      gender: formData.gender,
      password: formData.password,
      address: formData.address,
      banking: formData.banking,
      email: formData.email,
      // roleId: formData.roleId,
      // active: formData.active,
    });

    // In ra status code trả về từ backend
    console.log("API Response Status:", response.status); // Status code
    console.log("API Response Data:", response.data); // Dữ liệu trả về

    if (response.status === 200) {
      return { success: true, message: "Đăng ký thành công" };
    } else {
      return {
        success: false,
        message: "Đăng ký thất bại",
      };
    }
  } catch (error) {
    console.error("Error during registration:", error);

    if (error.response) {
      // In chi tiết về status và dữ liệu lỗi từ backend
      console.error("Error response status:", error.response.status); // In status code
      console.error("Error response data:", error.response.data); // In dữ liệu lỗi
      console.error("Error response headers:", error.response.headers); // In headers (nếu cần)

      if (error.response.data && error.response.data.message) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
    }

    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};

// Schedules
export const postSchedules = async (formData) => {
  // 🚀 Log dữ liệu để kiểm tra trước khi gửi
  console.log("🚀 Form data being sent to API:", JSON.stringify(formData, null, 2));

  try {
    // ✅ Gửi đúng format theo yêu cầu của Backend
    const response = await axios.post(`${API_BASE_URL}/booking/create`, formData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // ✅ Log phản hồi từ Backend
    console.log("✅ API Response Status:", response.status);
    console.log("✅ API Response Data:", response.data);

    if (response.status === 200) {
      return { success: true, message: "Đặt lịch thành công" };
    } else {
      return { success: false, message: "Đặt lịch thất bại" };
    }
  } catch (error) {
    console.error("❌ Error during registration:", error);

    if (error.response) {
      console.error("❌ Error response status:", error.response.status);
      console.error("❌ Error response data:", error.response.data);
      console.error("❌ Error response headers:", error.response.headers);

      return {
        success: false,
        message: error.response.data?.message || "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
      };
    }

    return { success: false, message: "Gửi biểu mẫu không thành công. Vui lòng thử lại." };
  }
};

// Child
export const getChilds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/child`);
    console.log("API Response (Get Childs):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const getCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/findid`, {
      params: { id: customerId }, // Truyền ID qua query
    });

    console.log("📡 API Response (getCustomerID):", response.data);
    return response.data; // Trả về dữ liệu customerID
  } catch (error) {
    console.error(" Lỗi khi lấy customer ID:", error);
    return null; // Trả về null nếu lỗi
  }
};

export const getVaccines = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaccine`);
    console.log("API Response (Get Vaccines):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const getVaccineCombos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaccinecombo`);
    console.log("API Response (Get VaccineCombos):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const getBookingDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookingdetail`);
    console.log("API Response (Get BookingDetails):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};