package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.customer;


import org.gr1fpt.childvaccinescheduletrackingsystem.domain.customer.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository  extends JpaRepository<Customer, String> {

    Optional<Customer> findByPhoneNumber(String phoneNumber);
    Optional<Customer> findByEmail(String email);
}
