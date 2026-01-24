//***************************************************************************************
//
//   Filename: TaskListController.java
//   Author: Kyle McColgan
//   Date: 20 January 2026
//   Description: This file implements task list functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Controllers;

import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Services.ToDoApplicationService;
import com.mcckyle.to_do_app.Services.UserService;
import com.mcckyle.to_do_app.payload.TaskListDTO;
import com.mcckyle.to_do_app.payload.TaskListResponse;
import com.mcckyle.to_do_app.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

//***************************************************************************************

/**
 * REST controller for managing to-do lists.
 * <p>
 * This controller provides endpoints for creating, retrieving, updating,
 * and deleting to-do lists. It is mapped to the "/api/todos/list" base path.
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
@RequestMapping("/api/todos/list")

public class TaskListController
{
    private final ToDoApplicationService toDoService;
    private final UserService userService;

    public TaskListController(ToDoApplicationService toDoService, UserService userService)
    {
        this.toDoService = toDoService;
        this.userService = userService;
    }

    private User resolveUser(UserDetailsImpl principal)
    {
        return userService.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    //CREATE a task list.
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
    @PostMapping
    public ResponseEntity<TaskListDTO> create(
            @RequestBody TaskList request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        User user = resolveUser(principal);
        TaskList created = toDoService.createTaskList(user, request.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TaskListDTO(created, List.of()));
    }

    //READ all task lists.
    @GetMapping
    public ResponseEntity<List<TaskListDTO>> getAll(
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        User user = resolveUser(principal);

        List<TaskListDTO> response = toDoService.getTaskListsForUser(user)
                .stream()
                .map(list -> new TaskListDTO(list, list.getTasks()))
                .toList();

        return ResponseEntity.ok(response);
    }

    //READ The Default list.
    @GetMapping("/default")
    public ResponseEntity<TaskListDTO> getDefault(
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        User user = resolveUser(principal);

        TaskList list = toDoService.getTaskListsForUser(user)
                .stream()
                .filter(TaskList::isDefault)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("The Default task list was not found!"));

        return ResponseEntity.ok(new TaskListDTO(list, list.getTasks()));
    }

    //UPDATE a task list.
    @PutMapping("/{id}")
    public ResponseEntity<TaskListDTO> update(
            @PathVariable Integer id,
            @RequestBody TaskList request,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        User user = resolveUser(principal);
        TaskList updated = toDoService.updateTaskList(id, request.getName(), user);

        return ResponseEntity.ok(new TaskListDTO(updated, updated.getTasks()));
    }

    //DELETE a task list.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetailsImpl principal)
    {
        User user = resolveUser(principal);
        toDoService.deleteTaskList(id, user);

        return ResponseEntity.noContent().build();
    }
}
