import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaChild, FaSyringe, FaUpload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const ReactVaccine2 = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [data, setData] = useState(null);

  const vaccines = [
    "BCG",
    "Viêm gan B",
    "Bại liệt (IPV)",
    "DPT-VGB-Hib",
    "Sởi-Quai bị-Rubella",
    "Khác",
  ];

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Vui lòng nhập tên trẻ"),
    gender: Yup.string().required("Vui lòng chọn giới tính"),
    dateOfBirth: Yup.date().required("Vui lòng chọn ngày sinh"),
    vaccine: Yup.string().required("Vui lòng chọn loại vaccine"),
    doseNumber: Yup.number().required("Vui lòng nhập số liều"),
    vaccinationDate: Yup.date().required("Vui lòng chọn ngày tiêm"),
    reactionSeverity: Yup.string().required("Vui lòng chọn mức độ phản ứng"),
    reactionDetails: Yup.string().required("Vui lòng mô tả chi tiết phản ứng"),
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setSubmitStatus({
          type: "error",
          message: "Kích thước file không được vượt quá 5MB",
        });
        return;
      }
      if (!file.type.match(/image\/(jpeg|png)/)) {
        setSubmitStatus({
          type: "error",
          message: "Chỉ chấp nhận file JPG hoặc PNG",
        });
        return;
      }
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // After submitting, navigate to the Feedback page
    navigate("/feedback");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A6B8E] flex items-center justify-center gap-2">
            <FaChild className="text-[#3BA5C5]" />
            Theo Dõi Phản Ứng Sau Tiêm Chủng Cho Trẻ
          </h1>
        </div>

        <Formik
          initialValues={{
            fullName: "",
            gender: "",
            dateOfBirth: null,
            vaccine: "",
            doseNumber: "",
            vaccinationDate: null,
            reactionSeverity: "",
            reactionDetails: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên trẻ
                  </label>
                  <Field
                    name="fullName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                    type="text"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giới tính
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày sinh
                  </label>
                  <DatePicker
                    selected={values.dateOfBirth}
                    onChange={(date) => setFieldValue("dateOfBirth", date)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <FaSyringe className="inline mr-2" />
                    Loại vaccine
                  </label>
                  <Field
                    as="select"
                    name="vaccine"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                  >
                    <option value="">Chọn loại vaccine</option>
                    {vaccines.map((vaccine) => (
                      <option key={vaccine} value={vaccine}>
                        {vaccine}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="vaccine"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Liều số
                  </label>
                  <Field
                    name="doseNumber"
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                  />
                  <ErrorMessage
                    name="doseNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày tiêm
                  </label>
                  <DatePicker
                    selected={values.vaccinationDate}
                    onChange={(date) => setFieldValue("vaccinationDate", date)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                  />
                  <ErrorMessage
                    name="vaccinationDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mức độ phản ứng
                </label>
                <Field
                  as="select"
                  name="reactionSeverity"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                >
                  <option value="">Chọn mức độ</option>
                  <option value="mild">Nhẹ</option>
                  <option value="moderate">Vừa</option>
                  <option value="severe">Nặng</option>
                </Field>
                <ErrorMessage
                  name="reactionSeverity"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chi tiết phản ứng
                </label>
                <Field
                  as="textarea"
                  name="reactionDetails"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3BA5C5] focus:ring-[#3BA5C5] sm:text-sm"
                  placeholder="Mô tả chi tiết các triệu chứng"
                />
                <ErrorMessage
                  name="reactionDetails"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FaUpload className="inline mr-2" />
                  Tải ảnh lên
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#3BA5C5] file:text-white
                    hover:file:bg-[#1A6B8E]"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-4 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {submitStatus.message && (
                <div
                  className={`p-4 rounded-md ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3BA5C5] hover:bg-[#1A6B8E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3BA5C5]"
                >
                  Gửi Thông Tin
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReactVaccine2;
