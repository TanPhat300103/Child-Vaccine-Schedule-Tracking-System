package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.MedicalHistory;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.MedicalHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("medicalhistory")
public class MedicalHistoryController {

    @Autowired
    MedicalHistoryService medicalHistoryService;

    @GetMapping
    public List<MedicalHistory> getAll()
    {
        return medicalHistoryService.getAll();
    }

    @PostMapping("updatereaction")
    public MedicalHistory updateReaction (@RequestParam String id, String reaction)
    {
        return medicalHistoryService.updateReaction(id,reaction);
    }

    @DeleteMapping("deletebychildid")
    public void deleteAllByChildId(@RequestParam String id)
    {
        medicalHistoryService.deleteAllByChildId(id);
    }
}
