//***************************************************************************************
//
//     Filename: TaskListService.java
//     Author: Kyle McColgan
//     Date: 13 January 2026
//     Description: This file provides task list-related service functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Services;

import com.mcckyle.to_do_app.Data.TaskListRepository;
import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//***************************************************************************************

@Service
public class TaskListService
{
    private final TaskListRepository taskListRepository;

    public TaskListService(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }

    public TaskList save(TaskList taskList)
    {
        return taskListRepository.save(taskList);
    }

    public Optional<TaskList> findById(Integer id)
    {
        return taskListRepository.findById(id);
    }

    public List<TaskList> findByUser(User user)
    {
        return taskListRepository.findByUser(user);
    }

    public Optional<TaskList> findDefaultByUser(User user)
    {
        return taskListRepository.findByUserAndIsDefaultTrue(user);
    }

    public void delete(TaskList taskList)
    {
        taskListRepository.delete(taskList);
    }
}

//***************************************************************************************