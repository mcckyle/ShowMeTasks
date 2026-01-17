//***************************************************************************************
//
//   Filename: ToDoController.java
//   Author: Kyle McColgan
//   Date: 14 January 2026
//   Description: This file implements task list creation functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Controllers;

import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.ToDoObj;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Services.ToDoApplicationService;
import com.mcckyle.to_do_app.Services.UserService;
import com.mcckyle.to_do_app.payload.TaskCreateRequest;
import com.mcckyle.to_do_app.payload.TaskListDTO;
import com.mcckyle.to_do_app.payload.TaskListResponse;
import com.mcckyle.to_do_app.payload.TaskUpdateRequest;
import com.mcckyle.to_do_app.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

//***************************************************************************************

/**
 * REST controller for managing to-do tasks.
 * <p>
 * This controller provides endpoints for creating, retrieving, updating,
 * and deleting to-do tasks. It is mapped to the "/api/todos" base path.
 * </p>
 *
 * <p>
 * Endpoints include:
 * <ul>
 *   <li>GET /api/todos - Retrieve a list of all tasks</li>
 *   <li>POST /api/todos - Create a new task</li>
 *   <li>PUT /api/todos/{id} - Update an existing task</li>
 *   <li>DELETE /api/todos/{id} - Delete a task</li>
 * </ul>
 * </p>
 *
 *
 * <p>Annotations used:</p>
 * <ul>
 *   <li>{@code @RestController} - Marks this class as a RESTful controller.</li>
 *   <li>{@code @RequestMapping("/api/todos")} - Maps the base path for the endpoints.</li>
 * </ul>
 *
 * @author Kyle McColgan
 * @version 0.1.1
 */
@RestController
@RequestMapping("/api/todos")
public class ToDoController
{
    private final ToDoApplicationService toDoApplicationService;
    private final UserService userService;

    @Autowired
    public ToDoController(ToDoApplicationService toDoApplicationService, UserService userService)
    {
        this.toDoApplicationService = toDoApplicationService;
        this.userService = userService;
    }

