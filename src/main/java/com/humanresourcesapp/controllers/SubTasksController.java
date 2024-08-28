package com.humanresourcesapp.controllers;

import com.humanresourcesapp.services.SubTasksService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.humanresourcesapp.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+SUBTASKS)
@RequiredArgsConstructor
@CrossOrigin("*")
public class SubTasksController
{
    private final SubTasksService subTasksService;
}
