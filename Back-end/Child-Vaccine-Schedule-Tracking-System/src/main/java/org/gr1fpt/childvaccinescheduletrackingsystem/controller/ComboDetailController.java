package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.ComboDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.ComboDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("combodetail")
public class ComboDetailController {

    @Autowired
    ComboDetailService comboDetailService;

    @GetMapping
    public java.util.List<ComboDetail> getAll()
    {
        return comboDetailService.getAll();
    }

    @PostMapping("create")
    public ComboDetail create (@RequestBody ComboDetail comboDetail)
    {
        return comboDetailService.create(comboDetail);
    }

    @GetMapping("findid")
    public java.util.Optional<ComboDetail> findById(@RequestParam String id)
    {
        return comboDetailService.findById(id);
    }

    @DeleteMapping("delete")
    public void delete(@RequestParam String id)
    {
        comboDetailService.delete(id);
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
}
