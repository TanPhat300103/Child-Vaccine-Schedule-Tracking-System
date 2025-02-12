// src/api/ApiService.jsx
import axios from "axios";

// Tạo instance của axios với Base URL từ backend Spring Boot
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 giây timeout
});

/* ======================================
   CUSTOMER ENDPOINTS
====================================== */

/**
 * Update customer (POST /customer/update)
 * @param {Object} customerData - Dữ liệu customer theo cấu trúc yêu cầu
 * @returns {Promise<Object>} - Customer object trả về
 */
export const updateCustomer = async (customerData) => {
  try {
    const response = await apiClient.post("/customer/update", customerData);
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

/**
 * Inactive customer (POST /customer/inactive)
 * @param {string} id - ID của customer cần làm inactive
 * @returns {Promise<Object>} - Customer object trả về
 */
export const inactiveCustomer = async (id) => {
  try {
    const response = await apiClient.post("/customer/inactive", null, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error inactivating customer:", error);
    throw error;
  }
};

/**
 * Create customer (POST /customer/create)
 * @param {Object} customerData - Dữ liệu customer theo cấu trúc yêu cầu
 * @returns {Promise<Object>} - Customer object trả về
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post("/customer/create", customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

/**
 * Get list of customers (GET /customer)
 * @returns {Promise<Array>} - Mảng các Customer objects
 */
export const getCustomers = async () => {
  try {
    const response = await apiClient.get("/customer");
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

/**
 * Find customer by id (GET /customer/findid)
 * @param {string} id - ID của customer cần tìm
 * @returns {Promise<Object>} - Customer object trả về
 */
export const findCustomerById = async (id) => {
  try {
    const response = await apiClient.get("/customer/findid", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error finding customer by id:", error);
    throw error;
  }
};

/**
 * Delete customer (DELETE /customer/delete)
 * @param {string} id - ID của customer cần xóa
 * @returns {Promise<boolean>} - True nếu thành công
 */
export const deleteCustomer = async (id) => {
  try {
    await apiClient.delete("/customer/delete", {
      params: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

/* ======================================
   CHILD ENDPOINTS
====================================== */

/**
 * Update child (POST /child/update)
 * @param {Object} childData - Dữ liệu child theo cấu trúc yêu cầu
 * @returns {Promise<Object>} - Child object trả về
 */
export const updateChild = async (childData) => {
  try {
    const response = await apiClient.post("/child/update", childData);
    return response.data;
  } catch (error) {
    console.error("Error updating child:", error);
    throw error;
  }
};

/**
 * Create child (POST /child/create)
 * @param {Object} childData - Dữ liệu child theo cấu trúc yêu cầu (giống update)
 * @returns {Promise<Object>} - Child object trả về
 */
export const createChild = async (childData) => {
  try {
    const response = await apiClient.post("/child/create", childData);
    return response.data;
  } catch (error) {
    console.error("Error creating child:", error);
    throw error;
  }
};

/**
 * Activate child (POST /child/active)
 * @param {string} id - ID của child cần active
 * @returns {Promise<Object>} - Child object trả về
 */
export const activeChild = async (id) => {
  try {
    const response = await apiClient.post("/child/active", null, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error activating child:", error);
    throw error;
  }
};

/**
 * Get list of children (GET /child)
 * @returns {Promise<Array>} - Mảng các Child objects
 */
export const getChildren = async () => {
  try {
    const response = await apiClient.get("/child");
    return response.data;
  } catch (error) {
    console.error("Error fetching children:", error);
    throw error;
  }
};

/**
 * Find child by id (GET /child/findid)
 * @param {string} id - ID của child cần tìm
 * @returns {Promise<Object>} - Child object trả về
 */
export const findChildById = async (id) => {
  try {
    const response = await apiClient.get("/child/findid", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error finding child by id:", error);
    throw error;
  }
};

/**
 * Find children by customer (GET /child/findbycustomer)
 * @param {string} id - ID của customer
 * @returns {Promise<Array>} - Mảng các Child objects
 */
export const findChildrenByCustomer = async (id) => {
  try {
    const response = await apiClient.get("/child/findbycustomer", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching children by customer:", error);
    throw error;
  }
};

/**
 * Delete child (DELETE /child/delete)
 * @param {string} id - ID của child cần xóa
 * @returns {Promise<boolean>} - True nếu thành công
 */
export const deleteChild = async (id) => {
  try {
    await apiClient.delete("/child/delete", {
      params: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting child:", error);
    throw error;
  }
};

export default apiClient;
