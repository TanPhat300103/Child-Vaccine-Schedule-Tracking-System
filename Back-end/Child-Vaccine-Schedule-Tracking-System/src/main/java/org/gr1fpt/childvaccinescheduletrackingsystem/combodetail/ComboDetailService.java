package org.gr1fpt.childvaccinescheduletrackingsystem.combodetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ComboDetailService {
    @Autowired
    ComboDetailRepository comboDetailRepository;

    public java.util.List<ComboDetail> getAll() {
        return comboDetailRepository.findAll();
    }

    public String generateId() {
        long count = comboDetailRepository.count();
        return "CD" + String.format("%03d", count + 1);
    }

    public ComboDetail create(ComboDetail comboDetail) {
      comboDetail.setComboDetailId(generateId());
      return comboDetailRepository.save(comboDetail);
    }

    public Optional<ComboDetail> findById(String id) {
        return comboDetailRepository.findById(id);
    }

    @Transactional
    public void deleteByVaccineId(String vaccineId) {
        comboDetailRepository.deleteByVaccine_VaccineId(vaccineId);
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
