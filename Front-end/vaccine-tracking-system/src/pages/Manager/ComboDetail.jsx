import React, { useEffect, useState } from "react";
import axios from "axios";

const ComboDetail = () => {
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComboDetails();
  }, []);

  const fetchComboDetails = async () => {
    try {
      // Điều chỉnh URL cho phù hợp với backend của bạn
      const response = await axios.get("http://localhost:8080/combodetail");
      setComboDetails(response.data);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải danh sách Combo Detail...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Danh sách Combo Detail</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Mã Combo Detail</th>
            <th>Tên Vaccine Combo</th>
            <th>Mô tả Vaccine Combo</th>
            <th>Tên Vaccine</th>
            <th>Số liều</th>
            <th>Giá</th>
            <th>Mô tả Vaccine</th>
          </tr>
        </thead>
        <tbody>
          {comboDetails.map((item) => (
            <tr key={item.comboDetailId}>
              <td>{item.comboDetailId}</td>
              <td>{item.vaccineCombo?.name}</td>
              <td>{item.vaccineCombo?.description}</td>
              <td>{item.vaccine?.name}</td>
              <td>{item.vaccine?.doseNumber}</td>
              <td>{item.vaccine?.price}</td>
              <td>{item.vaccine?.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComboDetail;
