package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.VaccineDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("vaccinedetail")
public class VaccineDetailController {
    @Autowired
    VaccineDetailService vaccineDetailService;

    @GetMapping
    public List<VaccineDetail> getAll()
    {
        return vaccineDetailService.getAll();
    }

    @PostMapping("create")
    public VaccineDetail create (@RequestBody VaccineDetail vaccineDetail)
    {
       return vaccineDetailService.create(vaccineDetail);
    }

    @DeleteMapping("delete")
    public void delete (@RequestParam int id)
    {
        vaccineDetailService.delete(id);
    }

    @PostMapping("update")
    public VaccineDetail update (@RequestBody VaccineDetail vaccineDetail)
    {
        return vaccineDetailService.update(vaccineDetail);
    }

    @PostMapping("active")
    public VaccineDetail active (@RequestParam int id)
    {
        return vaccineDetailService.active(id);
    }

    @PostMapping("use")
    public VaccineDetail useNearest (@RequestParam String id)
    {
        return vaccineDetailService.useNearestVaccineDetail(id);
    }

    @GetMapping("findbyvaccine")
    public List<VaccineDetail> findByVaccineId (@RequestParam String id)
    {
        return vaccineDetailService.searchByVaccineParent(id);
    }
}
