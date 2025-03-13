package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.security;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Data
public class CustomOAuth2User implements OAuth2User {
    private final OAuth2User delegate;
    private final String userId; // Thông tin bổ sung từ DB

    public CustomOAuth2User(OAuth2User delegate, String userId) {
        this.delegate = delegate;
        this.userId = userId;
    }

    @Override
    public Map<String, Object> getAttributes() {
        // Bạn có thể copy các attributes từ delegate, hoặc thêm thêm trường userId nếu muốn
        Map<String, Object> attrs = new HashMap<>(delegate.getAttributes());
        attrs.put("userId", userId);
        return attrs;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return delegate.getAuthorities();
    }

    @Override
    public String getName() {
        // Tùy chọn: trả về name từ delegate hoặc có thể custom lại
        return delegate.getAttribute("name");
    }
}
