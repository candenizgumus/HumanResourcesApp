package com.humanresourcesapp.constants;

import lombok.Getter;

@Getter
public enum ENotificationTextBase {
    OFFER_NOTIFICATION("New offer request from : "),
    WELCOME_NOTIFICATION("Welcome to EasyHuman Resources App. "),
    ERROR_NOTIFICATION("Error : "),
    SUCCESS_NOTIFICATION("Success : "),

    EXPENDITURE_REQUEST_NOTIFICATION("Expenditure request from : "),
    EXPENDITURE_APPROVE_NOTIFICATION("Expenditure approved : "),
    EXPENDITURE_REJECT_NOTIFICATION("Expenditure rejected : "),
    EXPENDITURE_CANCEL_NOTIFICATION("Expenditure canceled : "),

    LEAVE_REQUEST_NOTIFICATION("Leave request from : "),
    LEAVE_APPROVE_NOTIFICATION("Leave approved : "),
    LEAVE_REJECT_NOTIFICATION("Leave rejected : "),
    LEAVE_CANCEL_NOTIFICATION("Leave canceled : "),
    ANNUAL_LEAVE_CHANGE("Annual leave change : "),

    BONUS_NOTIFICATION("Bonus from : ");


    private final String text;
    ENotificationTextBase(String notificationTextBase) {
        this.text = notificationTextBase;
    }
}
