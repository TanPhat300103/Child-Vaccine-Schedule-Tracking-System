// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Header from "../components/common/Header";
import Navigation from "../components/common/Navigation";
import Banner from "../components/common/Banner";
import Footer from "../components/common/Footer";
import Introduction from "../components/homepage/Introduction";
import VaccinePackages from "../components/homepage/VaccinePackages";
import VaccinationProcess from "../components/homepage/VaccineProcess";
import Location from "../components/homepage/Location";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("introduction");

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <Banner />
      <br></br>
      <Introduction />
      <VaccinePackages />
      <VaccinationProcess />
      <Location />
      <Footer />
    </div>
  );
};

export default App;
