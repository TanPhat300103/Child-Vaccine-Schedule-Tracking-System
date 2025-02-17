package org.gr1fpt.childvaccinescheduletrackingsystem.combodetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ComboDetailService {
    @Autowired
    ComboDetailRepository comboDetailRepository;

    public java.util.List<ComboDetail> getAll() {
        return comboDetailRepository.findAll();
    }

    public ComboDetail create(ComboDetail comboDetail) {
        if (comboDetailRepository.existsById(comboDetail.getComboDetailId()))
            throw new CustomException("Combo Detail ID: " + comboDetail.getComboDetailId() + " Exist", HttpStatus.BAD_REQUEST);
        return comboDetailRepository.save(comboDetail);
    }

    public Optional<ComboDetail> findById(String id) {
        return comboDetailRepository.findById(id);
    }

    public void delete(String id) {
        comboDetailRepository.deleteById(id);
    }

    public ComboDetail update (ComboDetail comboDetail)
    {
        if(comboDetailRepository.existsById(comboDetail.getComboDetailId()))
        {
            return comboDetailRepository.save(comboDetail);

        }
        throw new CustomException("Combo Detail ID:" + comboDetail.getComboDetailId() + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public java.util.List<ComboDetail> findByVaccineComboId(String id)
    {
        return comboDetailRepository.findByVaccineCombo_VaccineComboId(id);
    }

    public java.util.List<ComboDetail> findByVaccineId(String id)
    {
        return comboDetailRepository.findByVaccine_VaccineId(id);
    }
}
