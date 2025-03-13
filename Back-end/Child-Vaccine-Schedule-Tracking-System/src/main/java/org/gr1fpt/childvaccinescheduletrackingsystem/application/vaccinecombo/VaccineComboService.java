package org.gr1fpt.childvaccinescheduletrackingsystem.application.vaccinecombo;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinecombo.VaccineCombo;
import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.vaccinecombo.VaccineComboRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VaccineComboService {

    @Autowired
    VaccineComboRepository vaccineComboRepository;

    public java.util.List<VaccineCombo> getAll() {
        return vaccineComboRepository.findAll();
    }

    private String generateId() {
        long count = vaccineComboRepository.count()+1;
        return String.valueOf(count);
    }

    public VaccineCombo create(VaccineCombo vaccineCombo) {
        vaccineCombo.setVaccineComboId(generateId());
        return vaccineComboRepository.save(vaccineCombo);
    }



    public Optional<VaccineCombo> findById(String id) {
        return vaccineComboRepository.findById(id);
    }

    public void delete(String id) {
        vaccineComboRepository.deleteById(id);
    }

    public VaccineCombo update(VaccineCombo vaccineCombo) {
        if (vaccineComboRepository.existsById(vaccineCombo.getVaccineComboId())) {
            return vaccineComboRepository.save(vaccineCombo);
        } else
            throw new CustomException("Vaccine Combo ID:" + vaccineCombo.getVaccineComboId() + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public VaccineCombo active (String id)
    {
        VaccineCombo vaccineCombo = vaccineComboRepository.findById(id).orElseThrow(() -> new CustomException("Vaccine Combo ID : " + id + " does not exist", HttpStatus.BAD_REQUEST));
        if (vaccineCombo.isActive())
        {
            vaccineCombo.setActive(false);
        }
        else
            vaccineCombo.setActive(true);
        return vaccineComboRepository.save(vaccineCombo);
    }

    public java.util.List<VaccineCombo> findByNameContain (String name)
    {
        return vaccineComboRepository.findByNameContaining(name);
    }


}
