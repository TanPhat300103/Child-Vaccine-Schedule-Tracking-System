package org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.api.admin;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.admin.AdminDashboardService;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.admin.AdminService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.booking.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.admin.Admin;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccine.Vaccine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @Autowired
    private AdminDashboardService adminDashboardService;

    @PostMapping("/create")
    public Admin create(@RequestBody @Valid Admin admin) {
        return adminService.createAdmin(admin);
    }

    @GetMapping
    public Admin getAdmin() {
        return adminService.getAdmin();
    }

    @PostMapping("update")
    public Admin update(@RequestBody @Valid Admin admin) {
        return adminService.updateAdmin(admin);
    }

    @GetMapping("incomebydate")
    public int getIncome(@RequestParam Date date) {
        return adminDashboardService.getIncomeToday(date);
    }

    @GetMapping("incomebyweek")
    public int getIncomeByWeek(@RequestParam Date date) {
        return adminDashboardService.getIncomeByWeek(date);
    }

    @GetMapping("incomebymonth")
    public int getIncomeByMonth(@RequestParam int month, @RequestParam int year) {
        return adminDashboardService.getIncomeByMonth(month, year);
    }

    @GetMapping("incomebyyear")
    public int getIncomeByYear(@RequestParam String year) {
        return adminDashboardService.getIncomeByYear(year);
    }

    @GetMapping("vaccineoutofstock")
    public List<Vaccine> getVaccineOutOfStock() {
        return adminDashboardService.vaccineOutOfStock();
    }

    @GetMapping("expiredvaccine")
    public List<Vaccine> getExpiredVaccine() {
        return adminDashboardService.getExpiredVaccine();
    }

    @GetMapping("bookingtoday")
    public List<Booking> getBookingToday() {
        return adminDashboardService.getBookingByDay();
    }

    @GetMapping("bestvaccine")
    public Map<String,Integer> bestVaccine(){
        return adminDashboardService.getBestsellerVaccine();
    }
}
