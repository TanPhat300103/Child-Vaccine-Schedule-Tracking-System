import React from "react";

const TermsOfService = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Điều Khoản Dịch Vụ</h1>
      <p className="mb-4">Cập nhật lần cuối: [Chèn Ngày]</p>

      <p className="mb-4">
        Chào mừng bạn đến với Hệ thống Đặt Lịch Tiêm Chủng của chúng tôi. Bằng
        cách sử dụng nền tảng của chúng tôi, bạn đồng ý với các Điều Khoản Dịch
        Vụ này. Vui lòng đọc kỹ trước khi tiếp tục.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Chấp Nhận Điều Khoản
      </h2>
      <p className="mb-4">
        Bằng cách truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân
        thủ các Điều Khoản Dịch Vụ này. Nếu bạn không đồng ý, vui lòng không sử
        dụng nền tảng của chúng tôi.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Sử Dụng Dịch Vụ</h2>
      <p className="mb-4">
        Bạn có thể sử dụng nền tảng của chúng tôi để đặt lịch tiêm cho bản thân
        hoặc cho người khác (nếu được ủy quyền). Bạn đồng ý cung cấp thông tin
        chính xác và cập nhật.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Trách Nhiệm Của Người Dùng
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Bạn phải ít nhất 18 tuổi hoặc có sự đồng ý của phụ huynh.</li>
        <li>
          Bạn đồng ý không lạm dụng hệ thống hoặc cung cấp thông tin sai lệch.
        </li>
        <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Chính Sách Đặt Lịch
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Các lịch hẹn phải được đặt trước và xác nhận.</li>
        <li>
          Việc không tham gia lịch hẹn có thể dẫn đến việc hạn chế đặt lịch
          trong tương lai.
        </li>
        <li>Chúng tôi có quyền hủy bỏ hoặc thay đổi lịch hẹn nếu cần thiết.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Quyền Riêng Tư và An Toàn
      </h2>
      <p className="mb-4">
        Dữ liệu cá nhân của bạn sẽ được xử lý theo chính sách{" "}
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          Chính Sách Quyền Riêng Tư
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Giới Hạn Trách Nhiệm
      </h2>
      <p className="mb-4">
        Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, tình cờ
        hoặc hậu quả nào phát sinh từ việc sử dụng dịch vụ của chúng tôi, bao
        gồm nhưng không giới hạn ở các lịch hẹn bị bỏ lỡ, thông tin sai lệch,
        hoặc các sự cố kỹ thuật.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Sửa Đổi Điều Khoản</h2>
      <p className="mb-4">
        Chúng tôi có quyền cập nhật các Điều Khoản này vào bất kỳ thời điểm nào.
        Việc tiếp tục sử dụng dịch vụ sau khi các thay đổi được đăng tải đồng
        nghĩa với việc bạn chấp nhận các Điều Khoản mới.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Thông Tin Liên Hệ</h2>
      <p className="mb-4">
        Nếu bạn có bất kỳ câu hỏi nào về các Điều Khoản này, vui lòng liên hệ
        với chúng tôi qua [Chèn Thông Tin Liên Hệ].
      </p>
    </div>
  );
};

export default TermsOfService;
