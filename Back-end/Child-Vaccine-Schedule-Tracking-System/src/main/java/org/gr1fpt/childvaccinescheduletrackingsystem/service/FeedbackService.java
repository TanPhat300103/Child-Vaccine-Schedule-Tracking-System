package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Feedback;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Feedback getFeedbackById(int id) {
        return feedbackRepository.findById(String.valueOf(id)).orElseThrow(() -> new CustomException("Feedback ID" + id + " not found", HttpStatus.BAD_REQUEST));
    }

    public Feedback getFeedbackByBookingId(String bookingId) {
        return feedbackRepository.findByBooking_BookingId(bookingId);
    }

    public List<Feedback> getFeedbackByRanking(int ranking) {
        return feedbackRepository.findByRanking(ranking);
    }

    public List<Feedback> getFeedBackByRakingGreater(int raking) {
        return feedbackRepository.findByRankingGreaterThanEqual(raking);
    }

    public Feedback saveFeedback(Feedback feedback) {
        if(bookingRepository.existsById(feedback.getBooking().getBookingId())) {
            return feedbackRepository.save(feedback);
        }
        else throw new CustomException("Booking ID " + feedback.getBooking().getBookingId()+" does not exist", HttpStatus.BAD_REQUEST);
    }

    public Feedback updateFeedback(Feedback feedback) {
        if(feedbackRepository.existsById(String.valueOf(feedback.getId()))) {
            if(bookingRepository.existsById(feedback.getBooking().getBookingId())) {
                return feedbackRepository.save(feedback);
            }
            else throw new CustomException("BookingId " + feedback.getBooking().getBookingId()+" does not exist", HttpStatus.BAD_REQUEST);
        }
        else throw new CustomException("Feedback ID" + feedback.getId() + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public void deleteFeedback(int id) {
        if(feedbackRepository.existsById(String.valueOf(id))) {
            feedbackRepository.deleteById(String.valueOf(id));
        }
        else throw new CustomException("Feedback ID" + id + " does not exist", HttpStatus.BAD_REQUEST);
    }

}
