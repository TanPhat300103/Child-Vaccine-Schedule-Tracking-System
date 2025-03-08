package org.gr1fpt.childvaccinescheduletrackingsystem.gpt;

import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    @Autowired
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/ai")
    public String getAiResponseWithHistory(@RequestBody Map<String, Object> request) {
        List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");
        String newPrompt = (String) request.get("prompt");

        // Ghép lịch sử thành chuỗi
        String historyText = history != null ? String.join(" ", history.stream()
                .map(msg -> msg.get("sender") + ": " + msg.get("content"))
                .toArray(String[]::new)) : "";

        return aiService.getAiResponseWithHistory(newPrompt, historyText);
    }

    @GetMapping("/ai")
    public String getAiResponse(String prompt) {
        return aiService.getAiResponse(prompt);
    }
}
