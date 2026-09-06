package com.company.weeklyreports.exception;

// ownership violation
public class AccessDeniedCustomException extends RuntimeException {
    public AccessDeniedCustomException(String message) {
        super(message);
    }
}