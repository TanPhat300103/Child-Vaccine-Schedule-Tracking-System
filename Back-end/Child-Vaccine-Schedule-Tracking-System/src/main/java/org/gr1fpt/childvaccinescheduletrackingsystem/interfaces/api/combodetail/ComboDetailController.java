package org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.api.combodetail;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.combodetail.ComboDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.combodetail.ComboDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("combodetail")
@CrossOrigin(origins = "*")
public class ComboDetailController {

    @Autowired
    ComboDetailService comboDetailService;

    @GetMapping
    public java.util.List<ComboDetail> getAll()
    {
        return comboDetailService.getAll();
    }

    @PostMapping("create")
    public ComboDetail create (@RequestBody @Valid ComboDetail comboDetail)
    {
        return comboDetailService.create(comboDetail);
    }

    @PostMapping("add")
    public String add(@RequestBody @Valid List<ComboDetail> comboList){
        return comboDetailService.addListVaccineIntoCombo(comboList);
    }

    @GetMapping("findid")
    public java.util.Optional<ComboDetail> findById(@RequestParam String id)
    {
        return comboDetailService.findById(id);
    }

    @PostMapping("update")
    public ComboDetail update (@RequestBody ComboDetail comboDetail)
    {
        return comboDetailService.update(comboDetail);
    }

    @GetMapping("findcomboid")
    public java.util.List<ComboDetail> findByVaccineComboId(@RequestParam String id)
    {
        return comboDetailService.findByVaccineComboId(id);
    }

    @GetMapping("findvaccineid")
    public java.util.List<ComboDetail> findByVaccineId(@RequestParam String id)
    {
        return comboDetailService.findByVaccineId(id);
    }

    @PostMapping("deletevaccine")
    public void deleteByVaccine(@RequestParam String id){
        comboDetailService.deleteByVaccineId(id);
    }
}
