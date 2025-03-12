import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CountryFlag from 'react-country-flag';
import '../style/VaccineDetailPage.css';

function VaccineDetailPage() {
  const { vaccineId } = useParams();
  const [vaccine, setVaccine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/vaccine/findid?id=${vaccineId}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setVaccine(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [vaccineId]);

  const handleBack = () => {
    navigate('/vaccine');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!vaccine) return <div className="error">Vaccine not found</div>;

  return (
    <div className="vaccine-detail-page">
      <div className="header">
        <h1>Chi tiết Vaccine: {vaccine.name}</h1>
        <button className="back-button" onClick={handleBack}>
          Quay lại
        </button>
      </div>

      <div className="vaccine-detail-container">
        <div className="vaccine-detail-card">
          <div className="detail-item">
            <span className="label">Tên Vaccine:</span>
            <span className="value">{vaccine.name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Quốc gia:</span>
            <span className="value">
              <CountryFlag
                countryCode={getCountryCode(vaccine.country)}
                svg
                style={{ width: '20px', marginRight: '8px' }}
              />
              {vaccine.country}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Giá (VND):</span>
            <span className="value">{vaccine.price.toLocaleString()} VND</span>
          </div>
          <div className="detail-item">
            <span className="label">Độ tuổi:</span>
            <span className="value">{vaccine.ageMin} - {vaccine.ageMax}</span>
          </div>
          <div className="detail-item">
            <span className="label">Số liều:</span>
            <span className="value">{vaccine.doseNumber}</span>
          </div>
          <div className="detail-item">
            <span className="label">Mô tả:</span>
            <span className="value">{vaccine.description || 'Không có mô tả'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Trạng thái:</span>
            <span className={`value status ${vaccine.active ? 'active' : 'inactive'}`}>
              {vaccine.active ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCountryCode(countryName) {
  const countryCodes = {
    'Vietnam': 'VN',
    'United States': 'US',
    'China': 'CN',
    'Japan': 'JP',
    'France': 'FR',
    'Germany': 'DE',
    'United Kingdom': 'GB',
    'India': 'IN',
    'Brazil': 'BR',
    'Russia': 'RU',
    'Canada': 'CA',
    'Australia': 'AU',
    'Italy': 'IT',
    'Spain': 'ES',
    'Mexico': 'MX',
    'South Korea': 'KR',
    'South Africa': 'ZA',
    'Argentina': 'AR',
    'Indonesia': 'ID',
    'Thailand': 'TH',
    'Malaysia': 'MY',
    'Singapore': 'SG',
    'Philippines': 'PH',
    'New Zealand': 'NZ',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Netherlands': 'NL',
    'Switzerland': 'CH',
    'Turkey': 'TR',
  };

  const normalizedCountryName = countryName.toLowerCase().trim();
  for (const [name, code] of Object.entries(countryCodes)) {
    if (name.toLowerCase().trim() === normalizedCountryName) {
      return code;
    }
  }
  return 'XX';
}

export default VaccineDetailPage;