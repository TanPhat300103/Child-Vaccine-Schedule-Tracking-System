import React, { useState, useEffect } from "react";

import VaccineList from "../pages/VaccineListPage";
import VaccineCombo from "../components/VaccineCombo";
import "../style/VaccinesPage.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

function VaccinesPage() {
  const [activeTab, setActiveTab] = useState("vaccine-list");
  const [combos, setCombos] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/vaccinecombo`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
          }
        );
        if (!response.ok)
          throw new Error("Không thể tải danh sách combo vaccine");
        const data = await response.json();
        setCombos(data);

        if (data.length > 0) {
          const firstCombo = data[0];
          setSelectedCombo(firstCombo);
          fetchComboDetails(firstCombo.vaccineComboId);
        }
      } catch (err) {
        setError("Không thể tải danh sách combo vaccine");
        console.error("Error fetching vaccine combos:", err);
      }
    };
    fetchCombos();
  }, []);

  const fetchComboDetails = async (comboId) => {
    setLoading(true);
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
        }
      );
      if (!response.ok) throw new Error("Không thể tải chi tiết combo vaccine");
      const data = await response.json();
      setComboDetails(data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải chi tiết combo vaccine");
      setLoading(false);
      console.error("Error fetching combo details:", err);
    }
  };

  const handleComboClick = (combo) => {
    setSelectedCombo(combo);
    fetchComboDetails(combo.vaccineComboId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="vaccines-page">
      {/* Hero Section */}
      <div className="faq-hero">
        <div className="hero-content">
          <h1>Bảng Giá</h1>
          <div className="quote">
            <p>
              Bác sĩ nói rằng khoảnh khắc cuối cùng của con người sau khi mất đi
              là thính giác, vì vậy đừng ôm anh mà khóc, hãy nói rằng em yêu
              anh...
            </p>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-circle-1"></div>
          <div className="hero-circle-2"></div>
          <div className="hero-circle-3"></div>
          <div className="hero-circle-4"></div>
          <div className="hero-circle-5"></div>
        </div>
      </div>

      <div className="vaccines-tabs">
        <button
          className={`vaccines-tab ${
            activeTab === "vaccine-list" ? "vaccines-tab-active" : ""
          }`}
          onClick={() => setActiveTab("vaccine-list")}
        >
          Danh sách vắc xin
        </button>
        <button
          className={`vaccines-tab ${
            activeTab === "vaccine-combo" ? "vaccines-tab-active" : ""
          }`}
          onClick={() => setActiveTab("vaccine-combo")}
        >
          Combo vắc xin
        </button>
      </div>
      <div className="vaccines-content">
        {activeTab === "vaccine-list" && <VaccineList />}
        {activeTab === "vaccine-combo" && (
          <VaccineCombo
            combos={combos}
            selectedCombo={selectedCombo}
            comboDetails={comboDetails}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onComboClick={handleComboClick}
            formatPrice={formatPrice}
          />
        )}
      </div>
    </div>
  );
}

export default VaccinesPage;
