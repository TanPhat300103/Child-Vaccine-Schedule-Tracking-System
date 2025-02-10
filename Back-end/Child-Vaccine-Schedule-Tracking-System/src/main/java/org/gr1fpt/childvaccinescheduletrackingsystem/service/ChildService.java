package org.gr1fpt.childvaccinescheduletrackingsystem.service;


import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Child;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.ChildRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChildService {

    @Autowired
    ChildRepository childRepository;
    @Autowired
    CustomerRepository customerRepository;

    public List<Child> getAll() {
        return childRepository.findAll();
    }

    public Optional<Child> findById(String id) {
        return childRepository.findById(id);
    }

    public Child create(Child child) {
        if (customerRepository.findById(child.getCustomer().getCustomerId()).isPresent())
            return childRepository.save(child);
        else
            throw new CustomException("Parent ID:" + child.getChildId() + " khong ton tai", HttpStatus.BAD_REQUEST);
    }

    public void deleteById(String id) {
        childRepository.deleteById(id);
    }

    public Child update(Child child) {

        if (customerRepository.existsById(child.getCustomer().getCustomerId()) && childRepository.existsById(child.getChildId())) {
            return childRepository.save(child);
        } else {
            throw new CustomException("Parent ID or Child ID Not Exist", HttpStatus.BAD_REQUEST);
        }
    }

    public List<Child> findByCustomer(String id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new CustomException("Customer ID: " + id + " does not exist", HttpStatus.BAD_REQUEST));
        return childRepository.findByCustomer(customer);
    }

    public Child active(String id) {
        Child child = childRepository.findById(id).orElseThrow(() -> new CustomException("Child ID: " + id + " does not exist", HttpStatus.BAD_REQUEST));
        if (child.isActive()) {
            child.setActive(false);
        } else {
            child.setActive(true);
        }
        return child;
    }
}
