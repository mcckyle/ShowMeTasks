//***************************************************************************************
//
//     Filename: TaskListServiceTest.java
//     Author: Kyle McColgan
//     Date: 12 December 2024
//     Description: This file provides a unit test suite for various TaskList functions.
//
//***************************************************************************************

package com.mcckyle.to_do_app;

import com.mcckyle.to_do_app.Data.TaskListRepository;
import com.mcckyle.to_do_app.Exceptions.TaskListNotFoundException;
import com.mcckyle.to_do_app.Exceptions.UserNotFoundException;
import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.ToDoObj;
import com.mcckyle.to_do_app.Models.User;
import com.mcckyle.to_do_app.Services.TaskListService;
import com.mcckyle.to_do_app.payload.TaskListDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//***************************************************************************************

//@SpringBootTest
//@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class TaskListServiceTest
{
	@Mock
	private TaskListRepository taskListRepository;  // Mocking the repository

	@InjectMocks
	private TaskListService taskListService;  // Injecting the mocks into the service class

	private User testUser;
	private TaskList testTaskList;

	@BeforeEach
	public void setUp()
	{
		MockitoAnnotations.openMocks(this);  // Initialize mocks
		testUser = new User();
		testUser.setId(1);
		testUser.setUsername("testuser");

		testTaskList = new TaskList();
		testTaskList.setId(1);
		testTaskList.setName("Test Task List");
		testTaskList.setUser(testUser);
	}

	//Test #1
	@Test
	public void testCreateTaskList()
	{
		// Arrange
		when(taskListRepository.save(any(TaskList.class))).thenReturn(testTaskList);

		// Act
		TaskList result = taskListService.createTaskList(testTaskList);

		// Assert
		assertNotNull(result);
		assertEquals("Test Task List", result.getName());
		verify(taskListRepository, times(1)).save(testTaskList);
	}

	//Test #2
	@Test
	public void testGetTaskListById_found()
	{
		// Arrange
		when(taskListRepository.findById(1)).thenReturn(Optional.of(testTaskList));

		// Act
		TaskList result = taskListService.getTaskListById(1);

		// Assert
		assertNotNull(result);
		assertEquals("Test Task List", result.getName());
	}

	//Test #3
	@Test
	public void testGetTaskListById_notFound()
	{
		// Arrange
		when(taskListRepository.findById(1)).thenReturn(Optional.empty());

		// Act & Assert
		TaskListNotFoundException exception = assertThrows(TaskListNotFoundException.class, () -> {
			taskListService.getTaskListById(1);
		});
		assertEquals("Task list with ID 1 not found.", exception.getMessage());
	}

	//Test #4
	@Test
	public void testGetTaskListsByUser_found()
	{
		// Arrange
		// Create a TaskList entity (not DTO yet).
		TaskList taskList = new TaskList();
		taskList.setId(1);
		taskList.setName("Test Task List");
		taskList.setDeleted(false);
		taskList.setDefault(true);

		List<ToDoObj> tasks = new ArrayList<>();
		ToDoObj task = new ToDoObj();
		task.setDescription("Test Task");
		task.setCompleted(false);
		tasks.add(task);

		// Create TaskListDTO using the TaskList and tasks list.
		TaskListDTO taskListDTO = new TaskListDTO(taskList, tasks);

		// Mock the repository to return the TaskListDTO when findByUser is called.
		List<TaskList> taskLists = new ArrayList<>();
		taskLists.add(taskList);  // Add TaskList entity to mock repository response.
		when(taskListRepository.findByUser(testUser)).thenReturn(taskLists);

		// Act
		// Call the service method and get the result (which should return a list of TaskListDTO).
		List<TaskListDTO> result = taskListService.getTaskListsByUser(testUser); // Expecting TaskListDTO

		// Assert
		// Verify the result size is 1 and that the name matches the one from TaskListDTO.
		assertEquals(1, result.size());
		assertEquals("Test Task List", result.get(0).getName());

		// Verify that the result is properly mapped (DTO-to-entity conversion).
		verify(taskListRepository).findByUser(testUser);
	}

	//Test #5
	@Test
	public void testGetTaskListsByUser_notFound()
	{
		// Arrange
		List<TaskList> taskLists = new ArrayList<>();
		when(taskListRepository.findByUser(testUser)).thenReturn(taskLists);

		// Act
		List<TaskListDTO> result = taskListService.getTaskListsByUser(testUser);

		// Assert
		assertTrue(result.isEmpty());
	}

	//Test #6
	@Test
	public void testGetTaskListsByUser_userNotFound()
	{
		// Arrange
		User nonExistentUser = new User();
		nonExistentUser.setId(null); // Ensure the user has no ID (simulating a non-existent user)

		// Mock the repository to return an empty list, simulating no task lists for this user
		//when(taskListRepository.findByUser(nonExistentUser)).thenReturn(new ArrayList<>());

		// Act & Assert
		UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
			taskListService.getTaskListsByUser(nonExistentUser);
		});

		assertEquals("User not found.", exception.getMessage());
	}

	//Test #7
	//Description: Ensure that the deleteTaskList method deletes the task list when it exists.
	@Test
	public void testDeleteTaskList()
	{
		// Arrange
		when(taskListRepository.findById(1)).thenReturn(Optional.of(testTaskList));
		doNothing().when(taskListRepository).deleteById(1);

		// Act
		taskListService.deleteTaskList(1);

		// Assert
		verify(taskListRepository, times(1)).deleteById(1);
	}

	//Test #8
	//Description: Ensure that attempting to delete a non-existent task list throws an exception.
	@Test
	public void testDeleteTaskList_notFound()
	{
		// Arrange
		when(taskListRepository.findById(1)).thenReturn(Optional.empty());

		// Act & Assert
		TaskListNotFoundException exception = assertThrows(TaskListNotFoundException.class, () -> {
			taskListService.deleteTaskList(1);
		});
		assertEquals("Task list with ID 1 not found.", exception.getMessage());
		verify(taskListRepository, never()).deleteById(1);
	}

	//Test #9
	//Description: Ensure that creating a task list with a null name throws a validation exception.
	@Test
	public void testCreateTaskList_nullName()
	{
		// Arrange
		testTaskList.setName(null);

		// Act & Assert
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
			taskListService.createTaskList(testTaskList);
		});
		assertEquals("Task list name cannot be null.", exception.getMessage());

		// Verify that the repository's save method was never called
		verify(taskListRepository, never()).save(any(TaskList.class));
	}

	//Test #10
	//Description: Ensures that an existing task list can be updated successfully.
	@Test
	public void testUpdateTaskList()
	{
		// Arrange
		testTaskList.setName("Updated Task List");

		// Mock repository behavior
		//when(taskListRepository.findById(1)).thenReturn(Optional.of(testTaskList));
		when(taskListRepository.save(any(TaskList.class))).thenReturn(testTaskList);

		// Act
		TaskList updatedTaskList = taskListService.saveTaskList(testTaskList);

		// Assert
		assertNotNull(updatedTaskList);  // Check if the returned TaskList is not null
		assertEquals("Updated Task List", updatedTaskList.getName());  // Check if the name is updated
		verify(taskListRepository, times(1)).save(testTaskList);  // Verify that save() is called once
	}

	//Test #11
	//Not passing tests below this line.
	//Description: Ensures that attempting to save a task list without an associated user throws an exception.
	@Test
	public void testSaveTaskList_missingUser()
	{
		// Arrange
		testTaskList.setUser(null);

		// Act & Assert
		UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
			taskListService.saveTaskList(testTaskList);
		});
		assertEquals("User for this task list is missing.", exception.getMessage());

		// Verify that the repository's save method was never called
		verify(taskListRepository, never()).save(any(TaskList.class));
	}

	//Test #12
	//Description: Ensures that fetching task lists fails gracefully when the user is null.
	@Test
	public void testGetTaskListsByUser_nullUser()
	{
		// Act & Assert
		UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
			taskListService.getTaskListsByUser(null);
		});
		assertEquals("User not found.", exception.getMessage());

		// Verify that the repository was never called
		verify(taskListRepository, never()).findByUser(any());
	}

	//Test #13
	//Description: Ensures that duplicate task list names for the same user are not allowed.
	@Test
	public void testCreateTaskList_duplicateName()
	{
		// Arrange
		TaskList duplicateTaskList = new TaskList();
		duplicateTaskList.setId(2);
		duplicateTaskList.setName("Test Task List");
		duplicateTaskList.setUser(testUser);

		when(taskListRepository.findByUser(testUser)).thenReturn(List.of(testTaskList));

		// Act & Assert
		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
			taskListService.createTaskList(duplicateTaskList);
		});
		assertEquals("Task list name must be unique for the user.", exception.getMessage());

		// Verify the repository's save method was not called
		verify(taskListRepository, never()).save(any(TaskList.class));
	}
}

//***************************************************************************************