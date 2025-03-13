package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.vaccinedetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinedetail.VaccineDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineDetailRepository extends JpaRepository<VaccineDetail, Integer> {
    // KHÔNG DĐƯỢC SÀI REPO NÀY NỮA VÌ THIẾU ĐIÊU KIỆN STATUS
    //    List<VaccineDetail> findByVaccine_VaccineIdAndQuantityGreaterThanOrderByExpiredDateAsc(String vaccineId, int quantity);
    //    List<VaccineDetail> findByVaccine_VaccineId(String vaccineId);

    List<VaccineDetail> findByVaccine_VaccineIdAndStatusTrue(String vaccineId);
    VaccineDetail findFirstByVaccine_VaccineIdAndStatusTrueOrderByExpiredDateAsc(String vaccineId);
    List<VaccineDetail> findByVaccine_VaccineIdAndQuantityGreaterThanAndStatusTrueOrderByExpiredDateAsc(String vaccineId, int quantity);
}
