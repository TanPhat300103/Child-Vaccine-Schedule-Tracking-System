package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.staff;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.staff.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {
    Optional<Staff> findByPhone(String phone);
    Optional<Staff> findByMail(String email);
}
