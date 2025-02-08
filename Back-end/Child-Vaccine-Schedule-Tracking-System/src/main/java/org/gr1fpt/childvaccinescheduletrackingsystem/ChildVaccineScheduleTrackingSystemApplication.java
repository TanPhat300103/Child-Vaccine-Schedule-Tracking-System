package org.gr1fpt.childvaccinescheduletrackingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChildVaccineScheduleTrackingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChildVaccineScheduleTrackingSystemApplication.class, args);

        System.out.println("FPT hello");
		Student sv1 = new Student(15,"kdz");
		System.out.println(sv1);
	}

}
