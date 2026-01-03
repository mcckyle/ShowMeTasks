//***************************************************************************************
//
//     Filename: TaskListRepository.java
//     Author: Kyle McColgan
//     Date: 08 December 2024
//     Description: This file implements database queries for task list entities.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Data;

import com.mcckyle.to_do_app.Models.TaskList;
import com.mcckyle.to_do_app.Models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

//***************************************************************************************

@Repository
public interface TaskListRepository extends CrudRepository<TaskList, Integer>
{
    // Custom query to find task lists by a specific user
    List<TaskList> findByUser(User user);
    Optional<TaskList> findDefaultByUserId(Integer userId);
    Optional<TaskList> findByUserAndIsDefaultTrue(User user);
}

//***************************************************************************************