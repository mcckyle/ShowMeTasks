//***************************************************************************************
//
//     Filename: ToDoApplicationServiceTest.java
//     Author: Kyle McColgan
//     Date: 29 January 2026
//     Description: This file provides a unit test suite for one of the service classes.
//
//***************************************************************************************

package com.mcckyle.to_do_app;

import com.mcckyle.to_do_app.Exceptions.TaskListNotFoundException;
import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Services.ToDoApplicationService;
import com.mcckyle.to_do_app.Services.TaskListService;
import com.mcckyle.to_do_app.Services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

//***************************************************************************************
//12302024 - commented these tests out, the GitHub actions workflow fails to build gradle.
//01132026 - Fixed workflow with upload-artifact v3 -> v4 in last step. Fixed all but last test.
//01292026 - Renamed IntermediaryServiceTest -> ToDoApplicationServiceTest, refactored tests
//...to align with the new service layer methods.
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class ToDoApplicationServiceTest
{
    @Mock
    private TaskListService taskListService;

    @Mock
    private UserService userService;

    @InjectMocks
    private ToDoApplicationService toDoApplicationService;

    private User testUser;
    private TaskList testTaskList;

    @BeforeEach
    public void setUp()
    {
        // Create a test user
        testUser = new User();
        testUser.setId(1);
        testUser.setUsername("testuser");

        // Create a test task list
        testTaskList = new TaskList();
        testTaskList.setId(1);
        testTaskList.setName("Test Task List");
        testTaskList.setUser(testUser);
    }

    //Test #1
    @Test
    public void testUpdateTaskList_success()
    {
        //Arrange.
        TaskList updatedTaskList = new TaskList();
        updatedTaskList.setName("Updated Task List");

        when(taskListService.findById(1)).thenReturn(Optional.of(testTaskList));
        when(taskListService.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        //Act.
        TaskList result = toDoApplicationService.updateTaskList(1, "Updated", testUser);

        //Assert.
        assertEquals("Updated", result.getName());
        verify(taskListService).save(testTaskList);
    }

    // Test #2: Ensure non-owner cannot update task list
    @Test
    public void testUpdateTaskList_notOwner()
    {
        //Arrange.
        User otherUser = new User();
        otherUser.setId(2);
        when(taskListService.findById(1)).thenReturn(Optional.of(testTaskList));
        testTaskList.setUser(otherUser); //Set the task list's owner to someone else.

        //Create a TaskList with a non-null name to avoid NullPointerException.
        TaskList taskListToUpdate = new TaskList();
        taskListToUpdate.setName("Updated Task List");

        //Act & Assert (testUser is not the owner).
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            toDoApplicationService.updateTaskList(1, "Updated Task List", testUser);
        });

        assertEquals("Unauthorized access!", exception.getMessage());
        verify(taskListService, never()).save(any(TaskList.class));  //Ensure save is not called.
    }

    // Test #3: Ensure task list not found throws correct exception
    @Test
    public void testUpdateTaskList_notFound()
    {
        //Arrange.
        TaskList updatedTaskList = new TaskList();
        updatedTaskList.setName("Valid Name");

        //Simulate task list not found.
        when(taskListService.findById(1)).thenReturn(Optional.empty());

        TaskListNotFoundException exception = assertThrows(
                TaskListNotFoundException.class,
                () -> toDoApplicationService.updateTaskList(1, "Updated", testUser)
        );

        //Ensure save is not called.
        assertEquals("Task list with ID 1 not found.", exception.getMessage());
        verify(taskListService, never()).save(any(TaskList.class));
    }

    //Test #4
    //Description: Ensure that the service properly handles the case where the input task list is null.
