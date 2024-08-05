package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.EUserType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "auths")
public class Auth extends BaseEntity implements UserDetails
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String email;
    String password;
    //String activationCode;
    @Enumerated(EnumType.STRING)
    EUserType userType;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(userType.name());
        return Collections.singletonList(authority);
    }

    @Override
    public String getUsername()
    {

        return email;
    }
}
