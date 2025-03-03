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
  console.log("Form data being sent to API:", formData);
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
    });
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", response.data);

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
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);

      // Kiểm tra lỗi cụ thể từ backend (email đã tồn tại)
      if (error.response.data && error.response.data === "Email is exist") {
        return {
          success: false,
          message: "Email này đã được sử dụng", // Trả về thông báo lỗi cụ thể
        };
      }

      return {
        success: false,
        message:
          error.response.data ||
          "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
      };
    }

    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};

// Child
export const getChilds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/child`);
    console.log("API Response (Get Childs):", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};
export const getChildByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/child/findbycustomer`, {
      params: { id: customerId },
    });

    console.log("📡 API Response (get child by CustomerId):", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
    return null;
  }
};
//Customers
export const getCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/findid`, {
      params: { id: customerId },
    });

    console.log("📡 API Response (getCustomerId):", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
    return null;
  }
};

//Vaccine
export const getVaccines = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaccine`);
    console.log("API Response (Get Vaccines):", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const getVaccineDetail = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaccinedetail`);
    console.log("API Response (Get Vaccines Detail):", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};
export const getVaccineDetailByVaccineId = async (vaccineId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/vaccinedetail/findbyvaccine`,
      {
        params: {
          id: vaccineId,
        },
      }
    );
    console.log("API Response (Get Vaccines Detail):", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};
export const getVaccinesByAge = async (ageMin, ageMax) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaccine/findbyage`, {
      params: {
        ageMin,
        ageMax,
      },
    });

    console.log("API Response (Get Vaccines by Age):", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API:", error.message);
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const getVaccineCombos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vaccinecombo`);
    console.log("API Response (Get VaccineCombos):", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const getVaccineCombosByComboId = async (comboId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/combodetail/findcomboid?id=${comboId}`
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Bookings
export const getBookingDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookingdetail`);
    console.log("API Response (Get BookingDetails):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};

export const getBookingDetailsByBookID = async (bookingId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/bookingdetail/findbybooking`,
      {
        params: { id: bookingId }, // Truyền ID qua query
      }
    );

    console.log("📡 API Response (getCustomerID):", response.data);
    return response.data; // Trả về dữ liệu customerID
  } catch (error) {
    console.error(" Lỗi khi lấy customer ID:", error);
    return null; // Trả về null nếu lỗi
  }
};

export const getBookingByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking/findbycustomer`, {
      params: { customerId },
    });

    console.log("📡 API Response (getCustomerID):", response.data);
    return response.data;
  } catch (error) {
    console.error(" Lỗi khi lấy customer ID:", error);
    return null;
  }
};

export const postSchedules = async (formData) => {
  console.log(
    "🚀 Form data being sent to API:",
    JSON.stringify(formData, null, 2)
  );

  try {
    const response = await axios.post(
      `${API_BASE_URL}/booking/create`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // ✅ Log phản hồi từ Backend
    console.log("✅ API Response Status:", response.status);
    console.log("✅ API Response Data:", response.data);

    // Generalized success check for any 2xx status codes
    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: "Đặt lịch thành công" };
    } else {
      return { success: false, message: "Đặt lịch thất bại" };
    }
  } catch (error) {
    console.error("❌ Error during registration:", error);

    if (error.response) {
      // Error response data logging
      console.error("❌ Error response status:", error.response.status);
      console.error("❌ Error response data:", error.response.data);
      console.error("❌ Error response headers:", error.response.headers);

      // Ensure that error message is properly handled
      return {
        success: false,
        message:
          error.response.data?.message ||
          "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
      };
    }

    // If there is no response object
    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};

