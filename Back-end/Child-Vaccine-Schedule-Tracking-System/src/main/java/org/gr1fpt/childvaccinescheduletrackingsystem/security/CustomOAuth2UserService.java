package org.gr1fpt.childvaccinescheduletrackingsystem.security;

import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerService customerService; // Dùng để generate customerId nếu cần

    // Hàm liên kết (linking) tài khoản dựa trên email
    public Customer linkAccount(String email, String givenName, String familyName) {
        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
        Customer customer;
        if (existingCustomer.isPresent()) {
            customer = existingCustomer.get();
            // Nếu muốn cập nhật thông tin từ Google, cập nhật ở đây
//            customer.setFirstName(givenName);
//            customer.setLastName(familyName);
        } else {
            // Nếu chưa tồn tại, tạo mới và lưu vào DB
            customer = new Customer();
            customer.setEmail(email);
            customer.setFirstName(givenName);
            customer.setLastName(familyName);
            customer.setGender(true);
            customer.setRoleId(1);
            customer.setActive(true);
            customer.setCustomerId(customerService.generateCustomerId());
            customerRepository.save(customer);
        }
        return customer;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Lấy thông tin người dùng từ Google
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Lấy các thông tin cần thiết từ Google
        String email = (String) attributes.get("email");
        String givenName = (String) attributes.get("given_name");
        String familyName = (String) attributes.get("family_name");

        // Gọi hàm linking để liên kết account với DB
        Customer customer = linkAccount(email, givenName, familyName);

        // Gán role mặc định (bạn có thể lấy từ DB nếu cần)
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"));

        // Tạo DefaultOAuth2User từ attributes và authorities
        DefaultOAuth2User defaultUser = new DefaultOAuth2User(authorities, attributes, "sub");

        // Trả về CustomOAuth2User với userId được gắn từ DB
        return new CustomOAuth2User(defaultUser, customer.getCustomerId());
    }
}

