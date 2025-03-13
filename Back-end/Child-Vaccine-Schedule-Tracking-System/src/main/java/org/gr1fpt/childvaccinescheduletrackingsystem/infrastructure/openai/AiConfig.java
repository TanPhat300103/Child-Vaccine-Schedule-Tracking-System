package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.openai;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Value("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")
    private String apiKey;

    @Value("${spring.ai.openai.chat.options.model:gpt-3.5-turbo}") // Giá trị mặc định
    private String model;

    @Value("${spring.ai.openai.chat.options.temperature:0.7}") // Giá trị mặc định
    private Double temperature;
}
