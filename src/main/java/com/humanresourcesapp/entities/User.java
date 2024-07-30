package com.humanresourcesapp.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
@Table(name = "tbluser")
public class User
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
}
