import React, { useState, useEffect } from "react";
import CountryFlag from "react-country-flag";
import "../style/VaccineListPage.css";
import { FaShieldVirus, FaTimes } from "react-icons/fa"; // Xóa FaChild, FaSyringe vì không dùng trong bảng
import { FiSearch, FiX } from "react-icons/fi";
import { color } from "framer-motion";

function VaccineListPage() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const fetchVaccines = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/vaccine`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setVaccines(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const filteredVaccines = vaccines.filter((vaccine) => {
    const matchesQuery =
      vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isPriceValid = vaccine.price >= minPrice && vaccine.price <= maxPrice;
    const isCountryValid = selectedCountry
      ? vaccine.country === selectedCountry
      : true;
    let isTabValid = true;
    if (activeTab === "infant") {
      isTabValid = vaccine.ageMax <= 2;
    } else if (activeTab === "child") {
      isTabValid = vaccine.ageMin >= 2 && vaccine.ageMax <= 9;
    } else if (activeTab === "adolescent") {
      isTabValid = vaccine.ageMin >= 9;
    }
    return matchesQuery && isPriceValid && isCountryValid && isTabValid;
  });

  const openModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVaccine(null);
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
    <div className="vaccine-list-page">
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
        <div className="price-vaccine-filter-country">
          <FaShieldVirus className="price-vaccine-filter-icon" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="filter-input"
          >
            <option value="">Quốc gia</option>
            <option value="USA">USA</option>
            <option value="Vietnam">Việt Nam</option>
            <option value="France">Pháp</option>
            <option value="Germany">Đức</option>
            <option value="Japan">Nhật Bản</option>
            <option value="UK">Anh Quốc</option>
          </select>
        </div>
        <div className="price-vaccine-filter-search">
          <FiSearch className="price-vaccine-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm vắc xin theo tên hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="price-vaccine-filter-tabs">
          {[
            { id: "all", label: "Tất cả", icon: <FaShieldVirus /> },
            { id: "infant", label: "Trẻ sơ sinh (0-2)", icon: "👶" },
            { id: "child", label: "Trẻ nhỏ (2-9)", icon: "🧒" },
            { id: "adolescent", label: "Trẻ lớn (9+)", icon: "👦" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`price-vaccine-tab ${
                activeTab === tab.id ? "price-vaccine-tab-active" : ""
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        {(selectedCountry ||
          minPrice > 0 ||
          maxPrice < 3000000 ||
          searchQuery) && (
          <button onClick={resetFilters} className="price-vaccine-reset-btn">
            <FiX /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Bảng vaccine */}
      <div className="vaccine-table-container">
        {filteredVaccines.length === 0 ? (
          <div className="vaccine-no-results">
            <h3>Không tìm thấy vắc xin</h3>
            <p>Không có vắc xin nào phù hợp với điều kiện tìm kiếm của bạn.</p>
            <button onClick={resetFilters}>Xóa bộ lọc</button>
          </div>
        ) : (
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
              {filteredVaccines.map((vaccine) => (
                <tr
                  key={vaccine.vaccineId}
                  onClick={() => openModal(vaccine)}
                  className="vaccine-row"
                >
                  <td>{vaccine.name}</td>
                  <td>
                    <CountryFlag
                      countryCode={getCountryCode(vaccine.country)}
                      svg
                      style={{ width: "18px", marginRight: "6px" }}
                    />
                    {vaccine.country}
                  </td>
                  <td>{vaccine.price.toLocaleString()}</td>
                  <td>
                    {vaccine.ageMin} - {vaccine.ageMax}
                  </td>
                  <td>{vaccine.doseNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedVaccine && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
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
    if (name.toLowerCase().trim() === normalizedCountryName) {
      return code;
    }
  }
  return "XX";
}

export default VaccineListPage;
