package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.vaccinecombo;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinecombo.VaccineCombo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineComboRepository extends JpaRepository<VaccineCombo,String > {

    @Query("SELECT v FROM VaccineCombo v WHERE v.name LIKE %:name%")
    List<VaccineCombo> findByNameContaining(@Param("name") String name);
}
