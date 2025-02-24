package org.gr1fpt.childvaccinescheduletrackingsystem.satff;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;

    public List<Staff> getAll() {
        return staffRepository.findAll();
    }

    public Optional<Staff> findById(String id) {
        return staffRepository.findById(id);
    }



    private String generateStaffId() {
        long count = staffRepository.count();
        return "S" + String.format("%02d", count + 1);
    }

    public Staff create(Staff staff) {
            if(staffRepository.findByPhone(staff.getPhone()).isEmpty()) {
            if(staffRepository.findByMail(staff.getMail()).isPresent()) {
                throw new CustomException("Email is exist",HttpStatus.CONFLICT);
            }
            staff.setRoleId(2);
            staff.setStaffId(generateStaffId());
            staff.setActive(true);
            return staffRepository.save(staff);}
            else throw new CustomException("Phone number is exist !!", HttpStatus.CONFLICT);
    }

    public void deleteById(String id) {
        if(staffRepository.existsById(id)){
            staffRepository.deleteById(id);
        }
        else throw new CustomException("Staff ID: " + id + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public Staff update(Staff staff) {
        if(staffRepository.existsById(staff.getStaffId())) {
            return staffRepository.save(staff);
        }
        else{
            throw new CustomException("Staff ID: " + staff.getStaffId() + " does not exist", HttpStatus.BAD_REQUEST);
        }
    }

    public void active(String id) {
        if(staffRepository.existsById(id)) {
            Staff staff = staffRepository.findById(id).orElseThrow();
            if(staff.isActive()) {
                staff.setActive(false);

            }
            else{
                staff.setActive(true);
            }
            staffRepository.save(staff);
        }
        else{
            throw new CustomException("Staff ID: " + id + " does not exist", HttpStatus.BAD_REQUEST);
        }
    }
}
