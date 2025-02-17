package org.gr1fpt.childvaccinescheduletrackingsystem.admin;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

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

}
