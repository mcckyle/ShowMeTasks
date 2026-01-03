//***************************************************************************************
//
//     Filename: ToDoObj.java
//     Author: Kyle McColgan
//     Date: 08 December 2024
//     Description: This file contains the ToDoObj (task) entity class.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import java.time.LocalDateTime;

//***************************************************************************************

@JsonInclude(JsonInclude.Include.NON_NULL)
@Entity
public class ToDoObj
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = true)
    private String description;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean completed;

    @Column(nullable = true)
    private LocalDateTime createdAt;

    // Foreign key to associate with a TaskList
    @JsonBackReference(value = "taskList-tasks") //Prevent json serialization of circular refs...
    @ManyToOne
    @JoinColumn(name = "task_list_id")
    private TaskList taskList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //Default constructor
    public ToDoObj()
    {
        this.taskList = new TaskList();
    }

    public ToDoObj(String description, Boolean completed, LocalDateTime createdAt, TaskList taskList)
    {
        this.description = description;
        this.completed = completed;
        this.createdAt = createdAt;
        this.taskList = taskList;
    }

    //Getters and setters...
    public Integer getId()
    {
        return id;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public Boolean getCompleted()
    {
        return completed;
    }

    public void setCompleted(Boolean completed)
    {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

    public TaskList getTaskList()
    {
        return taskList;
    }

    public void setTaskList(TaskList taskList)
    {
        this.taskList = taskList;
    }

    public User getUser()
    {
        return user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }
}

//***************************************************************************************