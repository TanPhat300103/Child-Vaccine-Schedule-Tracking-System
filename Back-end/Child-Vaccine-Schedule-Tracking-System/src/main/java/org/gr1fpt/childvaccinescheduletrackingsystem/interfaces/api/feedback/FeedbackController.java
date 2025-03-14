package org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.api.feedback;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.feedback.FeedbackService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.feedback.Feedback;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.feedback.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("feedback")
public class FeedbackController {
    @Autowired
    FeedbackService feedbackService;
    @Autowired
    private FeedbackRepository feedbackRepository;

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping("getbyid")
    public Feedback getFeedbackById(@RequestParam int id) {
        return feedbackService.getFeedbackById(id);
    }

    @GetMapping("getbybooking")
    public Feedback getFeedbackByBooking(@RequestParam String bookingId) {
        return feedbackService.getFeedbackByBookingId(bookingId);
    }

    @PostMapping("create")
    public Feedback createFeedback(@RequestBody @Valid Feedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    @GetMapping("findbyranking")
    public List<Feedback> findFeedbackByRanking(@RequestParam int ranking) {
        return feedbackService.getFeedbackByRanking(ranking);
    }

    @GetMapping("findbyrankinggreater")
    public List<Feedback> findFeedbackByRankingGreater(@RequestParam int ranking) {
        return feedbackService.getFeedBackByRakingGreater(ranking);
    }

    @PostMapping("update")
    public Feedback updateFeedback(@RequestBody @Valid Feedback feedback) {
        return feedbackService.updateFeedback(feedback);
    }

    @DeleteMapping("delete")
    public void deleteFeedback(@RequestParam int id) {
        feedbackService.deleteFeedback(id);
    }
}
