package org.gr1fpt.childvaccinescheduletrackingsystem.application.vaccinedetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.application.vaccine.VaccineService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccine.Vaccine;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinedetail.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.vaccine.VaccineRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.vaccinedetail.VaccineDetailRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VaccineDetailService {
    @Autowired
    VaccineDetailRepository vaccineDetailRepository;
    @Autowired
    VaccineRepository vaccineRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;
    @Autowired
    private VaccineService vaccineService;

    public List<VaccineDetail> getAll() {
        return vaccineDetailRepository.findAll();
    }



    public VaccineDetail create(VaccineDetail vaccineDetail) {
        if (!vaccineRepository.existsById(vaccineDetail.getVaccine().getVaccineId())) {
            throw new CustomException("Vaccine Id" + vaccineDetail.getVaccine().getVaccineId() + "does not exist", HttpStatus.BAD_REQUEST);
        }
        VaccineDetail savedVaccineDetail =   vaccineDetailRepository.save(vaccineDetail);
        Vaccine vaccine = vaccineService.findById(savedVaccineDetail.getVaccine().getVaccineId()).orElseThrow();
        vaccine.setActive(true);
        vaccineService.update(vaccine);

        return savedVaccineDetail;
    }

    public void delete(int id) {
        vaccineDetailRepository.deleteById(id);
    }

    public VaccineDetail update(VaccineDetail vaccineDetail) {
        if (vaccineDetailRepository.existsById(vaccineDetail.getId())) {
            return vaccineDetailRepository.save(vaccineDetail);
        } else
            throw new CustomException("Vaccine ID:" + vaccineDetail.getId() + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public VaccineDetail active(int id) {
        VaccineDetail vaccineDetail = vaccineDetailRepository.findById(id).orElseThrow(() -> new CustomException("Vaccine ID: " + id + " does not exist", HttpStatus.BAD_REQUEST));
        if (vaccineDetail.isStatus()) {
            vaccineDetail.setStatus(false);

        } else {
            vaccineDetail.setStatus(true);
        }
        //Sau khi active/unactive 1 vaccine detail se di kiem tat ca vaccinedetail khac, neu All False thi set vaccine False
        // Neu co it nhat 1 thang true thi vaccine se len true
        Vaccine vaccine = vaccineDetail.getVaccine();
        int flag = 0;
        for (VaccineDetail detail : searchByVaccineParent(vaccine.getVaccineId())) {
            if (detail.isStatus()) {
                flag = 1;
                break;
            }
        }
        if (flag == 0) {
            vaccine.setActive(false);
            vaccineService.update(vaccine);
        }
        else
        {
            vaccine.setActive(true);
            vaccineService.update(vaccine);
        }
        return vaccineDetailRepository.save(vaccineDetail);
    }

    public VaccineDetail useNearestVaccineDetail(String vaccineId) {
        List<VaccineDetail> vaccineDetails = vaccineDetailRepository.findByVaccine_VaccineIdAndQuantityGreaterThanAndStatusTrueOrderByExpiredDateAsc(vaccineId, 0);
        if (vaccineDetails.isEmpty()) {
            throw new CustomException("No available VaccineDetail for Vaccine ID: " + vaccineId, HttpStatus.BAD_REQUEST);
        }
        VaccineDetail nearestVaccineDetail = vaccineDetails.getFirst();
        nearestVaccineDetail.setQuantity(nearestVaccineDetail.getQuantity() - 1);
        if (nearestVaccineDetail.getQuantity() < 10) {
            System.out.println("Nearest VaccineDetail Quantity less than 10");
            eventPublisher.publishEvent(nearestVaccineDetail);
        }
        return vaccineDetailRepository.save(nearestVaccineDetail);
    }

    public List<VaccineDetail> searchByVaccineParent(String vaccineId) {
        if (vaccineRepository.existsById(vaccineId))
            return vaccineDetailRepository.findByVaccine_VaccineId(vaccineId);
        else
            throw new CustomException("Vaccine ID:" + vaccineId + " does not exist", HttpStatus.BAD_REQUEST);
    }


}
