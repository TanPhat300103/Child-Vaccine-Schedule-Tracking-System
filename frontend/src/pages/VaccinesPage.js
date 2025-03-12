import React, { useState, useEffect } from 'react';
import VaccineList from "../pages/VaccineListPage"; // Import component VaccineList
import VaccineCombo from "../components/VaccineCombo"; // Import component VaccineCombo
import '../style/VaccinesPage.css'; // Style riêng cho page

function VaccinesPage() {
  const [activeTab, setActiveTab] = useState('vaccine-list'); // Mặc định chọn Vaccine List

  // State cho VaccineCombo
  const [combos, setCombos] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch vaccine combos
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetch("http://localhost:8080/vaccinecombo", {
          method: "GET",
        });
        if (!response.ok) throw new Error("Không thể tải danh sách combo vaccine");
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

  // Fetch combo details
  const fetchComboDetails = async (comboId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/combodetail/findcomboid?id=${comboId.toLowerCase()}`,
        { method: "GET" }
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
      
      <div className="vaccines-tabs">
        <button
          className={`vaccines-tab ${activeTab === 'vaccine-list' ? 'vaccines-tab-active' : ''}`}
          onClick={() => setActiveTab('vaccine-list')}
        >
          Danh sách Vaccine
        </button>
        <button
          className={`vaccines-tab ${activeTab === 'vaccine-combo' ? 'vaccines-tab-active' : ''}`}
          onClick={() => setActiveTab('vaccine-combo')}
        >
          Combo Vaccine
        </button>
      </div>
      <div className="vaccines-content">
        {activeTab === 'vaccine-list' && <VaccineList />}
        {activeTab === 'vaccine-combo' && (
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