    /**
     * Creates a new task list for a user.
     * <p>
     * This endpoint accepts a {@link TaskList} object in the request body, processes it,
     * and creates a new task list associated with the user. The newly created task list
     * is returned in the response along with an appropriate HTTP status code.
     * </p>
     *
     * <p>Request:</p>
     * <pre>
     * POST /api/todos/list/create
     * Content-Type: application/json
     * {
     *   "name": "My Task List",
     *   "description": "This is a sample task list."
     * }
     * </pre>
     *
     * <p>Response:</p>
     * <pre>
     * HTTP/1.1 201 Created
     * Content-Type: application/json
     * {
     *   "id": 1,
     *   "name": "My Task List",
     *   "description": "This is a sample task list.",
     *   "tasks": []
     * }
     * </pre>
     *
     * @param request the {@link TaskList} object containing the details of the new task list
     * @return a {@link ResponseEntity} containing the created task list wrapped in a
     *         {@link TaskListResponse} object and the HTTP status code
     * @throws IllegalArgumentException if the request body is invalid
     * @see TaskList
     * @see TaskListResponse
     */
    @PostMapping("/list")
    public ResponseEntity<TaskListDTO> createTaskList(
            @RequestBody TaskList request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Use ToDoApplicationService to create the task list.
        TaskList created = toDoApplicationService.createTaskList(user, request.getName());

        //Create and return TaskListDTO (includes isDefault for the front end).
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TaskListDTO(created, List.of()));
    }

    //Get all task lists.
    @GetMapping("/list")
    public ResponseEntity<List<TaskListDTO>> getTaskLists(
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Find user or throw an exception if not found.
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Fetch task lists as DTOs.
        List<TaskListDTO> response = toDoApplicationService
                .getTaskListsForUser(user)
                .stream()
                .map(list -> new TaskListDTO(list, list.getTasks()))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/list/{id}")
    public ResponseEntity<TaskListDTO> updateTaskList(
            @PathVariable Integer id,
            @RequestBody TaskList request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Find the user by ID.
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Delegate the update operation to the ToDoApplicationService.
        TaskList updated = toDoApplicationService.updateTaskList(id, request.getName(), user);

        //Create and return a simplified response.
        return ResponseEntity.ok(new TaskListDTO(updated, updated.getTasks()));
    }

    @DeleteMapping("/list/{id}")
    public ResponseEntity<Void> deleteTaskList(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        toDoApplicationService.deleteTaskList(id, user);
        return ResponseEntity.noContent().build();
    }

    // Get all task lists.
    @GetMapping("/list/default")
    public ResponseEntity<TaskListDTO> getDefaultTaskList(
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Find user or throw an exception if not found.
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Fetch the default task list.
        TaskList list = toDoApplicationService
                .getTaskListsForUser(user)
                .stream()
                .filter(TaskList::isDefault)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Default task list is missing!!"));

        return ResponseEntity.ok(new TaskListDTO(list, list.getTasks()));
    }

    /**
     * Creates a new task within a specific task list.
     * <p>
     * This endpoint accepts a {@link TaskCreateRequest} object in the request body,
     * processes it, and creates a new task associated with the specified task list.
     * The created task is returned in the response along with an appropriate HTTP
     * status code.
     * </p>
     *
     * <p>Request:</p>
     * <pre>
     * POST /api/todos/create
     * Content-Type: application/json
     * {
     *   "taskListId": 1,
     *   "taskName": "Buy Groceries",
     *   "taskDescription": "Get milk, eggs, and bread.",
     *   "dueDate": "2024-12-20T12:00:00"
     * }
     * </pre>
     *
     * <p>Response:</p>
     * <pre>
     * HTTP/1.1 201 Created
     * Content-Type: application/json
     * {
     *   "id": 42,
     *   "taskListId": 1,
     *   "taskName": "Buy Groceries",
     *   "taskDescription": "Get milk, eggs, and bread.",
     *   "dueDate": "2024-12-20T12:00:00",
     *   "status": "PENDING"
     * }
     * </pre>
     *
     * @param request the {@link TaskCreateRequest} object containing the details of the task to be created
     * @return a {@link ResponseEntity} containing the created task wrapped in a {@link ToDoObj} object and the HTTP status code
     * @throws IllegalArgumentException if the request body is invalid or the task list ID does not exist
     * @see TaskCreateRequest
     * @see ToDoObj
     */
    @PostMapping
    public ResponseEntity<ToDoObj> createTask(
            @RequestBody TaskCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Resolved the authenticated user ONCE.
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Create the new task.
        ToDoObj task = toDoApplicationService.createTask(
                request.getDescription(),
                request.getTaskListId(),
                user
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    // Get all tasks within a specific task list
    @GetMapping("/{taskListId}")
    public ResponseEntity<List<ToDoObj>> getTasksForList(
            @PathVariable Integer taskListId,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Resolved the authenticated user ONCE.
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TaskList list = toDoApplicationService
                .getTaskListsForUser(user)
                .stream()
                .filter(l -> l.getId().equals(taskListId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Task list not found!!"));

        return ResponseEntity.ok(list.getTasks());
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<ToDoObj> updateTask(
            @PathVariable Integer taskId,
            @RequestBody TaskUpdateRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        // Find the user by ID.
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delegate the update operation to the ToDoApplicationService.
        ToDoObj updated = toDoApplicationService.updateTaskDescription(
                taskId,
                request.getDescription(),
                user
        );

        return ResponseEntity.ok(updated);
    }

    /**
     * Deletes a task by its unique ID.
     * <p>
     * This endpoint allows the client to delete a task identified by the provided ID.
     * The task must exist in the system, and the authenticated user must have the necessary
     * permissions to perform this action.
     * </p>
     *
     * @param taskId the unique identifier of the task to be deleted
     * @return {@link ResponseEntity} with one of the following:
     *         <ul>
     *           <li>{@code 204 No Content} if the task was successfully deleted</li>
     *           <li>{@code 404 Not Found} if the task with the given ID does not exist</li>
     *         </ul>
     * @throws RuntimeException if an unexpected error occurs during task deletion
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Integer taskId,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Find the user or throw an exception if not found.
        User user = userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        toDoApplicationService.deleteTask(taskId, user);
        return ResponseEntity.noContent().build();
    }
}

//***************************************************************************************