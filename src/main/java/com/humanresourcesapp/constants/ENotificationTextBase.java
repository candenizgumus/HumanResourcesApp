package com.humanresourcesapp.constants;

import lombok.Getter;

@Getter
public enum ENotificationTextBase {
    OFFER_NOTIFICATION("New offer request from : "),
    WELCOME_NOTIFICATION("Welcome to EasyHuman Resources App. "),
    ERROR_NOTIFICATION("Error : "),
    SUCCESS_NOTIFICATION("Success : ");
    private final String text;
    ENotificationTextBase(String notificationTextBase) {
        this.text = notificationTextBase;
    }
}
