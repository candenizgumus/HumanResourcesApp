package com.humanresourcesapp.views;

import com.humanresourcesapp.entities.enums.EUserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class VwGetAllOffer
{
    Long id;
    String name;
    String surname;
    String email;
    String phone;
    String companyName;
    String title;
    String numberOfEmployee;
    EUserType userType;
    Boolean approvalText;
}
