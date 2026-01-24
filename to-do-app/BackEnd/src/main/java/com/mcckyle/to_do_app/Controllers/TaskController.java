//***************************************************************************************
//
//   Filename: TaskController.java
//   Author: Kyle McColgan
//   Date: 21 January 2026
//   Description: This file implements task functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Controllers;

import com.mcckyle.to_do_app.Models.ToDoObj;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Services.ToDoApplicationService;
import com.mcckyle.to_do_app.Services.UserService;
import com.mcckyle.to_do_app.payload.TaskCreateRequest;
import com.mcckyle.to_do_app.payload.TaskUpdateRequest;
import com.mcckyle.to_do_app.security.UserDetailsImpl;
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
public class TaskController
{
    private final ToDoApplicationService toDoService;
    private final UserService userService;

    public TaskController(ToDoApplicationService toDoService, UserService userService)
    {
        this.toDoService = toDoService;
        this.userService = userService;
    }

    private User resolveUser(UserDetailsImpl principal)
    {
        return userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    //CREATE a task.
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
    public ResponseEntity<ToDoObj> create(
            @RequestBody TaskCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Resolve the authenticated user ONCE.
        User user = resolveUser(principal);

        //Create the new task.
        ToDoObj task = toDoService.createTask(
                request.getDescription(),
                request.getTaskListId(),
                user
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    //READ all tasks within a specific task list
    @GetMapping("/{taskListId}")
    public ResponseEntity<List<ToDoObj>> getForList(
            @PathVariable Integer taskListId,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Resolve the authenticated user ONCE.
        User user = resolveUser(principal);

        return ResponseEntity.ok(toDoService.getTasksForList(taskListId, user));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<ToDoObj> update(
            @PathVariable Integer taskId,
            @RequestBody TaskUpdateRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        // Find the user by ID.
        User user = resolveUser(principal);

        // Delegate the update operation to the ToDoApplicationService.
        ToDoObj updated = toDoService.updateTask(
                taskId,
                request,
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
    public ResponseEntity<Void> delete(
            @PathVariable Integer taskId,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        //Find the user or throw an exception if not found.
        User user = resolveUser(principal);
        toDoService.deleteTask(taskId, user);

        return ResponseEntity.noContent().build();
    }
}

//***************************************************************************************