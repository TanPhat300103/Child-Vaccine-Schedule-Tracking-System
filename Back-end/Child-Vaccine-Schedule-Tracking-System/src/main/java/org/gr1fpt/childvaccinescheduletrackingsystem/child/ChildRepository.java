package org.gr1fpt.childvaccinescheduletrackingsystem.child;

import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, String> {
    List<Child> findByCustomer(Customer customer);
    long countByCustomer_CustomerId(String customerId);
}
