// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Dựa trên Api-docs

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Hàm loginCustomer:
 * - Gọi API /customer/findid với query param id.
 * - Sau đó, so sánh password nhận được từ API với password người dùng nhập.
 *   (Giả sử API trả về đối tượng customer có thuộc tính password.)
 */
export const loginCustomer = async (customerId, password) => {
  try {
    const response = await apiClient.get('/customer/findid', {
      params: { id: customerId }
    });
    const customer = response.data;
    // Kiểm tra password: (Chỉ dùng cho demo; trong thực tế, xác thực nên được xử lý trên backend)
    if (customer && customer.password === password) {
      return customer; // Thành công, trả về đối tượng customer
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw error;
  }
};

export default apiClient;
