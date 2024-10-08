package com.humanresourcesapp.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subtasks")
@SuperBuilder
public class SubTasks extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    Boolean isCompleted;
    @ManyToOne
    @JoinColumn(name = "task_id")
    @JsonIgnore
    Tasks task;
}
