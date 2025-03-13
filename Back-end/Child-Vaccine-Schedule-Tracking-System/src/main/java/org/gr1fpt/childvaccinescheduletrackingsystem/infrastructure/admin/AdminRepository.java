package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.admin;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.admin.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByPhone(String phoneNumber);
}
