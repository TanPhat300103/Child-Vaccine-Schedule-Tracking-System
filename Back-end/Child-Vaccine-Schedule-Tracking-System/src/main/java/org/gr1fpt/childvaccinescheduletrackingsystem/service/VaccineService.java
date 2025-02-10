package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Vaccine;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VaccineService {

    @Autowired
    VaccineRepository vaccineRepository;

    public List<Vaccine> getALl() {
        return vaccineRepository.findAll();
    }

    public Vaccine create(Vaccine vaccine) {
        if (vaccineRepository.existsById(vaccine.getVaccineId()))
            throw new CustomException("Vaccine ID:" + vaccine.getVaccineId() + " Exist", HttpStatus.BAD_REQUEST);
        return vaccineRepository.save(vaccine);
    }

    public Optional<Vaccine> findById(String id) {
        return vaccineRepository.findById(id);
    }

    public void delete(String id) {
        vaccineRepository.deleteById(id);
    }

    public Vaccine active(String id) {
        Vaccine vaccine = vaccineRepository.findById(id).orElseThrow(() -> new CustomException("Child ID: " + id + " does not exist", HttpStatus.BAD_REQUEST));
        if (vaccine.isActive())
            vaccine.setActive(false);
        else
            vaccine.setActive(true);
        return vaccineRepository.save(vaccine);
    }

    public List<Vaccine> findByCountry(String country)
    {
        return vaccineRepository.findByCountry(country);
    }

    public Vaccine update (Vaccine vaccine)
    {
        if(vaccineRepository.existsById(vaccine.getVaccineId()))
            return vaccineRepository.save(vaccine);
            else
            throw new CustomException("Vaccine ID:" + vaccine.getVaccineId() + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public List<Vaccine> findByPrice (int min, int max)
    {
        if (min>=max ||min<0||max<0)
            throw new CustomException("Price not valid", HttpStatus.BAD_REQUEST);
        else
            return vaccineRepository.findByPriceBetween(min, max);
    }
}
