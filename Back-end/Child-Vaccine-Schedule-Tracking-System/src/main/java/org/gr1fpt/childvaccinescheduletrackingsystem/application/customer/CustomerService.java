package org.gr1fpt.childvaccinescheduletrackingsystem.application.customer;


import org.gr1fpt.childvaccinescheduletrackingsystem.domain.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.customer.CustomerRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {


    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Optional<Customer> findById(String id) {
        return customerRepository.findById(id);
    }

    public Customer create(Customer customer) {

        if (customerRepository.findByPhoneNumber(customer.getPhoneNumber()).isPresent()) {
            throw new CustomException("Phone number is exist ",HttpStatus.BAD_REQUEST);
        }
        
        if(customerRepository.findByEmail(customer.getEmail()) .isPresent()) {
            throw new CustomException("Email is exist ",HttpStatus.BAD_REQUEST);
        }
        customer.setRoleId(1);
        customer.setCustomerId(generateCustomerId());
        customer.setActive(true);
        applicationEventPublisher.publishEvent(customer);
        return customerRepository.save(customer);
        //return customer;
    }

    public String generateCustomerId() {
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
        if(customerRepository.findByEmail(customer.getEmail()) .isPresent()) {
            Customer customer1 = customerRepository.findByEmail(customer.getEmail()).get();

            if(!customer1.getCustomerId().equals(customer.getCustomerId()))
                throw new CustomException("Email is exist ",HttpStatus.BAD_REQUEST);
        }
        if( customer.getPhoneNumber() != null &&customerRepository.findByPhoneNumber(customer.getPhoneNumber()).isPresent()) {
            Customer customer1 = customerRepository.findByPhoneNumber(customer.getPhoneNumber()).get();

            if(!customer1.getCustomerId().equals(customer.getCustomerId()))
                throw new CustomException("Phone is exist ",HttpStatus.BAD_REQUEST);
        }
        if (customerRepository.existsById(customer.getCustomerId())) {
            return customerRepository.save(customer);
        } else {
            throw new CustomException("Customer ID:" + customer.getCustomerId() + " does not exist", HttpStatus.BAD_REQUEST);
        }
    }

    public Customer active(String id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new CustomException("Customer ID: " + id + " does not exist", HttpStatus.BAD_REQUEST));

        if (customer.isActive()) {
            customer.setActive(false);
        }
        else
        {
            customer.setActive(true);}
        return customerRepository.save(customer);

    }

    //hàm này chỉ để lấy số liệu bên staff
    public long countCustomer(){
        return customerRepository.count();
    }

}
