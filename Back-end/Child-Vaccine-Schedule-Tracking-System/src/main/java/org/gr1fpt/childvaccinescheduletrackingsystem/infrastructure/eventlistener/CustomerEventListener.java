package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.eventlistener;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.customer.CustomerService;
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
