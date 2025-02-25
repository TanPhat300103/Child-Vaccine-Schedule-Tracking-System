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
// Tạo mới nhân viên (Staff)
export const createStaff = async (formData) => {
  console.log("Form data being sent to API (createStaff):", formData);
  try {
    const response = await axios.post(`${API_BASE_URL}/staff/create`, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phoneNumber, // Chuyển từ phoneNumber sang phone
      dob: new Date(formData.dob).toISOString(), // Gửi dạng ISO
      address: formData.address,
      mail: formData.email, // Chuyển từ email sang mail
      password: formData.password,
      roleId: formData.roleId,
      active: formData.active,
    });
    console.log("API Response Status (createStaff):", response.status);
    console.log("API Response Data (createStaff):", response.data);
    if (response.status === 200) {
      return { success: true, message: "Tạo nhân viên thành công" };
    } else {
      return { success: false, message: "Tạo nhân viên thất bại" };
    }
  } catch (error) {
    console.error("Error creating staff:", error);
    if (error.response && error.response.data && error.response.data.message) {
      return { success: false, message: error.response.data.message };
    }
    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};

// Cập nhật nhân viên (Staff)
export const updateStaff = async (formData) => {
  const payload = {
    staffId: formData.staffId,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phoneNumber, // Đổi từ phoneNumber thành phone
    dob: new Date(formData.dob).toISOString(), // Định dạng ISO (VD: "1990-02-02T00:00:00.000Z")
    address: formData.address,
    mail: formData.email, // Đổi từ email thành mail
    password: formData.password,
    roleId: formData.roleId,
    active: formData.active,
  };

  console.log("Payload being sent to API (updateStaff):", payload);

  try {
    const response = await axios.post(`${API_BASE_URL}/staff/update`, payload);
    console.log("API Response Status (updateStaff):", response.status);
    console.log("API Response Data (updateStaff):", response.data);
    if (response.status === 200 || response.status === 201) {
      return { success: true, message: "Cập nhật nhân viên thành công" };
    } else {
      return { success: false, message: "Cập nhật nhân viên thất bại" };
    }
  } catch (error) {
    console.error("Error updating staff:", error);
    if (error.response && error.response.data && error.response.data.message) {
      return { success: false, message: error.response.data.message };
    }
    return {
      success: false,
      message: "Cập nhật không thành công. Vui lòng thử lại.",
    };
  }
};

// Xóa nhân viên (Staff)
export const deleteStaff = async (staffId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/staff/inactive?id=${staffId}`
    );
    console.log("API Response Status (deleteStaff):", response.status);
    console.log("API Response Data (deleteStaff):", response.data);
    if (response.status === 200 || response.status === 204) {
      return { success: true, message: "Xóa nhân viên thành công" };
    } else {
      return { success: false, message: "Xóa nhân viên thất bại" };
    }
  } catch (error) {
    console.error("Error deleting staff:", error);
    if (error.response && error.response.data && error.response.data.message) {
      return { success: false, message: error.response.data.message };
    }
    return {
      success: false,
      message: "Không thể xóa nhân viên. Vui lòng thử lại.",
    };
  }
};

export const createChild = async (formData) => {
  try {
    console.log("Form data being sent to API (createChild):", formData);
    const response = await axios.post(`${API_BASE_URL}/child/create`, formData);
    console.log("API Response Status:", response.status); // Status code
    console.log("API Response Data:", response); // Dữ liệu trả về
    if (response.status === 200) {
      return { success: true, message: "Tạo trẻ em thành công" };
    } else {
      return {
        success: false,
        message: "Tạo trẻ em thất bại",
      };
    }
  } catch (error) {
    console.error("Error creating child:", error);
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
export const deleteUser = async (id) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customer/inactive?id=${id}`
    );

    console.log("API Response Status:", response.status);
    console.log("API Response Data:", response.data);

    if (response.status === 200 || response.status === 204) {
      return { success: true, message: "Xóa người dùng thành công" };
    } else {
      return { success: false, message: "Xóa người dùng thất bại" };
    }
  } catch (error) {
    console.error("Error deleting user:", error);

    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      if (error.response.data && error.response.data.message) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
    }
    return {
      success: false,
      message: "Không thể xóa người dùng. Vui lòng thử lại.",
    };
  }
};

export const updateChild = async (formData) => {
  try {
    // Giả sử BE dùng endpoint /child/update với method POST
    console.log("Payload being sent to API (updateChild):", formData);
    const response = await axios.post(`${API_BASE_URL}/child/update`, formData);
    console.log("API Response Status (updateChild):", response.status);
    console.log("API Response Data (updateChild):", response.data);
    if (response.status === 200 || response.status === 201) {
      return { success: true, message: "Cập nhật trẻ em thành công" };
    } else {
      return { success: false, message: "Cập nhật trẻ em thất bại" };
    }
  } catch (error) {
    console.error("Error updating child:", error);
    if (error.response && error.response.data && error.response.data.message) {
      return { success: false, message: error.response.data.message };
    }
    return {
      success: false,
      message: "Cập nhật không thành công. Vui lòng thử lại.",
    };
  }
};

// Xóa hồ sơ trẻ em
export const deleteChild = async (childId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/child/inactive?id=${childId}`
    );
    console.log("API Response Status (deleteChild):", response.status);
    console.log("API Response Data (deleteChild):", response.data);
    if (response.status === 200 || response.status === 204) {
      return { success: true, message: "Xóa trẻ em thành công" };
    } else {
      return { success: false, message: "Xóa trẻ em thất bại" };
    }
  } catch (error) {
    console.error("Error deleting child:", error);
    if (error.response && error.response.data && error.response.data.message) {
      return { success: false, message: error.response.data.message };
    }
    return {
      success: false,
      message: "Không thể xóa trẻ em. Vui lòng thử lại.",
    };
  }
};

export const getBookingByCustomer = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/findbycustomer`, {
      params: { id: customerId },
    });
    console.log("API Response (Get Booking By Customer):", response.data);
    return response.data; // Trả về mảng booking
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Không thể lấy thông tin đặt lịch");
  }
};

export const getChild = async (childId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/child/findid`, {
      params: { id: childId },
    });
    console.log("API Response (Get Child):", response.data);
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Error fetching child:", error);
    throw new Error("Không thể lấy thông tin trẻ em"); // Đảm bảo trả về thông báo lỗi
  }
};
