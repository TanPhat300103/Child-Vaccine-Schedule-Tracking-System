package org.gr1fpt.childvaccinescheduletrackingsystem.repository;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory,String> {

    void deleteAllByChild_ChildId(String childId);
}
