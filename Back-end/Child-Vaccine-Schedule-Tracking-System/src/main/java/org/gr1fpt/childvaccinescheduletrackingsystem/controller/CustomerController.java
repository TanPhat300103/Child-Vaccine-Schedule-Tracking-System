package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    CustomerService customerService;

    @GetMapping
    public List<Customer> getAll ()
    {
        return customerService.getAll();
    }

    @GetMapping("findid")
    public Optional<Customer> findById (@RequestParam String id)
    {
        return customerService.findById(id);
    }

    @PostMapping("create")
    public Customer create (@Valid @RequestBody Customer customer)
    {
        return customerService.create(customer);
    }

    @DeleteMapping("delete")
    public void deleteById (@RequestParam String id)
    {
        customerService.deleteById(id);
    }

    @PostMapping("update")
    public Customer update (@Valid @RequestBody Customer customer)
    {
        return customerService.update(customer);
    }

    @PostMapping("inactive")
    public Customer inactive (@RequestParam String id)
    {
        return customerService.active(id);
    }


}
