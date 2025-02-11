package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.VaccineCombo;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.VaccineComboRepository;
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

    public VaccineCombo create(VaccineCombo vaccineCombo) {
        if (vaccineComboRepository.existsById(vaccineCombo.getVaccineComboId()))
            throw new CustomException("Vaccine Combo ID: " + vaccineCombo.getVaccineComboId() + " Exist", HttpStatus.BAD_REQUEST);
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
