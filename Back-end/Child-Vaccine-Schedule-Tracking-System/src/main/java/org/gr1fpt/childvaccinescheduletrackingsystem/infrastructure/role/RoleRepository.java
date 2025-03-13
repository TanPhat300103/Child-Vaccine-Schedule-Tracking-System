package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.role;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.role.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
}
