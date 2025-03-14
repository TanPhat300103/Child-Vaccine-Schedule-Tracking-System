package org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.api.customer;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.customer.CustomerService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.security.CustomOAuth2User;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.security.CustomUserDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    CustomerService customerService;

    @GetMapping
    public List<Customer> getAll() {
        return customerService.getAll();
    }

    @GetMapping("findid")
    public Optional<Customer> findById(@RequestParam String id) {
        return customerService.findById(id);
    }

    @PostMapping("create")
    public Customer create(@RequestBody @Valid Customer customer) {
        return customerService.create(customer);
    }

    @DeleteMapping("delete")
    public void deleteById(@RequestParam String id) {
        customerService.deleteById(id);
    }

    @PostMapping("update")
    public Customer update(@Valid @RequestBody Customer customer) {
        return customerService.update(customer);
    }

    @PostMapping("inactive")
    public Customer inactive(@RequestParam String id) {
        return customerService.active(id);
    }

    @GetMapping("myprofile")
    public ResponseEntity<Map<String, Object>> myProfile(@AuthenticationPrincipal Object principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> profile = new HashMap<>();

        if (principal instanceof CustomOAuth2User) {
            CustomOAuth2User oauthUser = (CustomOAuth2User) principal;
            profile.put("userId", oauthUser.getUserId());
            profile.put("name", oauthUser.getAttribute("name"));
            profile.put("email", oauthUser.getAttribute("email"));
            profile.put("authorities", oauthUser.getAuthorities());
        } else if (principal instanceof UserDetails) {
            CustomUserDetail user = (CustomUserDetail) principal;
            profile.put("userId", user.getUserId());
            profile.put("username", user.getUsername());
            profile.put("authorities", user.getAuthorities());
        } else {
            profile.put("info", principal.toString());
        }
        return ResponseEntity.ok(profile);
    }


}
