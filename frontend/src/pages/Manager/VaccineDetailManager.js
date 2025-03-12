import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FaEdit, FaPowerOff } from "react-icons/fa";
import '../../style/VaccineDetailManager.css';


// --- Component VaccineDetailItem ---
const VaccineDetailItem = ({ detail, onDetailUpdated, onToggleStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(detail.img || "");

  const handleToggleStatus = () => {
    onToggleStatus(detail.id, detail.status);
  };

  const handleUpdate = (updatedData) => {
    console.log("Gửi API cập nhật với dữ liệu:", updatedData);
    fetch(`http://localhost:8080/vaccinedetail/update`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json();
      })
      .then((data) => {
        console.log("Cập nhật VaccineDetail thành công:", data);
        onDetailUpdated(data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error("Cập nhật VaccineDetail thất bại:", err);
      });
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
            <span className="font-medium-vaccinedetailmanager">ID:</span> {detail.id}
          </p>
          <p>
            <span className="font-medium-vaccinedetailmanager">Ngày nhập:</span>{" "}
            {detail.entryDate}
          </p>
          <p>
            <span className="font-medium-vaccinedetailmanager">Ngày hết hạn:</span>{" "}
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
        <div className="card-buttons-vaccinedetailmanager">
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
              Cập nhật Vaccine Detail
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedDetail = {
                  ...detail,
                  entryDate: e.target.entryDate.value,
                  expiredDate: e.target.expiredDate.value,
                  day: Number(e.target.day.value) || 0,
                  tolerance: Number(e.target.tolerance.value) || 0,
                  quantity: Number(e.target.quantity.value) || 0,
                  img: imageUrl || null,
                };
                handleUpdate(updatedDetail);
              }}
            >
              <label className="form-label-vaccinedetailmanager">
                Ngày nhập:
                <input
                  type="date"
                  name="entryDate"
                  defaultValue={detail.entryDate}
                  className="form-input-vaccinedetailmanager"
                />
              </label>
              <label className="form-label-vaccinedetailmanager">
                Ngày hết hạn:
                <input
                  type="date"
                  name="expiredDate"
                  defaultValue={detail.expiredDate}
                  className="form-input-vaccinedetailmanager"
                />
              </label>
              <label className="form-label-vaccinedetailmanager">
                Số ngày:
                <input
                  type="number"
                  name="day"
                  defaultValue={detail.day}
                  className="form-input-vaccinedetailmanager"
                />
              </label>
              <label className="form-label-vaccinedetailmanager">
                Dung sai:
                <input
                  type="number"
                  name="tolerance"
                  defaultValue={detail.tolerance}
                  className="form-input-vaccinedetailmanager"
                />
              </label>
              <label className="form-label-vaccinedetailmanager">
                Số lượng:
                <input
                  type="number"
                  name="quantity"
                  defaultValue={detail.quantity}
                  className="form-input-vaccinedetailmanager"
                />
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
                <button type="submit" className="submit-button-vaccinedetailmanager">
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
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    fetchVaccineDetails();
  }, [vaccineId]);

  const fetchVaccineDetails = () => {
    fetch(`http://localhost:8080/vaccinedetail/findbyvaccine?id=${vaccineId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lấy dữ liệu thất bại");
        return res.json();
      })
      .then((data) => {
        console.log("API fetch VaccineDetail thành công:", data);
        setVaccineDetails(data);
      })
      .catch((err) => console.error("Lỗi khi lấy VaccineDetail:", err));
  };

  const handleDetailUpdated = (updatedDetail) => {
    setVaccineDetails((prev) =>
      prev.map((d) => (d.id === updatedDetail.id ? updatedDetail : d))
    );
  };

  const handleToggleStatus = (detailId, currentStatus) => {
    console.log(
      "Đang chuyển trạng thái cho detailId:",
      detailId,
      "Trạng thái hiện tại:",
      currentStatus
    );
    fetch(`http://localhost:8080/vaccinedetail/active?id=${detailId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Chuyển trạng thái thất bại");
        return res.json();
      })
      .then((data) => {
        console.log("API toggle status thành công:", data);
        setVaccineDetails((prev) =>
          prev.map((d) =>
            d.id === detailId ? { ...d, status: !currentStatus } : d
          )
        );
      })
      .catch((err) =>
        console.error("Lỗi chuyển trạng thái VaccineDetail:", err)
      );
  };

  const handleCreateDetail = (e) => {
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
    fetch("http://localhost:8080/vaccinedetail/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Tạo mới thất bại");
        return res.json();
      })
      .then((data) => {
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
        setCreateError(null);
        fetchVaccineDetails();
      })
      .catch((err) => {
        console.error("Lỗi khi tạo Vaccine Detail:", err);
        setCreateError(
          err.message ||
            "Đã xảy ra lỗi khi tạo Vaccine Detail. Vui lòng thử lại!"
        );
      });
  };

  return (
    <div className="container-vaccinedetailmanager">
      <div className="content-wrapper-vaccinedetailmanager">
        <h2 className="page-title-vaccinedetailmanager">
          Danh sách Vaccine Detail cho Vaccine {vaccineId}
        </h2>
        <div className="back-button-wrapper-vaccinedetailmanager">
          <NavLink to="../vaccines" className="back-button-vaccinedetailmanager">
            Quay lại Vaccine
          </NavLink>
        </div>
        <div className="create-button-wrapper-vaccinedetailmanager">
          <button
            onClick={() => setShowCreateModal(true)}
            className="create-button-vaccinedetailmanager"
          >
            Tạo mới Vaccine Detail
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
                Tạo mới Vaccine Detail
              </h3>
              <form onSubmit={handleCreateDetail} className="form-create-vaccinedetailmanager">
                <label className="form-label-vaccinedetailmanager">
                  Ngày nhập:
                  <input
                    type="date"
                    value={newDetail.entryDate}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, entryDate: e.target.value })
                    }
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Ngày hết hạn:
                  <input
                    type="date"
                    value={newDetail.expiredDate}
                    onChange={(e) =>
                      setNewDetail({
                        ...newDetail,
                        expiredDate: e.target.value,
                      })
                    }
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Số ngày:
                  <input
                    type="number"
                    value={newDetail.day}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, day: e.target.value })
                    }
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Dung sai:
                  <input
                    type="number"
                    value={newDetail.tolerance}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, tolerance: e.target.value })
                    }
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                </label>
                <label className="form-label-vaccinedetailmanager">
                  Số lượng:
                  <input
                    type="number"
                    value={newDetail.quantity}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, quantity: e.target.value })
                    }
                    className="form-input-vaccinedetailmanager"
                    required
                  />
                </label>
                <label className="form-label-vaccinedetailmanager">
                  URL Hình ảnh:
                  <input
                    type="text"
                    value={newDetail.img}
                    onChange={(e) =>
                      setNewDetail({ ...newDetail, img: e.target.value })
                    }
                    className="form-input-vaccinedetailmanager"
                    placeholder="Nhập URL hình ảnh (nếu có)"
                  />
                </label>
                {createError && (
                  <p className="error-text-vaccinedetailmanager">{createError}</p>
                )}
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
            Không tìm thấy Vaccine Detail nào
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
