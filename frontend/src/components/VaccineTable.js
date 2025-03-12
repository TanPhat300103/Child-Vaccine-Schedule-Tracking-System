import React, { useState, useEffect } from 'react';
import '../style/VaccinePage.css';
import { useNavigate } from 'react-router-dom';
import CountryFlag from 'react-country-flag';
import Select from 'react-select';

function VaccinePage() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [formData, setFormData] = useState({
    vaccineId: '',
    name: '',
    doseNumber: 1,
    description: '',
    country: '',
    ageMin: 0,
    ageMax: 0,
    active: false,
    price: 0
  });
  const [searchName, setSearchName] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(99);
  const navigate = useNavigate();

  const countries = [
    { name: 'Vietnam', code: 'VN' },
    { name: 'United States', code: 'US' },
    { name: 'China', code: 'CN' },
    { name: 'Japan', code: 'JP' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'India', code: 'IN' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Russia', code: 'RU' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Mexico', code: 'MX' },
    { name: 'South Korea', code: 'KR' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Philippines', code: 'PH' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Norway', code: 'NO' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Turkey', code: 'TR' },
  ];

  const countryOptions = countries.map(country => ({
    value: country.name,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CountryFlag countryCode={country.code} svg style={{ width: '20px' }} />
        {country.name}
      </div>
    ),
  }));

  const fetchVaccines = () => {
    setLoading(true);
    fetch('http://localhost:8080/vaccine')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setVaccines(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    const url = selectedVaccine ? 'http://localhost:8080/vaccine/update' : 'http://localhost:8080/vaccine/create';
    const method = 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to save vaccine');
        return response.json();
      })
      .then(() => {
        fetchVaccines();
        closeModal();
      })
      .catch(err => {
        alert(`Error: ${err.message}`);
      });
  };

  const openModal = (vaccine = null) => {
    if (vaccine) {
      setSelectedVaccine(vaccine);
      setFormData({
        vaccineId: vaccine.vaccineId || '',
        name: vaccine.name || '',
        doseNumber: vaccine.doseNumber ,
        description: vaccine.description || '',
        country: vaccine.country || '',
        ageMin: vaccine.ageMin ,
        ageMax: vaccine.ageMax ,
        active: vaccine.active || false,
        price: vaccine.price 
      });
    } else {
      setSelectedVaccine(null);
      setFormData({
        vaccineId: '',
        name: '',
        doseNumber: 1,
        description: '',
        country: '',
        ageMin: 0,
        ageMax: 0,
        active: false,
        price: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVaccine(null);
  };

  const handleDelete = (vaccineId) => {
    if (window.confirm('Are you sure you want to delete this vaccine?')) {
      fetch(`http://localhost:8080/vaccine/delete?id=${vaccineId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to delete vaccine');
          fetchVaccines();
        })
        .catch(err => {
          alert(`Error: ${err.message}`);
        });
    }
  };

  const handleActiveToggle = (vaccineId, currentActive) => {
    fetch(`http://localhost:8080/vaccine/active?id=${vaccineId}`, {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to toggle status');
        return response.json();
      })
      .then(() => {
        setVaccines(prevVaccines =>
          prevVaccines.map(vaccine =>
            vaccine.vaccineId === vaccineId ? { ...vaccine, active: !currentActive } : vaccine
          )
        );
      })
      .catch(err => {
        alert(`Error: ${err.message}`);
      });
  };

  const filteredVaccines = vaccines.filter(vaccine => {
    const matchesName = vaccine.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCountry = vaccine.country.toLowerCase().includes(searchCountry.toLowerCase());
    const matchesPrice = vaccine.price >= priceMin && vaccine.price <= priceMax;
    const matchesAge = vaccine.ageMin >= ageMin && vaccine.ageMax <= ageMax;
    return matchesName && matchesCountry && matchesPrice && matchesAge;
  });

  const handleCardClick = (e, vaccineId) => {
    // Ngăn sự lan tỏa từ các button bên trong
    const target = e.target;
    if (target.closest('.action-button') || target.closest('.vaccine-switch')) {
      return; // Không chuyển hướng nếu click vào button hoặc toggle
    }
    navigate(`/vaccinedetail/${vaccineId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="vaccine-page">
      <div className="header">
        <h1>Vaccine Management</h1>
        <button className="add-button" onClick={() => openModal()}>
          <i className="fas fa-plus"></i> Add Vaccine
        </button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Search by country..."
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
          className="filter-input"
        />
        <div className="price-filter">
          <label>Price (VND):</label>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(parseInt(e.target.value) )}
            placeholder="Min"
            className="filter-input small"
          />
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(parseInt(e.target.value) )}
            placeholder="Max"
            className="filter-input small"
          />
        </div>
        <div className="age-filter">
          <label>Age Range:</label>
          <input
            type="number"
            value={ageMin}
            onChange={(e) => setAgeMin(parseInt(e.target.value) )}
            placeholder="Min"
            className="filter-input small"
            min="0"
            max="99"
          />
          <input
            type="number"
            value={ageMax}
            onChange={(e) => setAgeMax(parseInt(e.target.value) )}
            placeholder="Max"
            className="filter-input small"
            min="0"
            max="99"
          />
        </div>
      </div>

      <div className="vaccine-grid">
        {filteredVaccines.map(vaccine => (
          <div
            key={vaccine.vaccineId}
            className="vaccine-card"
            onClick={(e) => handleCardClick(e, vaccine.vaccineId)} // Thêm sự kiện click
          >
            <div className="card-header">
              <h3>{vaccine.name}</h3>
              <span className={`status ${vaccine.active ? 'active' : 'inactive'}`}>
                {vaccine.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="card-body">
              <p>
                <i className="fas fa-globe"></i>
                Country: <CountryFlag countryCode={getCountryCode(vaccine.country)} svg style={{ width: '20px', marginRight: '8px' }} /> {vaccine.country}
              </p>
              <p><i className="fas fa-money-bill-wave"></i> Price: {vaccine.price} VND</p>
              <p><i className="fas fa-child"></i> Age: {vaccine.ageMin}-{vaccine.ageMax}</p>
              <p><i className="fas fa-info-circle"></i> Dose: {vaccine.doseNumber}</p>
              <p><i className="fas fa-file-alt"></i> Description: {vaccine.description || 'N/A'}</p>
            </div>
            <div className="card-actions">
              <button
                className="action-button update"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn lan tỏa
                  openModal(vaccine);
                }}
              >
                <i className="fas fa-edit"></i> Update
              </button>
              <button
                className="action-button delete"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn lan tỏa
                  handleDelete(vaccine.vaccineId);
                }}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
              <label className="vaccine-switch">
                <input
                  type="checkbox"
                  checked={vaccine.active}
                  onChange={(e) => {
                    e.stopPropagation(); // Ngăn lan tỏa
                    handleActiveToggle(vaccine.vaccineId, vaccine.active);
                  }}
                />
                <span className="vaccine-slider"></span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedVaccine ? 'Update Vaccine' : 'Add New Vaccine'}</h2>
            <form onSubmit={handleCreateOrUpdate}>
              {!selectedVaccine && (
                <div className="form-group">
                  <label>Vaccine ID</label>
                  <input
                    type="text"
                    name="vaccineId"
                    value={formData.vaccineId}
                    onChange={(e) => setFormData({ ...formData, vaccineId: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dose Number</label>
                  <input
                    type="number"
                    name="doseNumber"
                    value={formData.doseNumber}
                    onChange={(e) => setFormData({ ...formData, doseNumber: parseInt(e.target.value)  })}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(option => option.value === formData.country)}
                    onChange={(option) => setFormData({ ...formData, country: option ? option.value : '' })}
                    placeholder="Select Country"
                  />
                </div>
                <div className="form-group">
                  <label>Price (VND)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age Min</label>
                  <input
                    type="number"
                    name="ageMin"
                    value={formData.ageMin}
                    onChange={(e) => setFormData({ ...formData, ageMin: parseInt(e.target.value) })}
                    required
                    min="0"
                    max="99"
                  />
                </div>
                <div className="form-group">
                  <label>Age Max</label>
                  <input
                    type="number"
                    name="ageMax"
                    value={formData.ageMax}
                    onChange={(e) => setFormData({ ...formData, ageMax: parseInt(e.target.value) })}
                    required
                    min="0"
                    max="99"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default VaccinePage;