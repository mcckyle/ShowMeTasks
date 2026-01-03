//***************************************************************************************
//
//     Filename: RoleRepository.java
//     Author: Kyle McColgan
//     Date: 21 November 2024
//     Description: This file provides database connectivity
//                  for role based access control functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Data;

import com.mcckyle.to_do_app.Models.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

//***************************************************************************************

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer>
{
    Role findByName(String name); //For finding a role by its name...
}

//***************************************************************************************