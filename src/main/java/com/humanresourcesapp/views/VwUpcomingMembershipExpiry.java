package com.humanresourcesapp.views;

import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.ESubscriptionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class VwUpcomingMembershipExpiry {
    Long id;
    String name;
    String logo;
    Integer numberOfEmployee;
    String status;
    String contactEmail;
    String subscriptionType;
    LocalDate subscriptionStartDate;
    LocalDate subscriptionEndDate;
}
