package org.gr1fpt.childvaccinescheduletrackingsystem.event;

import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class CustomerEventListener {
    @Autowired
    private CustomerService customerService;

    @EventListener
    public void handleCustomerCreate(Customer customer) {
        //bat event
    }

}
