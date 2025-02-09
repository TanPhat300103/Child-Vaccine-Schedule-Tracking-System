package org.gr1fpt.childvaccinescheduletrackingsystem;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;

import java.sql.Date;
import java.time.LocalDate;

@SpringBootApplication
public class ChildVaccineScheduleTrackingSystemApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(ChildVaccineScheduleTrackingSystemApplication.class, args);
        System.out.println("FPT hello");
        CustomerService action = context.getBean(CustomerService.class);

        System.out.println("Test Get All: ");
        System.out.println(action.getAll());

        System.out.println("Test Find By ID: ");
        System.out.println(action.findById("1"));

        System.out.println("Test Create New Customer: ");
        Customer c1 = new Customer(
                "3",
                "0933448892",
                "Tân",
                "Otaku",
                Date.valueOf("2004-03-09"),
                true,
                "123",
                "TpHcm",
                "VietcomBank",
                "TanOtaku@fpt.com",
                1,
                true
        );
        //action.create(c1);

        System.out.println(" Test delete by ID: ");
       // action.deleteById("3");
    }

}
