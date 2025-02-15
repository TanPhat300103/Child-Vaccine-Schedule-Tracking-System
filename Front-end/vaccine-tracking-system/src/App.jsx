// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Introduction from "./components/OtherCompo/Introduction";
import VaccinePackages from "./components/OtherCompo/VaccinePackages";
import VaccinationProcess from "./components/OtherCompo/VaccineProcess";
import Location from "./components/OtherCompo/Location";

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
