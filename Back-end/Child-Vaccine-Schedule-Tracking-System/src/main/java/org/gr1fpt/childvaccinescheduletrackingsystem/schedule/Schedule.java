package org.gr1fpt.childvaccinescheduletrackingsystem.schedule;

import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
public class Schedule {

    @Autowired
    VaccineDetailRepository vaccineDetailRepo;
    //check quantity neu ve 0 thi set status = 0
    @Scheduled(fixedRate = 60000)
    public void checkQuantity() {
        for(VaccineDetail detail : vaccineDetailRepo.findAll()) {
            if(detail.getQuantity()==0){
                detail.setStatus(false);
                vaccineDetailRepo.save(detail);
            }
        }
    }
}
