package org.gr1fpt.childvaccinescheduletrackingsystem.application.combodetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.combodetail.ComboDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.combodetail.ComboDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    // Chỉ gọi count 1 lần, sau đó cho nó tự tăng trong vong lặp để tránh tình trang trùng ID do cơ chế
    // tự tăng không đồng bộ, laàm cho việc thêm dữ liệu thằng comboDetail chưa xuônống cơ sở dữ liệu mà thaănằng count
    // Đã đếm nên sẽ bị truùng id,
    // nguyên  nhân gốc rễ la do cơ chế cache của hibernate First-level Cache trong Persistence Context hoặc Second-level Cache nếu bạn bật) để lưu trữ kết quả của count()
    @Transactional
    public String addListVaccineIntoCombo(List<ComboDetail> comboList){
        long count = comboDetailRepository.count();
        int index = 1;
        for(ComboDetail comboDetail : comboList){
            String newId = "CD" + String.format("%03d", count + index);
            System.out.println("Gán ID mới: " + newId);
            comboDetail.setComboDetailId(newId);
            comboDetailRepository.saveAndFlush(comboDetail);
            index++;
        }
        return "OK";
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
