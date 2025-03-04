package org.gr1fpt.childvaccinescheduletrackingsystem.security;

import org.gr1fpt.childvaccinescheduletrackingsystem.admin.Admin;
import org.gr1fpt.childvaccinescheduletrackingsystem.admin.AdminRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerRepository;

import org.gr1fpt.childvaccinescheduletrackingsystem.staff.Staff;
import org.gr1fpt.childvaccinescheduletrackingsystem.staff.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {

        Optional<Customer> customerOpt = customerRepository.findByPhoneNumber(phoneNumber);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            return buildCustomUserDetails(
                    customer.getCustomerId(), // userId từ DB
                    customer.getPhoneNumber(),
                    customer.getPassword(),
                    "CUSTOMER",
                    customer.isActive());
        }

        Optional<Staff> staffOpt = staffRepository.findByPhone(phoneNumber);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            return buildCustomUserDetails(
                    staff.getStaffId(), // giả sử Staff có staffId
                    staff.getPhone(),
                    staff.getPassword(),
                    "STAFF",
                    staff.isActive());
        }

        Optional<Admin> adminOpt = adminRepository.findByPhone(phoneNumber);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return buildCustomUserDetails(
                    admin.getAdminId(), // giả sử Admin có adminId
                    admin.getPhone(),
                    admin.getPassword(),
                    "ADMIN",
                    admin.isActive());
        }

        throw new UsernameNotFoundException("User not found with phone: " + phoneNumber);
    }

    private UserDetails buildCustomUserDetails(String userId, String username, String password, String roleName, boolean active) {
        if (!active) {
            throw new UsernameNotFoundException("Account is inactive");
        }
        // Tạo authority dựa trên role
        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
        // Tạo đối tượng CustomUserDetails với userId được đưa vào
        return new CustomUserDetail(userId, username, password, authorities, active);
    }
}

