//***************************************************************************************
//
//       Filename: ToDoRepository.java
//       Author: Kyle McColgan
//       Date: 21 November 2024
//       Description: This file provides functionality to search for tasks.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Data;

import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.ToDoObj;
import com.mcckyle.to_do_app.Models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

//***************************************************************************************

@Repository
public interface ToDoRepository extends CrudRepository<ToDoObj, Integer>
{
    List<ToDoObj> findByUser(User user);           // Method to find ToDos by User
    List<ToDoObj> findByTaskList(TaskList taskList);  // Method to find ToDos by TaskList
}

//***************************************************************************************