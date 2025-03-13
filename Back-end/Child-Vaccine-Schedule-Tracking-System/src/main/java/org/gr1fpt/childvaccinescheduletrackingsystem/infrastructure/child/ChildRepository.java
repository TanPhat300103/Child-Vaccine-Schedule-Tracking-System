package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.child;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.child.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, String> {
    List<Child> findByCustomer(Customer customer);
    long countByCustomer_CustomerId(String customerId);
}
