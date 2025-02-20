import axios from "axios";

// const API_BASE_URL = "https://67aa281d65ab088ea7e5d7ab.mockapi.io";
const API_BASE_URL = "http://localhost:8080";

export const getUsers = async () => {
  try {
    // const response = await axios.get(`${API_BASE_URL}/user`);
    const response = await axios.get(`${API_BASE_URL}/customer`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const postUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customer/create`, {
      customerId: formData.customerId,
      phoneNumber: formData.phoneNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      gender: formData.gender,
      password: formData.password,
      address: formData.address,
      banking: formData.banking,
      email: formData.email,
      roleId: formData.roleId,
      active: formData.active,
    });

    console.log(response); // In toàn bộ phản hồi từ backend

    if (response.status === 201) {
      return { success: true, message: "Đăng ký thành công" };
    } else {
      return {
        success: false,
        message: "Đăng ký thất bại",
      };
    }
  } catch (error) {
    console.error("Error during registration:", error);

    // In chi tiết lỗi từ backend (nếu có)
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      // Nếu có lỗi liên quan đến số điện thoại đã tồn tại, hiển thị thông báo cụ thể
      if (error.response.data && error.response.data.message) {
        return {
          success: false,
          message: error.response.data.message, // Lấy thông báo lỗi từ backend
        };
      }
    }

    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};
