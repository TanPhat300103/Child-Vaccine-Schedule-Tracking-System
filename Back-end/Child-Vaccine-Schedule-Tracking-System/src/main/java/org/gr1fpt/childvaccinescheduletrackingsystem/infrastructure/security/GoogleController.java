package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.security;


import org.gr1fpt.childvaccinescheduletrackingsystem.domain.customer.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

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
    @GetMapping("myprofile")
    public ResponseEntity<Map<String, Object>> myProfile(@AuthenticationPrincipal Object principal) {
        System.out.println("Principal: " + (principal != null ? principal.getClass().getName() : "null")); // Debug loại của principal

        if (principal == null) {
            System.out.println("Principal is null - Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> profile = new HashMap<>();

        try {
            if (principal instanceof CustomOAuth2User) {
                CustomOAuth2User oauthUser = (CustomOAuth2User) principal;
                profile.put("userId", oauthUser.getUserId());
                profile.put("name", oauthUser.getAttribute("name"));
                profile.put("email", oauthUser.getAttribute("email"));
                profile.put("authorities", oauthUser.getAuthorities());
                System.out.println("OAuth2 User: " + profile); // Debug
            } else if (principal instanceof UserDetails) {
                CustomUserDetail user = (CustomUserDetail) principal;
                profile.put("userId", user.getUserId());
                profile.put("username", user.getUsername());
                profile.put("authorities", user.getAuthorities());
                System.out.println("UserDetails: " + profile); // Debug
            } else {
                profile.put("info", principal.toString());
                System.out.println("Unknown principal type: " + principal.getClass().getName());
            }
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.err.println("Error in myProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
