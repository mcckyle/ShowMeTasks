//***************************************************************************************
//
//     Filename: TaskList.java
//     Author: Kyle McColgan
//     Date: 08 December 2024
//     Description: This file contains the TaskList
//                  entity, which contains a list of ToDoObjs
//
//***************************************************************************************

package com.mcckyle.to_do_app.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

//***************************************************************************************

@JsonIgnoreProperties({"tasks"}) // Ignore the "tasks" field in the serialized JSON
@Entity
@Table(name = "task_lists")
public class TaskList
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    // Associate each TaskList with a User
    @JsonBackReference(value = "user-taskLists")
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Define a relationship with Task
    @JsonManagedReference(value = "taskList-tasks")
    @OneToMany(mappedBy = "taskList", cascade = CascadeType.ALL)
    private List<ToDoObj> tasks = new ArrayList<>();

    // Add a 'deleted' field to track deletion status
    @Column(name = "deleted", nullable = false)
    private boolean deleted = false; // Default value is false, meaning not deleted

    @Column(nullable = false)
    private boolean isDefault = false; // Mark if it's the default list for the user

    // Default constructor
    public TaskList()
    {

    }

    public TaskList(String name, User user)
    {
        this.name = name;
        this.user = user;
    }

    // Setters and getters...
    public Integer getId()
    {
        return id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public User getUser()
    {
        return user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }

    public List<ToDoObj> getTasks()
    {
        return tasks;
    }

    public void setTasks(List<ToDoObj> tasks)
    {
        this.tasks = tasks;
    }

    public void addTask(ToDoObj task)
    {
        tasks.add(task);
        task.setTaskList(this);
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    // Setter for 'deleted' field
    public void setDeleted(boolean deleted)
    {
        this.deleted = deleted;
    }

    // Getter for 'deleted' field
    public boolean isDeleted()
    {
        return deleted;
    }

    public boolean isDefault()
    {
        return isDefault;
    }

    public void setDefault(boolean aDefault)
    {
        isDefault = aDefault;
    }

    @Override
    public boolean equals(Object o)
    {
        if (o == null || getClass() != o.getClass()) return false;
        TaskList taskList = (TaskList) o;
        return Objects.equals(id, taskList.id);
    }

    @Override
    public int hashCode()
    {
        return Objects.hashCode(id);
    }
}

//***************************************************************************************