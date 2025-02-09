package org.gr1fpt.childvaccinescheduletrackingsystem.repository;


import org.gr1fpt.childvaccinescheduletrackingsystem.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository  extends JpaRepository<Customer, String> {

    Optional<Customer> findByPhoneNumber(String phoneNumber);
}
