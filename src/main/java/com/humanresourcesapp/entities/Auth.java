package com.humanresourcesapp.entities;

import com.humanresourcesapp.entities.enums.ESubscriptionType;
import com.humanresourcesapp.entities.enums.EUserType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
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
    // MANAGER and EMPLOYEE
    @Enumerated(EnumType.STRING)
    ESubscriptionType subscriptionType;
    @Builder.Default
    LocalDate subscriptionStartDate = LocalDate.now();
    LocalDate subscriptionEndDate;

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

    @PrePersist
    public void prePersist()
    {
        if (subscriptionType == ESubscriptionType.MONTHLY)
        {
            subscriptionEndDate = subscriptionStartDate.plusDays(30);
        }
        if (subscriptionType == ESubscriptionType.YEARLY)
        {
            subscriptionEndDate = subscriptionStartDate.plusYears(1);
        }

    }


}
