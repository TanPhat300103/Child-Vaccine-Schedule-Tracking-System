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

export const updateUser = async (formData) => {
  console.log("Form data being sent to API:", formData); // In dữ liệu gửi đi
  try {
    const response = await axios.post(`${API_BASE_URL}/customer/update`, {
      customerId: formData.customerId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: new Date(formData.dob).toISOString().split("T")[0],
      gender: formData.gender,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      password: formData.password,
      banking: formData.banking,
      roleId: formData.roleId,
      active: formData.active,
    });
    console.log("API Response Status:", response.status); // Status code
    console.log("API Response Data:", response.data); // Dữ liệu trả về

    if (response.status === 200) {
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

export const fetchCustomer = async (customerId) => {
  try {
    // Đảm bảo customerId được truyền đúng
    const response = await axios.get(
      `${API_BASE_URL}/customer/findid?id=${customerId}`
    );
    console.log("API Response (Get Customer):", response.data);
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (err) {
    console.error("Error fetching customer:", err);
    throw new Error("Không thể lấy thông tin khách hàng");
  }
};

export const fetchChildren = async (customerId) => {
  try {
    // Đảm bảo customerId được truyền đúng
    const response = await axios.get(
      `${API_BASE_URL}/child/findbycustomer?id=${customerId}`
    );
    console.log("API Response (Get Children):", response.data);
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (err) {
    console.error("Error fetching children:", err);
    throw new Error("Không thể lấy thông tin trẻ em");
  }
};

export const fetchStaff = async (staffId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/staff/findid?id=${staffId}`
    );
    console.log("API Response (Get Staff):", response.data);
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (err) {
    console.error("Error fetching staff:", err);
    throw new Error("Không thể lấy thông tin nhân viên");
  }
};

export const getStaffs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff`);
    console.log("API Response (Get Staffs):", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách nhân viên");
  }
};

export const createChild = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/child/create`, {
      customerId: formData.customerId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: new Date(formData.dob).toISOString().split("T")[0],
      gender: formData.gender,
      vaccineId: formData.vaccineId,
      vaccineDate: new Date(formData.vaccineDate).toISOString().split("T")[0],
      vaccineStatus: formData.vaccineStatus,
    });
    console.log("API Response Status:", response.status); // Status code
    console.log("API Response Data:", response.data); // Dữ liệu trả về
    return response.data;
  } catch (error) {
    console.error("Error creating child:", error);
    throw new Error("Không thể tạo trẻ em");
  }
};
