import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import "../CamNang/CauHoi.css";
import { useAuth } from "../../components/common/AuthContext";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

function CauHoi() {
  const [openIndex, setOpenIndex] = useState(null);
  const { userInfo } = useAuth();
  const faqs = [
    {
      question: "Trẻ em nên bắt đầu tiêm vaccine từ khi nào?",
      answer:
        "Trẻ em nên bắt đầu tiêm vaccine ngay từ khi mới sinh. Mũi tiêm đầu tiên thường là vaccine viêm gan B, được tiêm trong vòng 24 giờ sau sinh. Sau đó, trẻ sẽ tiếp tục tiêm các mũi khác theo lịch tiêm chủng quốc gia.",
    },
    {
      question: "Lịch tiêm chủng cho trẻ em bao gồm những mũi nào?",
      answer:
        "Lịch tiêm chủng quốc gia cho trẻ em tại Việt Nam bao gồm các mũi quan trọng như: viêm gan B, lao (BCG), bạch hầu, ho gà, uốn ván, bại liệt, sởi, viêm não Nhật Bản, và Hib. Trẻ cần tiêm đầy đủ các mũi từ sơ sinh đến 5 tuổi.",
    },
    {
      question: "Trẻ sơ sinh có cần tiêm vaccine viêm gan B không?",
      answer:
        "Có, vaccine viêm gan B rất quan trọng cho trẻ sơ sinh. Mũi đầu tiên nên được tiêm trong vòng 24 giờ sau sinh để bảo vệ trẻ khỏi nguy cơ lây nhiễm từ mẹ hoặc môi trường xung quanh.",
    },
    {
      question: "Trẻ bị sốt nhẹ có nên tiêm vaccine không?",
      answer:
        "Nếu trẻ chỉ sốt nhẹ (dưới 38°C) và sức khỏe ổn định, vẫn có thể tiêm vaccine. Tuy nhiên, bạn nên tham khảo ý kiến bác sĩ để đảm bảo trẻ đủ sức khỏe và không có dấu hiệu nhiễm trùng nghiêm trọng.",
    },
    {
      question: "Vaccine có thể gây sốt cho trẻ không?",
      answer:
        "Có, sốt nhẹ là phản ứng bình thường sau khi tiêm vaccine, thường kéo dài 1-2 ngày. Đây là dấu hiệu cơ thể trẻ đang xây dựng miễn dịch. Bạn có thể cho trẻ uống paracetamol theo chỉ định của bác sĩ để hạ sốt.",
    },
    {
      question: "Làm sao để giảm đau cho trẻ khi tiêm vaccine?",
      answer:
        "Để giảm đau, bạn có thể cho trẻ bú sữa mẹ hoặc cho uống một chút nước đường trước khi tiêm. Sau khi tiêm, chườm mát chỗ tiêm và ôm ấp trẻ để trẻ cảm thấy an tâm hơn.",
    },
    {
      question: "Trẻ bị dị ứng trứng có tiêm vaccine sởi được không?",
      answer:
        "Vaccine sởi hiện nay thường an toàn cho trẻ dị ứng trứng. Tuy nhiên, nếu trẻ có tiền sử dị ứng nghiêm trọng, bạn nên tham khảo ý kiến bác sĩ để được theo dõi kỹ hơn sau khi tiêm.",
    },
    {
      question: "Trẻ sinh non có cần tiêm vaccine theo lịch không?",
      answer:
        "Trẻ sinh non vẫn cần tiêm vaccine theo lịch tiêm chủng, nhưng thời gian có thể được điều chỉnh tùy theo sức khỏe của trẻ. Bác sĩ sẽ đánh giá và đưa ra lịch tiêm phù hợp.",
    },
    {
      question: "Vaccine BCG có để lại sẹo cho trẻ không?",
      answer:
        "Có, vaccine BCG (phòng lao) thường để lại một vết sẹo nhỏ trên cánh tay trái của trẻ sau khi tiêm khoảng 4-6 tuần. Đây là dấu hiệu bình thường và cho thấy vaccine đã hoạt động hiệu quả.",
    },
    {
      question: "Trẻ tiêm vaccine có cần kiêng tắm không?",
      answer:
        "Không, trẻ vẫn có thể tắm sau khi tiêm vaccine. Tuy nhiên, bạn nên tránh chà xát mạnh vào chỗ tiêm và lau khô kỹ để tránh nhiễm trùng.",
    },
    {
      question: "Vaccine có thể gây phản ứng phụ nghiêm trọng cho trẻ không?",
      answer:
        "Phản ứng phụ nghiêm trọng rất hiếm gặp, thường dưới 1/1.000.000 trường hợp. Các phản ứng nhẹ như sốt, sưng chỗ tiêm là phổ biến hơn. Nếu trẻ có dấu hiệu bất thường như khó thở, co giật, hãy đưa trẻ đến bác sĩ ngay.",
    },
    {
      question: "Trẻ em có cần tiêm vaccine cúm hàng năm không?",
      answer:
        "Có, trẻ từ 6 tháng tuổi trở lên nên tiêm vaccine cúm hàng năm, đặc biệt là trẻ có sức đề kháng yếu hoặc sống ở khu vực có nguy cơ cao. Vaccine cúm giúp giảm nguy cơ mắc bệnh và biến chứng.",
    },
    {
      question: "Vaccine phòng thủy đậu có cần thiết không?",
      answer:
        "Có, vaccine thủy đậu rất cần thiết vì bệnh thủy đậu có thể gây biến chứng nguy hiểm như nhiễm trùng da hoặc viêm phổi. Trẻ nên tiêm 2 liều: liều đầu lúc 12-15 tháng, liều thứ hai lúc 4-6 tuổi.",
    },
    {
      question: "Trẻ em có thể tiêm nhiều vaccine cùng lúc không?",
      answer:
        "Có, trẻ có thể tiêm nhiều vaccine cùng lúc mà không ảnh hưởng đến hiệu quả. Các vaccine được thiết kế để an toàn khi kết hợp, nhưng bác sĩ sẽ quyết định dựa trên tình trạng sức khỏe của trẻ.",
    },
    {
      question: "Trẻ em bị cảm cúm có nên hoãn tiêm vaccine không?",
      answer:
        "Nếu trẻ chỉ bị cảm cúm nhẹ, không sốt cao, vẫn có thể tiêm vaccine. Tuy nhiên, nếu trẻ sốt trên 38°C hoặc có triệu chứng nặng, bạn nên hoãn lại và tham khảo ý kiến bác sĩ.",
    },
    {
      question: "Vaccine có bảo vệ trẻ 100% không?",
      answer:
        "Không vaccine nào bảo vệ 100%, nhưng chúng giúp giảm nguy cơ mắc bệnh nghiêm trọng đáng kể (thường hiệu quả 85-95%). Trẻ vẫn cần duy trì vệ sinh và lối sống lành mạnh để tăng cường bảo vệ.",
    },
    {
      question: "Trẻ em có cần tiêm vaccine viêm não Nhật Bản không?",
      answer:
        "Có, vaccine viêm não Nhật Bản rất quan trọng, đặc biệt ở khu vực có nguy cơ cao. Trẻ nên tiêm 3 liều cơ bản: 2 liều đầu cách nhau 1-2 tuần (từ 1 tuổi), liều thứ 3 sau 1 năm.",
    },
    {
      question: "Làm sao để biết trẻ đã tiêm đủ vaccine chưa?",
      answer:
        "Bạn nên giữ sổ tiêm chủng của trẻ và kiểm tra với bác sĩ định kỳ. Sổ tiêm chủng ghi rõ các mũi đã tiêm và lịch tiêm nhắc lại để đảm bảo trẻ không bỏ sót mũi nào.",
    },
    {
      question: "Trẻ em có cần tiêm vaccine HPV không?",
      answer:
        "Vaccine HPV thường được khuyến cáo cho trẻ từ 9-14 tuổi để phòng ngừa virus gây ung thư cổ tử cung và các bệnh liên quan. Trẻ nên tiêm 2 liều, cách nhau 6-12 tháng.",
    },
    {
      question: "Nếu trẻ bỏ lỡ một mũi vaccine thì phải làm sao?",
      answer:
        "Nếu trẻ bỏ lỡ một mũi, bạn nên đưa trẻ đi tiêm bổ sung sớm nhất có thể. Bác sĩ sẽ tư vấn lịch tiêm bù để đảm bảo trẻ vẫn được bảo vệ đầy đủ mà không cần bắt đầu lại từ đầu.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <Header></Header>{" "}
      <div className="vaccination-faq-page">
        {/* Header */}
        <header className="page-header">
          <div className="header-overlay"></div>
          <Link to="/" className="back-btn">
            <ArrowLeft size={24} /> Quay lại
          </Link>
          <div className="header-content">
            <h1>Câu Hỏi Thường Gặp Về Tiêm Chủng</h1>
            <p>Tìm hiểu thêm để chuẩn bị tốt nhất cho trẻ!</p>
          </div>
        </header>

        {/* FAQ List */}
        <section className="faq-section">
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                  <h3>{faq.question}</h3>
                  <span className="faq-icon">
                    {openIndex === index ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </span>
                </div>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default CauHoi;
