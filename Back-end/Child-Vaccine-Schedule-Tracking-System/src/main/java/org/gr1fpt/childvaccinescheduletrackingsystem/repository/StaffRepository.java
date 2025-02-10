package org.gr1fpt.childvaccinescheduletrackingsystem.repository;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, String> {
    Optional<Staff> findByPhone(String phone);
}
