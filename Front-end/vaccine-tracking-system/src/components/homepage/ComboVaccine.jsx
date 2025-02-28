import React, { useEffect, useState } from "react";
import { FaSyringe, FaRegCalendarCheck, FaInfoCircle } from "react-icons/fa";
import { MdChildCare, MdClose } from "react-icons/md";
import { useCart } from "./AddCart";
import { useNavigate } from "react-router-dom";
import { getVaccineCombos, getVaccinesByAge } from "../../apis/api";

const ComboVaccine = () => {
  const [selectedAge, setSelectedAge] = useState("0-2");
  const [showModal, setShowModal] = useState(false);
  const [vaccineData, setVaccineData] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // take api vaccine by age
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data = await getVaccineCombos();

        setVaccineData(data);
        console.log("vaccine combo data: ", vaccineData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchVaccines();
  }, []);

  return <div>hello</div>;
};

export default ComboVaccine;
