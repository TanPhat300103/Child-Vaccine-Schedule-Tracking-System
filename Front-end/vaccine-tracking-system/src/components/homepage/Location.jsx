// eslint-disable-next-line no-unused-vars
import React from "react";
import { locations } from "../../stores/data"; // Sử dụng dữ liệu từ file data.js
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const Location = () => {
  return (
    <section id="location" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Địa Điểm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location) => (
            <div
              key={location.name}
              className="bg-card p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">{location.name}</h3>
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-primary mr-2" />
                <p>{location.address}</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-primary mr-2" />
                <p>{location.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Location;
