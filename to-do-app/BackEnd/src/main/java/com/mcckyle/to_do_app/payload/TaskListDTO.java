//***************************************************************************************
//
//     Filename: TaskListDTO.java
//     Author: Kyle McColgan
//     Date: 13 January 2026
//     Description: This file controls the TaskList fields returned by server responses.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.ToDoObj;
import java.util.List;
import java.util.stream.Collectors;

//***************************************************************************************

public class TaskListDTO
{
    private Integer id;
    private String name;
    private boolean deleted;

    @JsonProperty("isDefault")
    private boolean isDefault;
    private List<TaskDTO> tasks;

    public TaskListDTO(TaskList taskList, List<ToDoObj> tasks)
    {
        this.id = taskList.getId();
        this.name = taskList.getName();
        this.deleted = taskList.isDeleted();
        this.isDefault = taskList.isDefault();
        this.tasks = tasks.stream()
                .map(TaskDTO::new) // Convert tasks to DTOs
                .collect(Collectors.toList());
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public List<TaskDTO> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDTO> tasks) {
        this.tasks = tasks;
    }
}
