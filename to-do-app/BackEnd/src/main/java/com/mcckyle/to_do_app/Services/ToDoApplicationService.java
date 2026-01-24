//***************************************************************************************
//
//     Filename: ToDoApplicationService.java
//     Author: Kyle McColgan
//     Date: 22 January 2026
//     Description: This class acts as a bridge for two other classes,
//                  the ToDoService.java and TaskListService.java classes.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Services;

import com.mcckyle.to_do_app.Exceptions.TaskListNotFoundException;
import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.ToDoObj;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.payload.TaskUpdateRequest;
import com.mcckyle.to_do_app.payload.ToDoRequest;
import com.mcckyle.to_do_app.payload.UserRegistrationDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

//***************************************************************************************

@Service
public class ToDoApplicationService
{
    private final UserService userService;
    private final ToDoService toDoService;
    private final TaskListService taskListService;

    public ToDoApplicationService(
            UserService userService,
            @Lazy ToDoService toDoService,
            TaskListService taskListService)
    {
        this.userService = userService;
        this.toDoService = toDoService;
        this.taskListService = taskListService;
    }

    /**
     * Registers a new user and provisions a default task list and task.
     */
    public User registerUserWithDefaultTask(
            ToDoRequest request,
            String username,
            String email,
            String password)
    {
        User user = userService.registerUser(
                new UserRegistrationDTO(username, email, password)
        );

        //Create a default TaskList for the user.
        TaskList defaultList = getOrCreateDefaultTaskList(user);

        //Create a default task and assign it to the TaskList.
        ToDoObj welcomeTask = new ToDoObj(
                request.getDescription(),
                false,
                LocalDateTime.now(),
                defaultList
        );
        welcomeTask.setUser(user);

        toDoService.save(welcomeTask);
        return user;
    }

    /**
     * Create a new TaskList for a user
     */
    public TaskList createTaskList(User user, String name)
    {
        requireValidUser(user);
        requireValidName(name);

        TaskList taskList = new TaskList(name, user);
        return taskListService.save(taskList);  // Returns TaskList, not TaskListResponse
    }

    public TaskList updateTaskList(Integer taskListId, String newName, User user)
    {
        requireValidUser(user);
        requireValidName(newName);

        TaskList taskList = getOwnedTaskList(taskListId, user);
        taskList.setName(newName);

        return taskListService.save(taskList);  // Returns TaskList, not TaskListResponse
    }

    public void deleteTaskList(Integer taskListId, User user)
    {
        TaskList taskList = getOwnedTaskList(taskListId, user);

        if (taskList.isDefault())
        {
            throw new IllegalArgumentException("Default task list cannot be deleted.");
        }

        taskListService.delete(taskList);
    }

    /**
     * Get all task lists for a user
     */
    public List<TaskList> getTaskListsForUser(User user)
    {
        requireValidUser(user);
        // Use the updated service method that returns TaskListDTOs
        return taskListService.findByUser(user);
    }

    /**
     * Get all tasks for a specific task list owned by a user.
     */
    public List<ToDoObj> getTasksForList(Integer taskListId, User user)
    {
        requireValidUser(user);

        TaskList taskList = getOwnedTaskList(taskListId, user);
        return taskList.getTasks();
    }

    public ToDoObj createTask(String description, Integer taskListId, User user)
    {
        requireValidUser(user);

        //Check if the user already has a default task list.
        TaskList taskList = getOwnedTaskList(taskListId, user);

        ToDoObj task = new ToDoObj(
                description,
                false,
                LocalDateTime.now(),
                taskList
        );
        task.setUser(user);

        return toDoService.save(task);
    }

    //Update a task...
    public ToDoObj updateTask(Integer taskId, TaskUpdateRequest request, User user)
    {
        ToDoObj task = findTaskForUser(taskId, user);

        if (request.getDescription() != null)
        {
            task.setDescription(request.getDescription());
        }

        if (request.getCompleted() != null)
        {
            task.setCompleted(request.getCompleted());
        }

        return toDoService.save(task);
    }

    public void deleteTask(Integer taskId, User user)
    {
        requireValidUser(user);
        ToDoObj task = toDoService.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found."));
        assertOwnership(task.getUser(), user);
        toDoService.delete(task);
    }

    private TaskList getOrCreateDefaultTaskList(User user)
    {
        return taskListService.findDefaultByUser(user)
                .orElseGet(() -> {
                    TaskList list = new TaskList();
                    list.setName("Default Task List");
                    list.setUser(user);
                    list.setDefault(true);
                    return taskListService.save(list);
                });
    }

    private TaskList getOwnedTaskList(Integer taskListId, User user)
    {
        TaskList taskList = taskListService.findById(taskListId)
                .orElseThrow(() ->
                        new TaskListNotFoundException("Task list not found!")
                );

        assertOwnership(taskList.getUser(), user);
        return taskList;
    }

    private ToDoObj findTaskForUser(Integer taskId, User user)
    {
        requireValidUser(user);

        ToDoObj task = toDoService.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found!"));

        assertOwnership(task.getUser(), user);

        return task;
    }

    private void assertOwnership(User owner, User actor)
    {
        if ( ! owner.getId().equals(actor.getId()))
        {
            throw new RuntimeException("Unauthorized access!");
        }
    }

    private void requireValidUser(User user)
    {
        if ( (user == null) || (user.getId() == null) )
        {
            throw new IllegalArgumentException("Invalid user!");
        }
    }

    private void requireValidName(String name)
    {
        if ( (name == null) || (name.isBlank()) )
        {
            throw new IllegalArgumentException("Name cannot be empty!");
        }

        if (name.length() > 255)
        {
            throw new IllegalArgumentException("Name is too long!");
        }
    }
}

//***************************************************************************************