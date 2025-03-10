package org.gr1fpt.childvaccinescheduletrackingsystem.staff;

import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerService;
import org.gr1fpt.childvaccinescheduletrackingsystem.medicalhistory.MedicalHistory;
import org.gr1fpt.childvaccinescheduletrackingsystem.medicalhistory.MedicalHistoryService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("staffdashboard")
public class StaffDashboard {
    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private VaccineService vaccineService;

    @Autowired
    private MedicalHistoryService medicalHistoryService;

    @GetMapping("get-booking-today")
    public List<BookingDetail> getAllBookingToday() {
        return bookingDetailService.getAllBookingToday();
    }

    @GetMapping("count-customer")
    public long countCustomer() {
        return customerService.countCustomer();
    }

    @GetMapping("count-active-vaccine")
    public long countActiveVaccine() {
        return vaccineService.countActiveVaccine();
    }

    @GetMapping("get-reaction")
    public List<MedicalHistory> getReaction(){
        return medicalHistoryService.getReaction();
    }

}
