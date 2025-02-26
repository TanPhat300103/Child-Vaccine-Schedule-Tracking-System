import React, { useEffect, useState } from "react";
import { getVaccineDetail } from "../../apis/api";

const SpecificVaccine = () => {
  const [vaccineData, setVaccineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaccineData = async () => {
      try {
        setLoading(true);
        const data = await getVaccineDetail(); // Call the API function from api.jsx
        setVaccineData(data); // Set the response data to state
      } catch (error) {
        setError("Error fetching vaccine data");
        console.error("Error fetching vaccine data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccineData();
  }, []);

  const { id, vaccine, entryDate, expiredDate, img, day, tolerance, quantity } =
    vaccineData;

  return (
    <div className="vaccine-details">
      <h1>Vaccine Details</h1>
      <div>
        <strong>ID: </strong>
        {id}
      </div>
      <div>
        <strong>Vaccine ID: </strong>
        {vaccine.vaccineId}
      </div>
      <div>
        <strong>Name: </strong>
        {vaccine.name}
      </div>
      <div>
        <strong>Dose Number: </strong>
        {vaccine.doseNumber}
      </div>
      <div>
        <strong>Description: </strong>
        {vaccine.description}
      </div>
      <div>
        <strong>Country: </strong>
        {vaccine.country}
      </div>
      <div>
        <strong>Age Range: </strong>
        {vaccine.ageMin} - {vaccine.ageMax}
      </div>
      <div>
        <strong>Status: </strong>
        {vaccine.active ? "Active" : "Inactive"}
      </div>
      <div>
        <strong>Price: </strong>
        {vaccine.price}
      </div>
      <div>
        <strong>Entry Date: </strong>
        {entryDate}
      </div>
      <div>
        <strong>Expired Date: </strong>
        {expiredDate}
      </div>
      <div>
        <strong>Image: </strong>
        <img src={img} alt="Vaccine" />
      </div>
      <div>
        <strong>Day: </strong>
        {day}
      </div>
      <div>
        <strong>Tolerance: </strong>
        {tolerance}
      </div>
      <div>
        <strong>Quantity: </strong>
        {quantity}
      </div>
    </div>
  );
};

export default SpecificVaccine;
