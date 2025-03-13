package org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.application.bookingdetail.BookingDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.bookingdetail.BookingDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("bookingdetail")
@CrossOrigin(origins = "*")
public class BookingDetailController {

    @Autowired
    BookingDetailService bookingDetailService;

    @GetMapping
    public List<BookingDetail> getAll()
    {
        return bookingDetailService.getAll();
    }

    @PostMapping("updatestatus")
    public BookingDetail updateStatus (@RequestParam String id, int status)
    {
        return bookingDetailService.updateStatus(id,status);
    }

    @GetMapping("findbybooking")
    public List<BookingDetail> findByBookingId(@RequestParam String id)
    {
        return bookingDetailService.findByBooking(id);
    }

    @PostMapping("confirmdate")
    public BookingDetail confirmAdministeredDate(@RequestParam String id)
    {
        return bookingDetailService.confirmAdministeredDate(id);
    }

    @PostMapping("updatereaction")
    public BookingDetail updateReactionNote(@RequestParam String id, String reaction)
    {
        return  bookingDetailService.updateReaction(id,reaction);
    }
}
