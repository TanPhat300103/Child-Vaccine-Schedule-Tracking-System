package org.gr1fpt.childvaccinescheduletrackingsystem.admin;


import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    private String generateId() {
        long count = adminRepository.count();
        return "A" + String.format("%02d", count + 1);
    }

    public Admin createAdmin(Admin admin) {
        admin.setAdminId(generateId());
        return adminRepository.save(admin);
    }

    public Admin getAdmin() {
        return adminRepository.findAll().get(0);
    }

    public Admin updateAdmin(Admin admin) {
        if(!admin.getAdminId().isEmpty()){
            return adminRepository.save(admin);
        }
        else throw new CustomException("Not Found", HttpStatus.NOT_FOUND);
    }


}
