package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.Child;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.ChildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController()
@RequestMapping("child")
public class ChildController {

    @Autowired
    ChildService childService;

    @GetMapping
    public List<Child> getAll ()
    {
        return childService.getAll();
    }

    @GetMapping("findid")
    public Optional<Child> findById(@RequestParam String id)
    {
        return childService.findById(id);
    }
    @PostMapping("create")
    public Child create (@RequestBody Child child)
    {
       return childService.create(child);
    }

    @DeleteMapping("delete")
    public void deleteById (@RequestParam String id)
    {
        childService.deleteById(id);
    }

    @GetMapping("findbycustomer")
    public List<Child> findByCustomerId(@RequestParam String id)
    {
        return childService.findByCustomer(id);
    }

    @PostMapping("update")
    public Child update (@RequestBody Child child)
    {
        return childService.update(child);
    }

    @PostMapping("active")
    public Child active (@RequestParam String id)
    {
        return childService.active(id);
    }
}
