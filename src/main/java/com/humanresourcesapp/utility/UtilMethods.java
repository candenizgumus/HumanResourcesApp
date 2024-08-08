package com.humanresourcesapp.utility;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UtilMethods {

    /**
     * Checks if the given string is null, empty, or contains only whitespace.
     *
     * @param str the string to check
     * @return true if the string is null, empty, or contains only whitespace; false otherwise
     */
    public static boolean isNullOrWhitespace(String str) {
        return str == null || str.trim().isEmpty();
    }
}
