package com.humanresourcesapp.utility;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;


public class UserInfoSecurityContext
{


    public static String getUserInfoFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername(); // Kullanıcı adını veya ID'yi buradan alabilirsiniz

            return email;
        }
        return "User not authenticated";
    }
}
