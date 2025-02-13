// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import HeaderHome from "../../components/OtherCompo/HeaderHome";
import Navigation from "../../components/Navigation";
import Banner from "../../components/Banner";
import Introduction from "../../components/OtherCompo/Introduction";
import VaccinePackages from "../../components/OtherCompo/VaccinePackages";
import VaccinationProcess from "../../components/OtherCompo/VaccineProcess";
import Location from "../../components/OtherCompo/Location";
import Footer from "../../components/Footer";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("introduction");

  return (
    <div className="min-h-screen bg-background font-inter">
      <HeaderHome isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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

export default Home;
