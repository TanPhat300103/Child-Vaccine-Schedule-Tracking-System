package com.Group1.Child_Vaccine_Schedule_Tracking_System;

import com.Group1.Child_Vaccine_Schedule_Tracking_System.model.Role;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChildVaccineScheduleTrackingSystemApplication {

	public static void main(String[] args) {
		Role r = new Role(1,"hello");
		System.out.println(r.toString());
	}

}
