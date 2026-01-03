//***************************************************************************************
//
//     Filename: TaskListService.java
//     Author: Kyle McColgan
//     Date: 12 December 2024
//     Description: This file provides task list-related service functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Services;

import com.mcckyle.to_do_app.Data.TaskListRepository;
import com.mcckyle.to_do_app.Exceptions.TaskListNotFoundException;
import com.mcckyle.to_do_app.Exceptions.UserNotFoundException;
import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.payload.TaskListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

//***************************************************************************************

@Service
public class TaskListService
{
    @Autowired
    private TaskListRepository taskListRepository;

    public TaskList createDefaultTaskListForUser(User user)
    {
        TaskList defaultTaskList = new TaskList();
        defaultTaskList.setName("Default Task List");
        defaultTaskList.setUser(user);
        defaultTaskList.setDefault(true); // Mark as default
        return taskListRepository.save(defaultTaskList);
    }

    /**
     * Creates a new task list.
     */
    public TaskList createTaskList(TaskList taskList)
    {
        // Ensure the task list has a name
        if (taskList.getName() == null || taskList.getName().trim().isEmpty())
        {
            throw new IllegalArgumentException("Task list name cannot be null.");
        }

        // Ensure the user associated with the task list exists
        if (taskList.getUser() == null)
        {
            throw new UserNotFoundException("User for this task list is missing.");
        }

        // Check if a task list with the same name already exists for the user
        List<TaskList> existingTaskLists = taskListRepository.findByUser(taskList.getUser());
        for (TaskList existingTaskList : existingTaskLists)
        {
            if (existingTaskList.getName().equalsIgnoreCase(taskList.getName()))
            {
                throw new IllegalArgumentException("Task list name must be unique for the user.");
            }
        }

        return taskListRepository.save(taskList);
    }

    /**
     * Fetch a task list by its ID.
     */
    public TaskList getTaskListById(Integer taskListId)
    {
        Optional<TaskList> taskList = taskListRepository.findById(taskListId);

        // Custom exception for task list not found.
        if (taskList.isEmpty())
        {
            throw new TaskListNotFoundException("Task list with ID " + taskListId + " not found.");
        }

        return taskList.get();
    }

    /**
     * Fetch all task lists for a user.
     */
    public List<TaskListDTO> getTaskListsByUser(User user)
    {
        // Ensure the user exists
        if (user == null || user.getId() == null)
        {
            throw new UserNotFoundException("User not found.");
        }

        List<TaskList> taskLists = taskListRepository.findByUser(user);

        // If no task lists are found, return an empty list instead of throwing an exception
        if (taskLists.isEmpty())
        {
            return Collections.emptyList(); // Return empty list
        }

        // Map each TaskList entity to a TaskListDTO including tasks
        return taskLists.stream()
                .map(taskList -> new TaskListDTO(taskList, taskList.getTasks()))
                .collect(Collectors.toList());
    }

    public TaskList saveTaskList(TaskList taskList)
    {
        if (taskList.getUser() == null)
        {
            throw new UserNotFoundException("User for this task list is missing.");
        }

        return taskListRepository.save(taskList);
    }

    public void deleteTaskList(Integer taskListId)
    {
        // Check if the task list exists
        TaskList taskList = getTaskListById(taskListId);

        // Delete the task list by its ID
        taskListRepository.deleteById(taskList.getId());
    }

    public TaskList findDefaultTaskListForUser(User user)
    {
        return taskListRepository.findByUserAndIsDefaultTrue(user).orElse(null);
    }
}

//***************************************************************************************