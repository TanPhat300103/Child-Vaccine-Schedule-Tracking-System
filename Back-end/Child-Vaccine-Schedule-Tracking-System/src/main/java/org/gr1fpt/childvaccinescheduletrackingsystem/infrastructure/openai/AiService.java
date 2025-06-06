package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.openai;


import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final OpenAiChatModel chatModel;

    @Autowired
    public AiService(OpenAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String getAiResponse(String prompt) {
        // Thêm hướng dẫn súc tích vào prompt trước khi gửi
        String enhancedPrompt = "Bạn là 1 bác sĩ vơi nhiều kinh nghiệm, đặc biệt là với lĩnh vực về tiêm chủng và vaccine, trả lời câu hi của tôi rõ ràng và đầy đủ dựa, giới hạn trong 2-3 câu, tránh lan man, câu hỏi của tôi la : " + prompt;
        return chatModel.call(enhancedPrompt);
    }

    public String getAiResponseWithHistory(String prompt, String history) {
        // Thêm hướng dẫn súc tích và ghép với lịch sử (nếu có)
        String enhancedPrompt =  (history != null ? history + " " : "") + prompt;
        return chatModel.call(enhancedPrompt);
    }
}
