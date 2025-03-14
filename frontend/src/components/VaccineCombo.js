import React, { useState, useEffect } from "react";
import CountryFlag from "react-country-flag";
import { FaShieldVirus, FaTimes } from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";
import "../style/VaccineCombo.css"; // Style đồng bộ với VaccineListPage.css

function VaccineCombo() {
  const [combos, setCombos] = useState([]);
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinecombo`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("Không thể tải danh sách combo vaccine");
      const data = await response.json();
      setCombos(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchComboDetails = async (comboId) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/combodetail/findcomboid?id=${comboId.toLowerCase()}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Không thể tải chi tiết combo vaccine");
      const data = await response.json();
      setComboDetails(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const filteredCombos = combos.filter((combo) => {
    const matchesQuery =
      combo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isPriceValid =
      combo.priceCombo >= minPrice && combo.priceCombo <= maxPrice;
    return matchesQuery && isPriceValid;
  });

  const openModal = async (combo) => {
    await fetchComboDetails(combo.vaccineComboId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVaccine(null);
    setComboDetails([]);
  };

  const handleVaccineClick = (vaccine) => {
    setSelectedVaccine(vaccine);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(3000000);
    setSelectedCountry("");
    setActiveTab("all");
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 3000000;
    setMaxPrice(value);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="vaccine-combo-page">
      {/* Bộ lọc */}
      <div className="filter-container">
        <div className="price-vaccine-filter-price">
          <span>Giá</span>
          <input
            type="text"
            placeholder="Giá từ"
            value={minPrice.toLocaleString()}
            onChange={handleMinPriceChange}
            className="filter-input small"
          />
          <span>-</span>
          <input
            type="text"
            placeholder="Giá đến"
            value={maxPrice.toLocaleString()}
            onChange={handleMaxPriceChange}
            className="filter-input small"
          />
        </div>
        <div className="price-vaccine-filter-search">
          <FiSearch className="price-vaccine-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm combo vaccine theo tên hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>
        {(minPrice > 0 || maxPrice < 3000000 || searchQuery) && (
          <button onClick={resetFilters} className="price-vaccine-reset-btn">
            <FiX /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Bảng combo vaccine */}
      <div className="vaccine-table-container">
        {filteredCombos.length === 0 ? (
          <div className="vaccine-no-results">
            <h3>Không tìm thấy combo vaccine</h3>
            <p>
              Không có combo vaccine nào phù hợp với điều kiện tìm kiếm của bạn.
            </p>
            <button onClick={resetFilters}>Xóa bộ lọc</button>
          </div>
        ) : (
          <table className="vaccine-table">
            <thead>
              <tr>
                <th>Tên Combo</th>
                <th>Mô tả</th>
                <th>Giá (VND)</th>
              </tr>
            </thead>
            <tbody>
              {filteredCombos.map((combo) => (
                <tr
                  key={combo.vaccineComboId}
                  onClick={() => openModal(combo)}
                  className="vaccine-row"
                >
                  <td>{combo.name}</td>
                  <td>{combo.description}</td>
                  <td>{combo.priceCombo.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal chi tiết combo */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
              <FaTimes />
            </button>
            <h2>Danh sách Vaccine trong Combo</h2>
            <div className="vaccine-detail-card">
              {comboDetails.length > 0 ? (
                <table className="vaccine-table">
                  <thead>
                    <tr>
                      <th>Tên Vaccine</th>
                      <th>Quốc gia</th>
                      <th>Giá (VND)</th>
                      <th>Độ tuổi</th>
                      <th>Số liều</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comboDetails.map((detail) => (
                      <tr
                        key={detail.comboDetailId}
                        onClick={() => handleVaccineClick(detail.vaccine)}
                        className="vaccine-row"
                      >
                        <td>{detail.vaccine.name}</td>
                        <td>
                          <CountryFlag
                            countryCode={getCountryCode(detail.vaccine.country)}
                            svg
                            style={{ width: "18px", marginRight: "6px" }}
                          />
                          {detail.vaccine.country}
                        </td>
                        <td>{detail.vaccine.price.toLocaleString()}</td>
                        <td>
                          {detail.vaccine.ageMin} - {detail.vaccine.ageMax}
                        </td>
                        <td>{detail.vaccine.doseNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có vaccine nào trong combo này</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết vaccine */}
      {selectedVaccine && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => setSelectedVaccine(null)}
            >
              <FaTimes />
            </button>
            <h2>Chi tiết Vaccine: {selectedVaccine.name}</h2>
            <div className="vaccine-detail-card">
              <div className="detail-item">
                <span className="label">Tên Vaccine:</span>
                <span className="value">{selectedVaccine.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Quốc gia:</span>
                <span className="value">
                  <CountryFlag
                    countryCode={getCountryCode(selectedVaccine.country)}
                    svg
                    style={{ width: "20px", marginRight: "8px" }}
                  />
                  {selectedVaccine.country}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Giá (VND):</span>
                <span className="value">
                  {selectedVaccine.price.toLocaleString()} VND
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Độ tuổi:</span>
                <span className="value">
                  {selectedVaccine.ageMin} - {selectedVaccine.ageMax}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Số liều:</span>
                <span className="value">{selectedVaccine.doseNumber}</span>
              </div>
              <div className="detail-item">
                <span className="label">Mô tả:</span>
                <span className="value">
                  {selectedVaccine.description || "Không có mô tả"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getCountryCode(countryName) {
  const countryCodes = {
    Vietnam: "VN",
    "United States": "US",
    USA: "US",
    China: "CN",
    Japan: "JP",
    France: "FR",
    Germany: "DE",
    "United Kingdom": "GB",
    UK: "GB",
    India: "IN",
    Brazil: "BR",
    Russia: "RU",
    Canada: "CA",
    Australia: "AU",
    Italy: "IT",
    Spain: "ES",
    Mexico: "MX",
    "South Korea": "KR",
    "South Africa": "ZA",
    Argentina: "AR",
    Indonesia: "ID",
    Thailand: "TH",
    Malaysia: "MY",
    Singapore: "SG",
    Philippines: "PH",
    "New Zealand": "NZ",
    Sweden: "SE",
    Norway: "NO",
    Denmark: "DK",
    Netherlands: "NL",
    Switzerland: "CH",
    Turkey: "TR",
  };
  const normalizedCountryName = countryName.toLowerCase().trim();
  for (const [name, code] of Object.entries(countryCodes)) {
    if (name.toLowerCase().trim() === normalizedCountryName) return code;
  }
  return "XX";
}

export default VaccineCombo;
