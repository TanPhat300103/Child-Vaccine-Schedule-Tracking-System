package org.gr1fpt.childvaccinescheduletrackingsystem.customer;


import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {


    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Optional<Customer> findById(String id) {
        return customerRepository.findById(id);
    }

    public Customer create(Customer customer) {

        if (customerRepository.findByPhoneNumber(customer.getPhoneNumber()) != null) {
            throw new CustomException("Phone number is exist ",HttpStatus.BAD_REQUEST);
        }
        if(customerRepository.findByEmail(customer.getEmail()) != null) {
            throw new CustomException("Email is exist ",HttpStatus.BAD_REQUEST);
        }
        customer.setRoleId(1);
        customer.setCustomerId(generateCustomerId());
        customer.setActive(true);
        return customerRepository.save(customer);
    }

    private String generateCustomerId() {
        long count = customerRepository.count();
        return "C" + String.format("%03d", count + 1);
    }

    public void deleteById(String id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
        } else {
            throw new CustomException("Customer ID:" + id + " does not exist", HttpStatus.BAD_REQUEST);
        }
    }

    public Customer update(Customer customer) {
        if (customerRepository.existsById(customer.getCustomerId())) {
            return customerRepository.save(customer);
        } else {
            throw new CustomException("Customer ID:" + customer.getCustomerId() + " does not exist", HttpStatus.BAD_REQUEST);
        }
    }

    public Customer active(String id) {
        Customer c1 = customerRepository.findById(id).orElseThrow(() -> new CustomException("Customer ID: " + id + " does not exist", HttpStatus.BAD_REQUEST));
        if (c1.isActive()) {
            c1.setActive(false);
        } else
            c1.setActive(true);
        return customerRepository.save(c1);

    }

}