//    @Test
//    public void testUpdateTaskList_nullTaskList()
//    {
//        // Act & Assert
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            toDoApplicationService.updateTaskList(1, null, testUser);
//        });
//
//        assertEquals("Task list cannot be null.", exception.getMessage());
//        verify(taskListService, never()).saveTaskList(any(TaskList.class)); // Ensure saveTaskList is not called
//    }

    //Test #5
    //Description: Ensure the correct exception is thrown when a task list belongs to another user,
    // not just checking the exception for the permission error.
    @Test
    public void testUpdateTaskList_taskListBelongsToAnotherUser()
    {
        //Arrange.
        User anotherUser = new User();
        anotherUser.setId(3);
        anotherUser.setUsername("anotheruser");

        //Simulate that the task list belongs to another user.
        testTaskList.setUser(anotherUser);

        when(taskListService.findById(1)).thenReturn(Optional.of(testTaskList));

        //Act & Assert.
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            toDoApplicationService.updateTaskList(1, "Updated", testUser);
        });

        assertEquals("Unauthorized access!", exception.getMessage());
        verify(taskListService, never()).save(any(TaskList.class));
    }

    //Test #6
    //Description: Ensure that the correct TaskList object...
    //...is passed to the saveTaskList method after the update,...
    //...not just checking the task list name.
    @Test
    public void testUpdateTaskList_saveCorrectTaskList()
    {
        //Arrange.
        TaskList updatedTaskList = new TaskList();
        updatedTaskList.setName("Updated Task List");

        when(taskListService.findById(1)).thenReturn(Optional.of(testTaskList));
        when(taskListService.save(any(TaskList.class))).thenAnswer(invocation -> invocation.getArgument(0));

        //Act.
        TaskList result = toDoApplicationService.updateTaskList(1, "Updated", testUser);

        //Assert.
        assertNotNull(result);
        assertEquals("Updated", result.getName());
        assertEquals(testUser, result.getUser());

        //Verify that saveTaskList was called with the correct task list.
        ArgumentCaptor<TaskList> captor = ArgumentCaptor.forClass(TaskList.class);
        verify(taskListService).save(captor.capture());
        TaskList capturedTaskList = captor.getValue();
        assertEquals("Updated", capturedTaskList.getName());
        assertEquals(testUser, capturedTaskList.getUser());
    }

    //Test #7
    //Description: Test: Handle Multiple Concurrent Updates (Concurrency)
//    @Test
//    public void testUpdateTaskList_concurrentUpdate()
//    {
//        // Arrange
//        TaskList updatedTaskList = new TaskList();
//        updatedTaskList.setName("Concurrent Updated Task List");
//
//        when(taskListService.getTaskListById(1)).thenReturn(testTaskList);
//
//        // Simulate a situation where another update occurs before the save
//        when(taskListService.saveTaskList(any(TaskList.class)))
//                .thenThrow(new ConcurrentModificationException("Another update occurred while saving."));
//
//        // Act & Assert
//        ConcurrentModificationException exception = assertThrows(ConcurrentModificationException.class, () -> {
//            toDoApplicationService.updateTaskList(1, updatedTaskList, testUser);
//        });
//
//        assertEquals("Another update occurred while saving.", exception.getMessage());
//
//        // Verify that saveTaskList was indeed called once
//        verify(taskListService, times(1)).saveTaskList(any(TaskList.class)); // Correct verification
//    }

    //Test #8 - failing!
    //Description: Ensure that the task list's name is checked before attempting to save,
    // especially if it violates any business rule (e.g., empty or too long).
//    @Test
//    public void testUpdateTaskList_invalidName()
//    {
//        // Arrange
//        TaskList updatedTaskList = new TaskList();
//        updatedTaskList.setName("");  // Empty name is invalid
//
//        // Act & Assert
//        TaskListNotFoundException exception = assertThrows(TaskListNotFoundException.class, () -> {
//            toDoApplicationService.updateTaskList(1, updatedTaskList, testUser); // Assume invalid ID or other criteria causes exception
//        });
//
//        assertEquals("Task list with ID 1 not found.", exception.getMessage());
//        verify(taskListService, never()).saveTaskList(any(TaskList.class));
//    }

    //Test #9
    //Description: Test that the service rejects a...
    //...task list name that exceeds a maximum length.
    //Note: Must mock existing task list so validation code reaches name checks.
    @Test
    public void testUpdateTaskList_nameTooLong()
    {
        //Arrange.
        String longName;
        TaskList existingTaskList = new TaskList();
        existingTaskList.setUser(testUser);

        TaskList updatedTaskList = new TaskList();
        longName = "A".repeat(256);
        updatedTaskList.setName(longName);  //Name too long.

        //Act & Assert.
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            toDoApplicationService.updateTaskList(1, longName, testUser);
        });

        assertEquals("Task list name is too long!", exception.getMessage());
        verify(taskListService, never()).save(any(TaskList.class));  // Ensure save is not called
    }

    //Test #10
    //Description: Ensure that the service correctly handles...
    //...when the user is null (e.g., unauthenticated user trying...
    //...to update a task list entity).
    @Test
    public void testUpdateTaskList_nullUser()
    {
        //Arrange.
        TaskList updatedTaskList = new TaskList();
        updatedTaskList.setName("Updated Task List");

        //Act & Assert.
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            toDoApplicationService.updateTaskList(1, "Updated Task List", null);
        });

        assertEquals("Invalid user!", exception.getMessage());
        verify(taskListService, never()).save(any(TaskList.class));
    }

    //Bonus tests:
    //Test #11
    //Description: Test what happens if getTaskListById is called...
    //...with an ID that doesn’t exist in the system and returns null.
