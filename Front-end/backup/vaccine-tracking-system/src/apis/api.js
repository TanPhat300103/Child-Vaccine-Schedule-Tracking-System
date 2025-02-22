import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer`);
    console.log("API Response (Get Users):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const postUser = async (formData) => {
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
      roleId: formData.roleId,
      active: formData.active,
    });

    // In ra status code trả về từ backend
    console.log("API Response Status:", response.status); // Status code
    console.log("API Response Data:", response.data); // Dữ liệu trả về

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

export const updateUser = async (id, formData) => {
  console.log("Form data being sent to API:", formData); // In dữ liệu gửi đi
  try {
    const response = await axios.put(`${API_BASE_URL}/customer/update`, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: new Date(formData.dob).toISOString().split("T")[0],
      gender: formData.gender ? "male" : "female",
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      password: formData.password,
    });
    console.log("API Response Status:", response.status); // Status code
    console.log("API Response Data:", response.data); // Dữ liệu trả về

    if (response.status === 201) {
      return { success: true, message: "Cập nhật thành công" };
    } else {
      return {
        success: false,
        message: "Cập nhật thất bại",
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
      message: "Cập nhật không thành công. Vui lòng thử lại.",
    };
  }
};

const fetchCustomer = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/customer/findid?id=${customerId}`
    );
    setCustomer(response.data);
  } catch (err) {
    console.error("Lỗi lấy thông tin khách hàng:", err);
    setError("Không thể tải thông tin khách hàng");
  }
};
