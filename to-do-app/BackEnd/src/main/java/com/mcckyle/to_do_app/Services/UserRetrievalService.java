//***************************************************************************************
//
//     Filename: UserRetrievalService.java
//     Author: Kyle McColgan
//     Date: 1 January 2026
//     Description: This file provides shared user functionality.
//
//***************************************************************************************

package com.mcckyle.to_do_app.Services;

import com.mcckyle.to_do_app.Models.User;
import java.util.Optional;

//***************************************************************************************

public interface UserRetrievalService
{
    Optional<User> findByUsername(String username);
}

//***************************************************************************************
