import React, { useState, useEffect, useRef } from "react";
import "../style/HomePage.css"; // Import the CSS file
import { FiSearch, FiX, FiInfo } from "react-icons/fi";
import { useAuth } from "../components/AuthContext"; 
import { useNavigate } from "react-router-dom";
import {
  FaGlobe,
  FaSyringe,
  FaUserClock,
  FaShieldVirus,
  FaChild,
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Heart, Stethoscope, Syringe, Search } from "lucide-react"; // Import biểu tượng từ Lucide React

const HomePage = () => {
  const { userInfo } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const vaccinePricingRef = useRef(null);
  const comboVaccineRef = useRef(null);
  const ageVaccineRef = useRef(null);
  const feedbackContainerRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);
  const animationRef = useRef(null);
  const navigate = useNavigate();

  // Điều hướng role
  if (userInfo != null) {
    localStorage.setItem("userId", userInfo.userId);
  }
   
  useEffect(() => {
    if (userInfo != null && userInfo != "anonymousUser") {
      if (userInfo.authorities[0].authority === "ROLE_CUSTOMER") {
        navigate("/"); // Dẫn người dùng tới trang Home
      } else if (userInfo.authorities[0].authority === "ROLE_STAFF") {
        navigate("/staff"); // Dẫn người dùng tới trang Staff
      } else if (userInfo.authorities[0].authority === "ROLE_ADMIN") {
        navigate("/admin"); // Dẫn người dùng tới trang Admin
      }
    }
  }, [userInfo, navigate]);

  // AgeVaccine2 State
  const [combos, setCombos] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // PriceVaccineGuest State
  const [pricePackages, setPricePackages] = useState([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [vaccineData, setVaccineData] = useState(null);

  const slides = [
    { img: "https://via.placeholder.com/800x400?text=Slide+1" },
    { img: "https://via.placeholder.com/800x400?text=Slide+2" },
    { img: "https://via.placeholder.com/800x400?text=Slide+3" },
  ];

  const enhancedBenefits = [
    { icon: "🛡️", title: "Bảo Vệ Sức Khỏe", description: "Vắc-xin giúp ngăn ngừa các bệnh truyền nhiễm nguy hiểm, bảo vệ sức khỏe cộng đồng." },
    { icon: "❤️", title: "Tăng Cường Miễn Dịch", description: "Tiêm chủng giúp cơ thể tăng cường khả năng miễn dịch, giảm nguy cơ mắc bệnh." },
    { icon: "👶", title: "An Toàn Cho Trẻ Em", description: "Vắc-xin được kiểm định nghiêm ngặt, đảm bảo an toàn cho trẻ em và người lớn." },
    { icon: "👨‍⚕️", title: "Chăm Sóc Chuyên Nghiệp", description: "Đội ngũ y bác sĩ giàu kinh nghiệm, tận tâm chăm sóc sức khỏe của bạn." },
    { icon: "🏥", title: "Cơ Sở Vật Chất Hiện Đại", description: "Hệ thống phòng tiêm hiện đại, vô trùng, đảm bảo tiêu chuẩn y tế quốc tế." },
    { icon: "🩺", title: "Theo Dõi Sau Tiêm", description: "Hệ thống theo dõi sức khỏe sau tiêm chủng, hỗ trợ 24/7 khi cần thiết." },
  ];

  const features = [
    { icon: "📅", title: "Đặt Lịch Trực Tuyến", description: "Đặt lịch tiêm chủng trực tuyến dễ dàng, tiết kiệm thời gian chờ đợi." },
    { icon: "💉", title: "Đa Dạng Vắc-xin", description: "Cung cấp đầy đủ các loại vắc-xin trong và ngoài chương trình tiêm chủng." },
    { icon: "⏰", title: "Linh Hoạt Thời Gian", description: "Hoạt động 7 ngày/tuần, sáng chiều tối để phục vụ mọi nhu cầu của khách hàng." },
    { icon: "👤", title: "Hồ Sơ Điện Tử", description: "Lưu trữ thông tin tiêm chủng trên hệ thống điện tử, dễ dàng tra cứu." },
  ];

  const enhancedProcess = [
    { step: 1, title: "Đăng ký trực tuyến", description: "Truy cập website hoặc ứng dụng để đặt lịch. Chọn vaccine, ngày giờ, nhận mã QR qua email/SMS trong 2-3 phút." },
    { step: 2, title: "Chuẩn bị trước khi đến", description: "Mang CMND/CCCD, mã QR hoặc số y tế (nếu có). Đeo khẩu trang, đến nhẹ, tắm sạch." },
    { step: 3, title: "Khám sàng lọc", description: "Bác sĩ kiểm tra nhiệt độ, huyết áp, tiến sử bệnh lý. Thời gian 5-10 phút để xác định điều kiện tiêm." },
    { step: 4, title: "Tiêm vaccine", description: "Nhân viên y tế thực hiện trong phòng vô trùng, nhanh chóng và không đau." },
    { step: 5, title: "Theo dõi sau tiêm", description: "Nghỉ ngơi 30 phút, nhận giấy chứng nhận và hướng dẫn chăm sóc của ứng dụng/giấy in." },
  ];

  const stats = [
    { value: "5,000+", label: "Khách hàng", icon: <Users size={32} /> },
    { value: "90.8%", label: "Độ hài lòng", icon: <Heart size={32} /> },
    { value: "20+", label: "Bác sĩ chuyên khoa", icon: <Stethoscope size={32} /> },
    { value: "100+", label: "Loại vắc-xin", icon: <Syringe size={32} /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch feedbacks from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:8080/feedback", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Lọc feedbacks có ranking > 3 sao
          const filteredFeedbacks = data.filter(feedback => feedback.ranking >= 3);
          setFeedbacks(filteredFeedbacks);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  // Auto-scroll feedback
  useEffect(() => {
    if (feedbacks.length === 0 || !feedbackContainerRef.current) return;

    const containerWidth = feedbackContainerRef.current.scrollWidth / 2;
    const speed = 1;

    const animate = () => {
      setTranslateX((prev) => {
        const newX = prev - speed;
        if (Math.abs(newX) >= containerWidth) {
          return 0;
        }
        return newX;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [feedbacks]);

  // Fetch vaccine combos for AgeVaccine2
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

  // Fetch vaccine details for PriceVaccineGuest
  useEffect(() => {
    if (!selectedVaccine?.vaccineId) return;

    const fetchVaccineData = async () => {
      try {
        setPriceLoading(true);
        const response = await fetch(`http://localhost:8080/vaccinedetail/findbyvaccine?id=${selectedVaccine.vaccineId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch vaccine details");
        const data = await response.json();
        if (data?.length > 0) {
          setVaccineData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching vaccine data:", error);
      } finally {
        setPriceLoading(false);
      }
    };
    fetchVaccineData();
  }, [selectedVaccine]);

  // Fetch list of vaccines for PriceVaccineGuest
  useEffect(() => {
    const fetchVaccineData = async () => {
      try {
        setPriceLoading(true);
        const response = await fetch("http://localhost:8080/vaccine", {
          method: "GET",
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch vaccines: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setPricePackages(data);
      } catch (error) {
        console.error("Error fetching vaccine price data:", error);
        setError(error.message);
      } finally {
        setPriceLoading(false);
      }
    };
    fetchVaccineData();
  }, []);

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

  const filteredCombos = combos.filter(
    (combo) =>
      combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      combo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PriceVaccineGuest Filters
  const filteredVaccines = pricePackages.filter(
    (vaccine) =>
      vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVaccinesByPriceAndAge = filteredVaccines.filter((vaccine) => {
    let isPriceValid = vaccine.price >= minPrice && vaccine.price <= maxPrice;
    let isCountryValid = selectedCountry ? vaccine.country === selectedCountry : true;
    let isTabValid = true;
    if (activeTab === "infant") {
      isTabValid = vaccine.ageMax <= 2;
    } else if (activeTab === "child") {
      isTabValid = vaccine.ageMin >= 2 && vaccine.ageMax <= 9;
    } else if (activeTab === "adolescent") {
      isTabValid = vaccine.ageMin >= 9;
    }
    return isPriceValid && isCountryValid && isTabValid;
  });

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedVaccine(null);
  };

  const openModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setModalIsOpen(true);
  };

  const getBadgeColor = (country) => {
    const colors = {
      USA: "price-vaccine-badge-blue",
      Vietnam: "price-vaccine-badge-red",
      France: "price-vaccine-badge-indigo",
      Germany: "price-vaccine-badge-yellow",
      Japan: "price-vaccine-badge-pink",
      UK: "price-vaccine-badge-purple",
    };
    return colors[country] || "price-vaccine-badge-gray";
  };

  const resetFilters = () => {
    setSelectedCountry("");
    setMinPrice(0);
    setMaxPrice(3000000);
    setSearchQuery("");
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

  const renderStars = (ranking) => {
    return (
      <div className="homepage-feedback-stars">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < ranking ? "homepage-star-filled" : "homepage-star-empty"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="homepage-min-h-screen homepage-bg-gradient">
      {/* Hero Section */}
      <section className="homepage-hero">
        <div className="homepage-container homepage-hero-container">
          <div className="homepage-hero-grid">
            <div className="homepage-hero-text">
              <h1 className="homepage-hero-title">
                Bảo vệ sức khỏe <br />
                <span className="homepage-text-blue">cho mọi gia đình</span>
              </h1>
              <p className="homepage-hero-subtitle">
                VaccineCare cung cấp dịch vụ tiêm chủng chất lượng cao với đội ngũ y bác sĩ chuyên nghiệp, giúp bảo vệ sức khỏe toàn diện cho bạn và gia đình.
              </p>
              <div className="homepage-hero-buttons">
                <button className="homepage-btn homepage-btn-primary"onClick={() => window.location.href = "/booking"}>Đặt lịch ngay</button>
                <button className="homepage-btn homepage-btn-secondary" onClick={() => window.location.href = "/vaccines"}>
                  Xem gói vaccine
                </button>
              </div>
            </div>
            <div className="homepage-hero-image">
              <img src="https://images.unsplash.com/photo-1584515933487-779824d29309" alt="Healthcare" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="homepage-stats">
        <div className="homepage-container">
          <div className="homepage-stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="homepage-stat-item"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="homepage-stat-icon">{stat.icon}</div>
                <div className="homepage-stat-value">{stat.value}</div>
                <div className="homepage-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Vaccine Section */}
      <section className="homepage-age-vaccine" ref={ageVaccineRef}>
        <div className="homepage-container">
          <div className="homepage-age-vaccine-header">
            <h1>Lịch Tiêm Chủng Cho Trẻ Em</h1>
            <p>Lựa chọn combo vaccine phù hợp cho trẻ từ các chuyên gia y tế hàng đầu</p>
          </div>
          {error && (
            <div className="homepage-age-vaccine-error">
              <span className="homepage-age-vaccine-error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}
          <div className="homepage-age-vaccine-search">
            <div className="homepage-age-vaccine-search-container">
              <span className="homepage-age-vaccine-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm combo vaccine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="homepage-age-vaccine-grid">
            <div className="homepage-age-vaccine-combo-list">
              <div className="homepage-age-vaccine-combo-header">
                <h2>Combo Vaccine</h2>
                <p>Chọn gói tiêm chủng phù hợp</p>
              </div>
              <div className="homepage-age-vaccine-combo-items">
                {filteredCombos.length > 0 ? (
                  filteredCombos.map((combo) => (
                    <div
                      key={combo.vaccineComboId}
                      className={`homepage-age-vaccine-combo-item ${selectedCombo?.vaccineComboId === combo.vaccineComboId ? "homepage-age-vaccine-combo-item-selected" : ""}`}
                      onClick={() => handleComboClick(combo)}
                    >
                      <div className="homepage-age-vaccine-combo-content">
                        <div>
                          <h3>{combo.name}</h3>
                          <p>{combo.description}</p>
                        </div>
                      </div>
                      <div className="homepage-age-vaccine-combo-footer">
                        <span>{formatPrice(combo.priceCombo)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="homepage-age-vaccine-no-results">
                    <span>😞</span>
                    <p>Không tìm thấy combo vaccine phù hợp</p>
                  </div>
                )}
              </div>
            </div>
            <div className="homepage-age-vaccine-details">
              {selectedCombo ? (
                <div className="homepage-age-vaccine-details-container">
                  <div className="homepage-age-vaccine-details-header">
                    <div>
                      <h2>{selectedCombo.name}</h2>
                      <p>{selectedCombo.description}</p>
                    </div>
                  </div>
                  <div className="homepage-age-vaccine-details-body">
                    <div className="homepage-age-vaccine-details-title">
                      <span>💉</span>
                      <h3>Danh sách vaccine trong combo</h3>
                    </div>
                    {loading ? (
                      <div className="homepage-age-vaccine-loading">
                        <div className="homepage-age-vaccine-spinner"></div>
                      </div>
                    ) : (
                      <div className="homepage-age-vaccine-details-grid">
                        {comboDetails.map((detail) => (
                          <div key={detail.comboDetailId} className="homepage-age-vaccine-detail-item">
                            <div className="homepage-age-vaccine-detail-header">
                              <h4>{detail.vaccine.name}</h4>
                            </div>
                            <div className="homepage-age-vaccine-detail-body">
                              <div className="homepage-age-vaccine-detail-info">
                                <div>
                                  <p>Mô tả:</p>
                                  <p>{detail.vaccine.description}</p>
                                </div>
                                <div>
                                  <p>Xuất xứ:</p>
                                  <p>{detail.vaccine.country}</p>
                                </div>
                                <div>
                                  <p>Số liều:</p>
                                  <p>{detail.vaccine.doseNumber} <span>Liều</span></p>
                                </div>
                                <div>
                                  <p>Độ tuổi:</p>
                                  <p>{detail.vaccine.ageMin} - {detail.vaccine.ageMax} <span>Tuổi</span></p>
                                </div>
                              </div>
                              <div className="homepage-age-vaccine-detail-footer">
                                <span>{formatPrice(detail.vaccine.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="homepage-age-vaccine-placeholder">
                  <span>ℹ️</span>
                  <h2>Chọn Combo Vaccine</h2>
                  <p>Vui lòng chọn một gói combo vaccine từ danh sách bên trái để xem thông tin chi tiết về các loại vaccine có trong gói</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Price Vaccine Section */}
      <section className="homepage-price-vaccine" ref={vaccinePricingRef}>
        <div className="homepage-container">
          <div className="price-vaccine-header">
            <h2 className="price-vaccine-title">
              <FaShieldVirus className="price-vaccine-icon" /> Danh mục vắc xin
            </h2>
            <p className="price-vaccine-subtitle">Theo dõi và lựa chọn vắc xin phù hợp cho lịch tiêm chủng của trẻ</p>
          </div>

          {/* Filter Section */}
          <div className="price-vaccine-filter-container">
            <div className="price-vaccine-filter-price">
              <span>Giá</span>
              <input
                type="text"
                placeholder="Giá từ"
                value={minPrice.toLocaleString()}
                onChange={handleMinPriceChange}
              />
              <span>-</span>
              <input
                type="text"
                placeholder="Giá đến"
                value={maxPrice.toLocaleString()}
                onChange={handleMaxPriceChange}
              />
            </div>
            <div className="price-vaccine-filter-country">
              <FaGlobe className="price-vaccine-filter-icon" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
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
                  className={`price-vaccine-tab ${activeTab === tab.id ? "price-vaccine-tab-active" : ""}`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
            {(selectedCountry || minPrice > 0 || maxPrice < 3000000 || searchQuery) && (
              <button onClick={resetFilters} className="price-vaccine-reset-btn">
                <FiX /> Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="price-vaccine-results">
            <p>
              Hiển thị <span>{filteredVaccinesByPriceAndAge.length}</span> vắc xin
            </p>
          </div>

          {/* Vaccines Grid */}
          {priceLoading ? (
            <div className="price-vaccine-loading">
              <div className="price-vaccine-spinner"></div>
            </div>
          ) : filteredVaccinesByPriceAndAge.length === 0 ? (
            <div className="price-vaccine-no-results">
              <FiInfo className="price-vaccine-no-results-icon" />
              <h3>Không tìm thấy vắc xin</h3>
              <p>Không có vắc xin nào phù hợp với điều kiện tìm kiếm của bạn.</p>
              <button onClick={resetFilters}>Xóa bộ lọc</button>
            </div>
          ) : (
            <div className="price-vaccine-grid">
              {filteredVaccinesByPriceAndAge.map((vaccine) => (
                <motion.div
                  key={vaccine.vaccineId}
                  className="price-vaccine-item"
                  onClick={() => openModal(vaccine)}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="price-vaccine-item-header">
                    <h3>{vaccine.name}</h3>
                    <span>{vaccine.price.toLocaleString()} VND</span>
                  </div>
                  <p>{vaccine.description}</p>
                  <div className="price-vaccine-item-info">
                    <span className={getBadgeColor(vaccine.country)}>{vaccine.country}</span>
                    <span>
                      <FaSyringe /> {vaccine.doseNumber} liều
                    </span>
                  </div>
                  <div className="price-vaccine-item-age">
                    <FaChild /> {vaccine.ageMin}-{vaccine.ageMax} tuổi
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Vaccine Detail Modal */}
          <AnimatePresence>
            {modalIsOpen && selectedVaccine && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="price-vaccine-modal-overlay"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="price-vaccine-modal"
                >
                  <button onClick={closeModal} className="price-vaccine-modal-close">
                    <FaTimes />
                  </button>
                  <h3>{vaccineData?.vaccine.name}</h3>
                  <div className="price-vaccine-modal-age">
                    <FaChild /> {vaccineData?.vaccine.ageMin} - {vaccineData?.vaccine.ageMax} tuổi
                  </div>
                  <div className="price-vaccine-modal-price">{vaccineData?.vaccine.price.toLocaleString()} VND</div>
                  <p>{vaccineData?.vaccine.description}</p>
                  <div className="price-vaccine-modal-details">
                    <div>
                      <span><FaSyringe /> Số liều:</span>
                      <span>{vaccineData?.vaccine.doseNumber}</span>
                    </div>
                    <div>
                      <span><FaGlobe /> Quốc gia:</span>
                      <span className={getBadgeColor(vaccineData?.vaccine.country)}>{vaccineData?.vaccine.country}</span>
                    </div>
                    <div>
                      <span><FaUserClock /> Khoảng cách tiêm:</span>
                      <span>{vaccineData?.day} ngày</span>
                    </div>
                    <div>
                      <span><FaUserClock /> Dung sai:</span>
                      <span>±{vaccineData?.tolerance} ngày</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Process Section */}
      <section className="homepage-process">
        <div className="homepage-container">
          <h2 className="section-title">Quy trình tiêm chủng</h2>
          <div className="process-timeline">
            <div className="timeline-line"></div>
            <div className="timeline-steps">
              {enhancedProcess.map((item) => (
                <div key={item.step} className="timeline-step">
                  <div className="step-marker">
                    <span className="step-number">{item.step.toString().padStart(2, "0")}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="homepage-feedback">
        <div className="homepage-container">
          <h2 className="homepage-section-title">Khách Hàng Nói Gì Về Chúng Tôi</h2>
          {feedbacks.length > 0 ? (
            <div className="homepage-feedback-overflow">
              <div
                ref={feedbackContainerRef}
                className="homepage-feedback-container"
                style={{ transform: `translateX(${translateX}px)` }}
              >
                {feedbacks.map((feedback, index) => (
                  <div key={`${feedback.id}-${index}`} className="homepage-feedback-item">
                    <div className="homepage-feedback-card">
                      <div className="homepage-feedback-header">
                        <div className="homepage-feedback-avatar">
                          {feedback.booking.customer.firstName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="homepage-feedback-name">
                            {feedback.booking.customer.firstName} {feedback.booking.customer.lastName}
                          </h3>
                          <p className="homepage-feedback-date">Ngày đặt: {feedback.booking.bookingDate}</p>
                        </div>
                      </div>
                      <div className="homepage-feedback-rating">{renderStars(feedback.ranking)}</div>
                      <p className="homepage-feedback-comment">"{feedback.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="homepage-feedback-placeholder">Chưa có đánh giá trên 3 sao</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;