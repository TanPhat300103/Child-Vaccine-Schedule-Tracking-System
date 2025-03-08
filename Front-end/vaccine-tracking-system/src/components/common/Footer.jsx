import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
      {/* Upper footer with logo and quick links */}
      <div className="container mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-teal-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 2V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 13H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold">VaccineCare</h2>
            </div>
            <p className="text-teal-100 mb-4">
              Cung cấp dịch vụ tiêm chủng an toàn và hiệu quả cho cộng đồng.
              Chúng tôi cam kết nâng cao sức khỏe và phòng ngừa bệnh tật.
            </p>
            {/* <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                <Youtube size={18} />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-teal-400 pb-2">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-teal-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Trang Chủ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-teal-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Lịch Tiêm Chủng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-teal-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Loại Vaccine
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-teal-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Đặt Lịch Tiêm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-teal-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Câu Hỏi Thường Gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Service Hours */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-teal-400 pb-2">
              Giờ Phục Vụ
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Clock size={18} className="mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Thứ Hai - Thứ Sáu</p>
                  <p className="text-teal-100">8:00 - 18:00</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Thứ Bảy</p>
                  <p className="text-teal-100">8:00 - 16:00</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Chủ Nhật</p>
                  <p className="text-teal-100">8:00 - 12:00</p>
                </div>
              </li>
            </ul>
            <p className="text-sm">Đường dây nóng hỗ trợ 24/7:</p>
            <p className="font-bold text-lg">1900 - 6789</p>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-teal-400 pb-2">
              Liên Hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-2 flex-shrink-0" />
                <p className="text-teal-100">
                  123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                </p>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <p className="text-teal-100">+84 28 1234 5678</p>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <p className="text-teal-100">info@vaccinecenter.vn</p>
              </li>
            </ul>
            <div className="mt-4">
              <a
                href="/login"
                className="inline-block px-4 py-2 bg-white text-teal-600 font-medium rounded-md hover:bg-opacity-90 transition-all duration-300"
              >
                Đặt Lịch Ngay
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer with copyright */}
      <div className="bg-teal-900 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-teal-200 mb-2 md:mb-0">
            © {new Date().getFullYear()} VaccineCenter. Tất cả các quyền được
            bảo lưu.
          </p>
          <div className="flex space-x-4 text-sm text-teal-200">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Site map
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
