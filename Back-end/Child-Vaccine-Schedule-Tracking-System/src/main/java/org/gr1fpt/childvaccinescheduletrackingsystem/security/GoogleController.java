package org.gr1fpt.childvaccinescheduletrackingsystem.security;


import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class GoogleController {

    @Autowired
    CustomOAuth2UserService customOAuth2UserService;

    @Transactional
    @GetMapping("/user")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {


        Map<String, Object> attributes = principal.getAttributes();
        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");

        Customer customer = customOAuth2UserService.linkAccount(email,firstName,lastName);
        attributes.put("userId", customer.getCustomerId());

        return attributes;
    }
}
