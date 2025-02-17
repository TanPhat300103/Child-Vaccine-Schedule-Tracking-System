// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import HeaderHome from "../../components/OtherCompo/HeaderHome";
import Introduction from "../../components/OtherCompo/Introduction";
import Location from "../../components/OtherCompo/Location";
import VaccinePackages from "../../components/OtherCompo/VaccinePackages";
import VaccinationProcess from "../../components/OtherCompo/VaccineProcess";

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
