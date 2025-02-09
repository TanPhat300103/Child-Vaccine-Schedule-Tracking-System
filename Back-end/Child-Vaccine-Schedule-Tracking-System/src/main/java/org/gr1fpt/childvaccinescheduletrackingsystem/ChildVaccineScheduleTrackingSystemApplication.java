package org.gr1fpt.childvaccinescheduletrackingsystem;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.Child;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.ChildService;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;

import java.sql.Date;


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
        System.out.println("Child:");
        ChildService action2 = context.getBean(ChildService.class);
        System.out.println(action2.getAll());

        Child ch1 = new Child(
                "2",                  // childId
                action.findById("1").orElseThrow(),                // customer
                "Thuyền",                  // firstName
                "Điêu",                   // lastName
                false,                    // gender
                Date.valueOf("2020-03-02"), // dob
                "None",                // contraindications
                true
        );
        System.out.println( action2.findByCustomer(action.findById("1").orElseThrow()));;



    }

}
