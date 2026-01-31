//***************************************************************************************
//
//     Filename: UpdateDeletedRequest.java
//     Author: Kyle McColgan
//     Date: 28 January 2026
//     Description: This file owns a tiny request DTO specifically for soft deletion.
//
//***************************************************************************************

package com.mcckyle.to_do_app.payload;

public class UpdateDeletedRequest
{
    private boolean deleted;

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
