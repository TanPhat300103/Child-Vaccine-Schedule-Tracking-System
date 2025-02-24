package org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineDetailRepository extends JpaRepository<VaccineDetail, Integer> {
    List<VaccineDetail> findByVaccine_VaccineIdAndQuantityGreaterThanOrderByExpiredDateAsc(String vaccineId, int quantity);
    List<VaccineDetail> findByVaccine_VaccineId(String vaccineId);

}
