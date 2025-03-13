package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.medicalhistory;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.medicalhistory.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory,String> {

    void deleteAllByChild_ChildId(String childId);
    List<MedicalHistory> findByChild_ChildId(String childId); // Tìm danh sách theo childId

    public List<MedicalHistory> getAllByReactionIsNotNull();
}