export const postFeedback = async (formData) => {
  console.log(
    "🚀 Form data being sent to API:",
    JSON.stringify(formData, null, 2)
  );

  try {
    const response = await axios.post(
      `${API_BASE_URL}/feedback/create`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // ✅ Log phản hồi từ Backend
    console.log("✅ API Response Status:", response.status);
    console.log("✅ API Response Data:", response.data);

    // Generalized success check for any 2xx status codes
    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: "Đặt lịch thành công" };
    } else {
      return { success: false, message: "Đặt lịch thất bại" };
    }
  } catch (error) {
    console.error("❌ Error during registration:", error);

    if (error.response) {
      // Error response data logging
      console.error("❌ Error response status:", error.response.status);
      console.error("❌ Error response data:", error.response.data);
      console.error("❌ Error response headers:", error.response.headers);

      // Ensure that error message is properly handled
      return {
        success: false,
        message:
          error.response.data?.message ||
          "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
      };
    }

    // If there is no response object
    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};

export const updateFeedback = async (formData) => {
  console.log(
    "🚀 Form data being sent to API:",
    JSON.stringify(formData, null, 2)
  );

  try {
    const response = await axios.post(
      `${API_BASE_URL}/feedback/update`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // ✅ Log phản hồi từ Backend
    console.log("✅ API Response Status:", response.status);
    console.log("✅ API Response Data:", response.data);

    // Generalized success check for any 2xx status codes
    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: "Đặt lịch thành công" };
    } else {
      return { success: false, message: "Đặt lịch thất bại" };
    }
  } catch (error) {
    console.error("❌ Error during registration:", error);

    if (error.response) {
      // Error response data logging
      console.error("❌ Error response status:", error.response.status);
      console.error("❌ Error response data:", error.response.data);
      console.error("❌ Error response headers:", error.response.headers);

      // Ensure that error message is properly handled
      return {
        success: false,
        message:
          error.response.data?.message ||
          "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
      };
    }

    // If there is no response object
    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};

export const getMedicalHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medicalhistory`);
    console.log("API Response (Get BookingDetails):", response.data); // In toàn bộ dữ liệu người dùng nhận được
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy dữ liệu người dùng");
  }
};
// payment
export const getPaymentByBookID = async (bookingId) => {
  try {
    // Hardcode dữ liệu thanh toán
    return {
      status: "Chưa thanh toán",
      amount: 0,
      customerId: "C001",
      bookingId: bookingId,
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thanh toán:", error);
    return {
      status: "Chưa thanh toán",
      amount: 0,
      customerId: "C001",
      bookingId: bookingId,
    };
  }
};

//
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

// Lấy danh sách BookingDetail theo bookingId
export const getBookingDetailByBooking = async (bookingId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/bookingdetail/findbybooking?id=${bookingId}`
    );
    console.log("API Response (Booking Details):", response.data);
    console.log("Lấy chi tiết booking thành công!");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết booking:", error);
    throw error;
  }
};

// Huỷ đặt lịch
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/booking/cancel?bookingId=${bookingId}`
    );
    console.log("API Response (cancelBooking):", response.data);
    console.log("Huỷ booking thành công.");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi huỷ booking:", error);
    throw error;
  }
};

// Đặt lại đặt lịch (Reschedule - cập nhật trạng thái về 1)
export const rescheduleBooking = async (bookingId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/booking/setstatus?bookingId=${bookingId}&status=1`
    );
    console.log("API Response (rescheduleBooking):", response.data);
    console.log("Đặt lại booking thành công.");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đặt lại booking:", error);
    throw error;
  }
};

// Lấy thông tin payment theo bookingId
export const getPaymentByBookingID = async (bookingId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/payment/findbybooking?bookingId=${bookingId}`
    );
    console.log("API Response (Payment):", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment by booking ID:", error);
    throw error;
  }
};

// Xác nhận booking: Sử dụng endpoint confirmdate của BookingDetailController
export const confirmBooking = async (bookingId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookingdetail/confirmdate?id=${bookingId}`
    );
    console.log("API Response (confirmBooking):", response.data);
    console.log("Xác nhận booking thành công.");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xác nhận booking:", error);
    throw error;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/booking`);
    console.log("API Response (getAllBookings):", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách booking:", error);
    throw error;
  }
};
