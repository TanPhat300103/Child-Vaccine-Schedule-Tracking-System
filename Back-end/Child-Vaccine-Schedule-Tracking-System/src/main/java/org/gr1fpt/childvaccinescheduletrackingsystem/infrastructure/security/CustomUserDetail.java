package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.security;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
public class CustomUserDetail implements UserDetails {

    private final String userId; // Trường định danh từ DB
    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean active;

    public CustomUserDetail(String userId, String username, String password,
                             Collection<? extends GrantedAuthority> authorities, boolean active) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.active = active;
    }

    // Các phương thức bắt buộc của UserDetails:
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    @Override
    public String getPassword() {
        return password;
    }
    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public boolean isAccountNonExpired() {
        return active;
    }
    @Override
    public boolean isAccountNonLocked() {
        return active;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return active;
    }
    @Override
    public boolean isEnabled() {
        return active;
    }
}

