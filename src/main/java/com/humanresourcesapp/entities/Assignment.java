package com.humanresourcesapp.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
@Table(name = "assignments")
public class Assignment
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    //Assignment comment
}
