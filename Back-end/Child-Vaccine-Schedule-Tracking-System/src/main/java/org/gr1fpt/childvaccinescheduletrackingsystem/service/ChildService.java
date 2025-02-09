package org.gr1fpt.childvaccinescheduletrackingsystem.service;


import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Child;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.ChildRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChildService {

    @Autowired
    ChildRepository childRepository;

    public List<Child> getAll ()
    {
        return childRepository.findAll();
    }

    public Optional<Child> findById(String id)
    {
        return childRepository.findById(id);
    }

    public Child create (Child child)
    {
        return childRepository.save(child);
    }

    public void deleteById ( String id)
    {
        childRepository.deleteById(id);
    }

    public Child update (Child child)
    {
        if (childRepository.existsById(child.getChildId()))
        {
            return childRepository.save(child);
        }
        else {
            throw new CustomException("Child ID:" + child.getChildId() + " khong ton tai", HttpStatus.BAD_REQUEST);
        }
    }

    public List<Child> findByCustomer(Customer customer) {
        return childRepository.findByCustomer(customer);
    }
}
