package org.gr1fpt.childvaccinescheduletrackingsystem.repository;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
}
