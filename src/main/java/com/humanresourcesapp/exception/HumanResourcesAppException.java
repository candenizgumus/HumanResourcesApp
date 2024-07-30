package com.humanresourcesapp.exception;

import lombok.Getter;


@Getter
public class HumanResourcesAppException extends RuntimeException
{
    private ErrorType errorType;

    public HumanResourcesAppException(ErrorType errorType)
    {
        super(errorType.getMessage());
        this.errorType = errorType;
    }

    public HumanResourcesAppException(ErrorType errorType, String customMessage)
    {
        super(customMessage);
        this.errorType = errorType;
    }
}
