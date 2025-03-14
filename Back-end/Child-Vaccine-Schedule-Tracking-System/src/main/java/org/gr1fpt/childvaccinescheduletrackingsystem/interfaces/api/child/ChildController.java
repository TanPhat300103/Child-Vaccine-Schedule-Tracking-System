package org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.api.child;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.child.ChildService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.child.Child;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController()
@RequestMapping("child")
@CrossOrigin(origins = "*")
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
    public Child create (@RequestBody @Valid Child child)
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
    public Child update (@RequestBody @Valid Child child)
    {
        return childService.update(child);
    }

    @PostMapping("active")
    public Child active (@RequestParam String id)
    {
        return childService.active(id);
    }
}
