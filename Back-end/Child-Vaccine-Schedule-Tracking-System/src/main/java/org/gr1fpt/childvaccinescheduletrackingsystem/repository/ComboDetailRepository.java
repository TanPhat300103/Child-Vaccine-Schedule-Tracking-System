package org.gr1fpt.childvaccinescheduletrackingsystem.repository;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.ComboDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComboDetailRepository extends JpaRepository<ComboDetail,String> {
    List<ComboDetail> findByVaccineCombo_VaccineComboId(String vaccineComboId);
    List<ComboDetail> findByVaccine_VaccineId(String vaccineId);
}
