//***************************************************************************************
//
//     Filename: ToDoService.java
//     Author: Kyle McColgan
//     Date: 13 January 2026
//     Description: This file provides abstracted task-level functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Services;

import com.mcckyle.to_do_app.Data.ToDoRepository;
import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.ToDoObj;
import com.mcckyle.to_do_app.Models.User;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

//***************************************************************************************

@Service
public class ToDoService
{
    private final ToDoRepository toDoRepository;

    public ToDoService(ToDoRepository toDoRepository) {
        this.toDoRepository = toDoRepository;
    }

    public ToDoObj save(ToDoObj task)
    {
        return toDoRepository.save(task);
    }

    public Optional<ToDoObj> findById(Integer id)
    {
        return toDoRepository.findById(id);
    }

    public List<ToDoObj> findByUser(User user)
    {
        return toDoRepository.findByUser(user);
    }

    public List<ToDoObj> findByTaskList(TaskList taskList)
    {
        return toDoRepository.findByTaskList(taskList);
    }

    public void delete(ToDoObj task)
    {
        toDoRepository.delete(task);
    }
}

//***************************************************************************************