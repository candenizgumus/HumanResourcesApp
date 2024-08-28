package com.humanresourcesapp.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
@SuperBuilder
public class Tasks extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long employeeId;
    Long managerId;
    Long companyId;
    LocalDate assignedDate;
    LocalDate completetionDate;
    Integer numberOfCompletedSubtasks;
    String taskName;
    Boolean isCompleted;
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    List<SubTasks> subtasks;
}
