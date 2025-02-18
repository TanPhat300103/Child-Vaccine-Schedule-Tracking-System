package org.gr1fpt.childvaccinescheduletrackingsystem.vaccinecombo;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("vaccinecombo")
public class VaccineComboController {

    @Autowired
    VaccineComboService vaccineComboService;

    @GetMapping
    public java.util.List<VaccineCombo> getAll()
    {
        return vaccineComboService.getAll();
    }

    @PostMapping("create")
    public VaccineCombo create (@RequestBody @Valid VaccineCombo vaccineCombo)
    {
        return vaccineComboService.create(vaccineCombo);
    }

    @GetMapping("findid")
    public Optional<VaccineCombo> findById (@RequestParam String id)
    {
        return vaccineComboService.findById(id);
    }

    @DeleteMapping("delete")
    public void delete(@RequestParam String id)
    {
        vaccineComboService.delete(id);
    }

    @PostMapping("update")
    public VaccineCombo update (@RequestBody VaccineCombo vaccineCombo)
    {
        return vaccineComboService.update(vaccineCombo);
    }

    @PostMapping("active")
    public VaccineCombo active (@RequestParam String id)
    {
        return vaccineComboService.active(id);
    }

    @GetMapping("findname")
    public java.util.List<VaccineCombo> findByName(String name)
    {
        return vaccineComboService.findByNameContain(name);
    }
}
