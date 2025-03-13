package org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.application.vaccinedetail.VaccineDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinedetail.VaccineDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("vaccinedetail")
@CrossOrigin(origins = "*")
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
