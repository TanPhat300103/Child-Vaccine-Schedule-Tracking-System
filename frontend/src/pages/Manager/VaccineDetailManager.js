import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FaEdit, FaPowerOff } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../style/VaccineDetailManager.css";

// --- Component VaccineDetailItem ---
const VaccineDetailItem = ({ detail, onDetailUpdated, onToggleStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(detail.img || "");
  const [formData, setFormData] = useState({
    entryDate: detail.entryDate,
    expiredDate: detail.expiredDate,
    day: detail.day,
    tolerance: detail.tolerance,
    quantity: detail.quantity,
  });
  const [errors, setErrors] = useState({});

  const handleToggleStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinedetail/active?id=${detail.id}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Chuyển trạng thái thất bại");
      }
      const data = await response.json();
      console.log("API toggle status thành công:", data);
      onToggleStatus(detail.id, detail.status);
      toast.success("Trạng thái đã được cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi chuyển trạng thái VaccineDetail:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi chuyển trạng thái!");
    }
  };

  const validateField = (name, value, data) => {
    const newErrors = { ...errors };

    switch (name) {
      case "entryDate":
        if (!value) {
          newErrors.entryDate = "Ngày nhập là bắt buộc!";
        } else {
          delete newErrors.entryDate;
          const entryDate = new Date(value);
          const expiredDate = new Date(data.expiredDate);
          if (data.expiredDate && expiredDate <= entryDate) {
            newErrors.expiredDate = "Ngày hết hạn phải sau ngày nhập!";
          } else {
            delete newErrors.expiredDate;
          }
        }
        break;
      case "expiredDate":
        if (!value) {
          newErrors.expiredDate = "Ngày hết hạn là bắt buộc!";
        } else {
          const entryDate = new Date(data.entryDate);
          const expiredDate = new Date(value);
          if (data.entryDate && expiredDate <= entryDate) {
            newErrors.expiredDate = "Ngày hết hạn phải sau ngày nhập!";
          } else {
            delete newErrors.expiredDate;
          }
        }
        break;
      case "day":
        if (Number(value) <= 0) {
          newErrors.day = "Số ngày phải lớn hơn 0!";
        } else {
          delete newErrors.day;
        }
        break;
      case "tolerance":
        if (Number(value) <= 0) {
          newErrors.tolerance = "Dung sai phải lớn hơn 0!";
        } else {
          delete newErrors.tolerance;
        }
        break;
      case "quantity":
        if (Number(value) <= 0) {
          newErrors.quantity = "Số lượng phải lớn hơn 0!";
        } else {
          delete newErrors.quantity;
        }
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    const newErrors = validateField(name, value, updatedData);
    setErrors(newErrors);
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.entryDate) newErrors.entryDate = "Ngày nhập là bắt buộc!";
    if (!data.expiredDate) newErrors.expiredDate = "Ngày hết hạn là bắt buộc!";
    if (data.entryDate && data.expiredDate) {
      const entryDate = new Date(data.entryDate);
      const expiredDate = new Date(data.expiredDate);
      if (expiredDate <= entryDate) {
        newErrors.expiredDate = "Ngày hết hạn phải sau ngày nhập!";
      }
    }
    if (data.day <= 0) newErrors.day = "Số ngày phải lớn hơn 0!";
    if (data.tolerance <= 0) newErrors.tolerance = "Dung sai phải lớn hơn 0!";
    if (data.quantity <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0!";
    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedDetail = { ...detail, ...formData, img: imageUrl || null };
    const validationErrors = validateForm(updatedDetail);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log("Gửi API cập nhật với dữ liệu:", updatedDetail);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinedetail/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",

          body: JSON.stringify(updatedDetail),
        }
      );
      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }
      const data = await response.json();
      console.log("Cập nhật VaccineDetail thành công:", data);
      onDetailUpdated(data);
      setIsModalOpen(false);
      setErrors({});
      toast.success("Cập nhật lô vaccine thành công!");
    } catch (err) {
      console.error("Cập nhật lô vaccine thất bại:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật!");
    }
  };

  return (
    <>
      <div className="card-vaccinedetailmanager">
        <img
          src={detail.img || "https://via.placeholder.com/150"}
          alt={detail.vaccine?.name || "Vaccine Detail"}
          className="card-image-vaccinedetailmanager"
        />
        <h3 className="card-title-vaccinedetailmanager">
          {detail.vaccine?.name || "Không có tên vaccine"}
        </h3>
        <div className="card-content-vaccinedetailmanager">
          <p>
            <span className="font-medium-vaccinedetailmanager">ID:</span>{" "}
            {detail.id}
          </p>
          <p>
            <span className="font-medium-vaccinedetailmanager">Ngày nhập:</span>{" "}
            {detail.entryDate}
          </p>
          <p>
            <span className="font-medium-vaccinedetailmanager">
              Ngày hết hạn:
            </span>{" "}
            {detail.expiredDate}
          </p>
          <p>
            <span className="font-medium-vaccinedetailmanager">Số ngày:</span>{" "}
            {detail.day}
          </p>
          <p>
            <span className="font-medium-vaccinedetailmanager">Dung sai:</span>{" "}
            {detail.tolerance}
          </p>
          <p>
            <span className="font-medium-vaccinedetailmanager">Số lượng:</span>{" "}
            {detail.quantity}
          </p>
        </div>
        <div className="card-buttons-vaccined personallyccinedetailmanager">
          <button
            onClick={handleToggleStatus}
            className="status-button-vaccinedetailmanager"
          >
            <FaPowerOff className="icon-vaccinedetailmanager" />
            <span
              className={
                detail.status
                  ? "text-green-vaccinedetailmanager"
                  : "text-red-vaccinedetailmanager"
              }
            >
              {detail.status ? "Bật" : "Tắt"}
            </span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="edit-button-vaccinedetailmanager"
          >
            <FaEdit className="icon-vaccinedetailmanager" /> Sửa
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay-vaccinedetailmanager">
          <div className="modal-content-vaccinedetailmanager">
            <h2 className="modal-title-vaccinedetailmanager">
              Cập nhật lô vaccine
            </h2>
            <form onSubmit={handleUpdate}>
              <label className="form-label-vaccinedetailmanager">
                Ngày nhập:
                <input
                  type="date"
                  name="entryDate"
                  value={formData.entryDate}
                  onChange={handleInputChange}
                  className="form-input-vaccinedetailmanager"
                />
                {errors.entryDate && (
                  <p className="error-text-vaccinedetailmanager">
                    {errors.entryDate}
                  </p>
                )}
              </label>
              <label className="form-label-vaccinedetailmanager">
                Ngày hết hạn:
                <input
                  type="date"
                  name="expiredDate"
                  value={formData.expiredDate}
                  onChange={handleInputChange}
                  className="form-input-vaccinedetailmanager"
                />
                {errors.expiredDate && (
                  <p className="error-text-vaccinedetailmanager">
                    {errors.expiredDate}
                  </p>
                )}
              </label>
              <label className="form-label-vaccinedetailmanager">
                Số ngày:
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className="form-input-vaccinedetailmanager"
                />
                {errors.day && (
                  <p className="error-text-vaccinedetailmanager">
                    {errors.day}
                  </p>
                )}
              </label>
              <label className="form-label-vaccinedetailmanager">
                Dung sai:
                <input
                  type="number"
                  name="tolerance"
                  value={formData.tolerance}
                  onChange={handleInputChange}
                  className="form-input-vaccinedetailmanager"
                />
                {errors.tolerance && (
                  <p className="error-text-vaccinedetailmanager">
                    {errors.tolerance}
                  </p>
                )}
              </label>
              <label className="form-label-vaccinedetailmanager">
                Số lượng:
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="form-input-vaccinedetailmanager"
                />
                {errors.quantity && (
                  <p className="error-text-vaccinedetailmanager">
                    {errors.quantity}
                  </p>
                )}
              </label>
              <label className="form-label-vaccinedetailmanager">
                URL Hình ảnh:
                <input
                  type="text"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="form-input-vaccinedetailmanager"
                  placeholder="Nhập URL hình ảnh (để trống để xóa ảnh)"
                />
              </label>
              {imageUrl && (
                <div className="image-preview-vaccinedetailmanager">
                  <img
                    src={imageUrl}
                    alt="Current Vaccine Detail"
                    className="preview-image-vaccinedetailmanager"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="delete-image-button-vaccinedetailmanager"
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
              <div className="modal-buttons-vaccinedetailmanager">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-button-vaccinedetailmanager"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="submit-button-vaccinedetailmanager"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// --- Component chính VaccineDetail ---
const VaccineDetailManager = () => {
  const { vaccineId } = useParams();
  const [vaccineDetails, setVaccineDetails] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDetail, setNewDetail] = useState({
    entryDate: "",
    expiredDate: "",
    day: 0,
    tolerance: 0,
    quantity: 0,
    img: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVaccineDetails();
  }, [vaccineId]);

  const fetchVaccineDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinedetail/findbyvaccine?id=${vaccineId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Lấy dữ liệu thất bại");
      }
      const data = await response.json();
      console.log("API fetch VaccineDetail thành công:", data);
      setVaccineDetails(data);
    } catch (err) {
      console.error("Lỗi khi lấy VaccineDetail:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi lấy danh sách lô vaccine!");
    }
  };

  const handleDetailUpdated = (updatedDetail) => {
    setVaccineDetails((prev) =>
      prev.map((d) => (d.id === updatedDetail.id ? updatedDetail : d))
    );
  };

  const handleToggleStatus = (detailId, currentStatus) => {
    setVaccineDetails((prev) =>
      prev.map((d) =>
        d.id === detailId ? { ...d, status: !currentStatus } : d
      )
    );
  };

  const validateField = (name, value, data) => {
    const newErrors = { ...errors };

    switch (name) {
      case "entryDate":
        if (!value) {
          newErrors.entryDate = "Ngày nhập là bắt buộc!";
        } else {
          delete newErrors.entryDate;
          const entryDate = new Date(value);
          const expiredDate = new Date(data.expiredDate);
          if (data.expiredDate && expiredDate <= entryDate) {
            newErrors.expiredDate = "Ngày hết hạn phải sau ngày nhập!";
          } else {
            delete newErrors.expiredDate;
          }
        }
        break;
      case "expiredDate":
        if (!value) {
          newErrors.expiredDate = "Ngày hết hạn là bắt buộc!";
        } else {
          const entryDate = new Date(data.entryDate);
          const expiredDate = new Date(value);
          if (data.entryDate && expiredDate <= entryDate) {
            newErrors.expiredDate = "Ngày hết hạn phải sau ngày nhập!";
          } else {
            delete newErrors.expiredDate;
          }
        }
        break;
      case "day":
        if (Number(value) <= 0) {
          newErrors.day = "Số ngày phải lớn hơn 0!";
        } else {
          delete newErrors.day;
        }
        break;
      case "tolerance":
        if (Number(value) <= 0) {
          newErrors.tolerance = "Dung sai phải lớn hơn 0!";
        } else {
          delete newErrors.tolerance;
        }
        break;
      case "quantity":
        if (Number(value) <= 0) {
          newErrors.quantity = "Số lượng phải lớn hơn 0!";
        } else {
          delete newErrors.quantity;
        }
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...newDetail, [name]: value };
    setNewDetail(updatedData);
    const newErrors = validateField(name, value, updatedData);
    setErrors(newErrors);
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.entryDate) newErrors.entryDate = "Ngày nhập là bắt buộc!";
    if (!data.expiredDate) newErrors.expiredDate = "Ngày hết hạn là bắt buộc!";
    if (data.entryDate && data.expiredDate) {
      const entryDate = new Date(data.entryDate);
      const expiredDate = new Date(data.expiredDate);
      if (expiredDate <= entryDate) {
        newErrors.expiredDate = "Ngày hết hạn phải sau ngày nhập!";
      }
    }
    if (data.day <= 0) newErrors.day = "Số ngày phải lớn hơn 0!";
    if (data.tolerance <= 0) newErrors.tolerance = "Dung sai phải lớn hơn 0!";
    if (data.quantity <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0!";
    return newErrors;
  };

  const handleCreateDetail = async (e) => {
    e.preventDefault();
    const payload = {
      vaccine: { vaccineId: vaccineId },
      entryDate: newDetail.entryDate,
      expiredDate: newDetail.expiredDate,
      day: Number(newDetail.day) || 0,
      tolerance: Number(newDetail.tolerance) || 0,
      quantity: Number(newDetail.quantity) || 0,
      img: newDetail.img || null,
      status: true,
    };

    const validationErrors = validateForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinedetail/create`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Tạo mới thất bại");
      }
      const data = await response.json();
      console.log("Vaccine Detail created successfully:", data);
      setShowCreateModal(false);
      setNewDetail({
        entryDate: "",
        expiredDate: "",
        day: 0,
        tolerance: 0,
        quantity: 0,
        img: "",
      });
      setErrors({});
      fetchVaccineDetails();
      toast.success("Tạo mới lô vaccine thành công!");
    } catch (err) {
      console.error("Lỗi khi tạo lô vaccine:", err);
      toast.error(
        err.message || "Đã xảy ra lỗi khi tạo lô vaccine. Vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="container-vaccinedetailmanager">
      <div className="content-wrapper-vaccinedetailmanager">
        <h2 className="page-title-vaccinedetailmanager">
          Danh sách các lô vaccine cho Vaccine {vaccineId}
        </h2>
        <div className="back-button-wrapper-vaccinedetailmanager">
          <NavLink
            to="../vaccines"
            className="back-button-vaccinedetailmanager"
          >
            Quay lại Vaccine
          </NavLink>
        </div>
        <div className="create-button-wrapper-vaccinedetailmanager">
          <button
            onClick={() => setShowCreateModal(true)}
            className="create-button-vaccinedetailmanager"
          >
            Tạo mới lô vaccine
          </button>
        </div>
        {showCreateModal && (
          <div className="modal-overlay-create-vaccinedetailmanager">
            <div
              className="modal-backdrop-vaccinedetailmanager"
              onClick={() => setShowCreateModal(false)}
            ></div>
            <div className="modal-content-create-vaccinedetailmanager">
              <h3 className="modal-title-create-vaccinedetailmanager">
                Tạo mới lô vaccine
              </h3>
              <form
                onSubmit={handleCreateDetail}
                className="form-create-vaccinedetailmanager"
              >
                <label className="form-label-vaccinedetailmanager">
                  Ngày nhập:
                  <input
                    type="date"
                    name="entryDate"
                    value={newDetail.entryDate}
                    onChange={handleInputChange}
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                  {errors.entryDate && (
                    <p className="error-text-vaccinedetailmanager">
                      {errors.entryDate}
                    </p>
                  )}
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Ngày hết hạn:
                  <input
                    type="date"
                    name="expiredDate"
                    value={newDetail.expiredDate}
                    onChange={handleInputChange}
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                  {errors.expiredDate && (
                    <p className="error-text-vaccinedetailmanager">
                      {errors.expiredDate}
                    </p>
                  )}
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Số ngày:
                  <input
                    type="number"
                    name="day"
                    value={newDetail.day}
                    onChange={handleInputChange}
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                  {errors.day && (
                    <p className="error-text-vaccinedetailmanager">
                      {errors.day}
                    </p>
                  )}
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Dung sai:
                  <input
                    type="number"
                    name="tolerance"
                    value={newDetail.tolerance}
                    onChange={handleInputChange}
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                  {errors.tolerance && (
                    <p className="error-text-vaccinedetailmanager">
                      {errors.tolerance}
                    </p>
                  )}
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Số lượng:
                  <input
                    type="number"
                    name="quantity"
                    value={newDetail.quantity}
                    onChange={handleInputChange}
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                  {errors.quantity && (
                    <p className="error-text-vaccinedetailmanager">
                      {errors.quantity}
                    </p>
                  )}
                </label>
                <label className="form-label-vaccinedetailmanager">
                  URL Hình ảnh:
                  <input
                    type="text"
                    name="img"
                    value={newDetail.img}
                    onChange={handleInputChange}
                    className="form-input-vaccinedetailmanager"
                    placeholder="Nhập URL hình ảnh (nếu có)"
                  />
                </label>
                <div className="modal-buttons-create-vaccinedetailmanager">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="cancel-button-vaccinedetailmanager"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="submit-create-button-vaccinedetailmanager"
                  >
                    Tạo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {vaccineDetails.length === 0 ? (
          <p className="no-data-text-vaccinedetailmanager">
            Không tìm thấy lô vaccine nào
          </p>
        ) : (
          <div className="grid-vaccinedetailmanager">
            {vaccineDetails.map((detail) => (
              <VaccineDetailItem
                key={detail.id}
                detail={detail}
                onDetailUpdated={handleDetailUpdated}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccineDetailManager;