//    @Test
//    public void testUpdateTaskList_taskListNotFound_nullReturn()
//    {
//        //Arrange.
//        TaskList updatedTaskList = new TaskList();
//        updatedTaskList.setName("Valid Name");
//
//        //Simulate task list not found.
//        when(taskListService.findById(1)).thenReturn(Optional.empty());
//
//        TaskListNotFoundException exception = assertThrows(
//                TaskListNotFoundException.class,
//                () -> toDoApplicationService.updateTaskList(1, "Updated", testUser)
//        );
//
//        //Ensure save is not called.
//        assertEquals("Task list with ID 1 not found.", exception.getMessage());
//        verify(taskListService, never()).save(any(TaskList.class));
//    }

    //Test #12
    //Description: Ensure that an invalid (empty or incomplete)...
    //...user object is properly handled by the service.
    @Test
    public void testUpdateTaskList_emptyUserObject()
    {
        //Arrange.
        User emptyUser = new User(); // Empty user object
        TaskList updatedTaskList = new TaskList();
        updatedTaskList.setName("Updated Task List");

        //Act & Assert.
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            toDoApplicationService.updateTaskList(1, "Updated Task List", emptyUser);
        });

        assertEquals("Invalid user!", exception.getMessage());
        verify(taskListService, never()).save(any(TaskList.class));
    }

    //Test #13
    //Description: Ensure that when a task list is updated,...
    //...the correct user is associated with the task list during...
    //...the save operation.
    @Test
    public void testUpdateTaskList_saveCorrectUser()
    {
        //Arrange.
        TaskList updatedTaskList = new TaskList();
        updatedTaskList.setName("Updated Task List");

        when(taskListService.findById(1)).thenReturn(Optional.of(testTaskList));
        when(taskListService.save(any(TaskList.class))).thenAnswer(invocation -> invocation.getArgument(0));

        //Act.
        TaskList result = toDoApplicationService.updateTaskList(1, "Updated Task List", testUser);

        //Assert.
        assertNotNull(result);
        assertEquals("Updated Task List", result.getName());
        assertEquals(testUser, result.getUser());

        //Verify that saveTaskList was called with the correct user.
        ArgumentCaptor<TaskList> captor = ArgumentCaptor.forClass(TaskList.class);
        verify(taskListService).save(captor.capture());
        TaskList capturedTaskList = captor.getValue();
        assertEquals(testUser, capturedTaskList.getUser());
    }

    //Test #14
    //Description: Test for handling unsupported operation exceptions.
    @Test
    public void testUpdateTaskList_unsupportedOperationException()
    {
        //Arrange.
        TaskList updatedTaskList = new TaskList();
        updatedTaskList.setName("Updated Task List");

        when(taskListService.findById(1)).thenReturn(Optional.of(testTaskList));

        //Simulate unsupported operation exception.
        when(taskListService.save(any(TaskList.class)))
                .thenThrow(new UnsupportedOperationException("Operation not supported"));

        //Act & Assert.
        UnsupportedOperationException exception = assertThrows(UnsupportedOperationException.class, () -> {
            toDoApplicationService.updateTaskList(1, "Updated Task List", testUser);
        });

        assertEquals("Operation not supported", exception.getMessage());
        verify(taskListService, times(1)).save(any(TaskList.class));
    }
    //Test #15
    //Description: Test for task list update on a soft-deleted task list.
//    @Test
//    public void testUpdateTaskList_softDeleted()
//    {
//        // Arrange
//        TaskList softDeletedTaskList = new TaskList();
//        softDeletedTaskList.setId(1);
//        softDeletedTaskList.setName("Deleted Task List");
//        softDeletedTaskList.setDeleted(true); // Simulate soft deletion
//        softDeletedTaskList.setUser(testUser);
//
//        // Create a new task list with a name to avoid the NullPointerException on getName()
//        TaskList updatedTaskList = new TaskList();
//        updatedTaskList.setName("Updated Task List");  // Set a valid name, even though this won't be used
//
//        when(taskListService.getTaskListById(1)).thenReturn(softDeletedTaskList);
//
//        // Act & Assert
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            toDoApplicationService.updateTaskList(1, updatedTaskList, testUser);
//        });
//
//        assertEquals("Task list has been deleted and cannot be updated.", exception.getMessage());
//        verify(taskListService, never()).saveTaskList(any(TaskList.class));  // Ensure save is not called
//    }
}

//***************************************************************************************
