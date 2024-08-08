package com.humanresourcesapp.constants;

public class Endpoints
{
    public static final String VERSION = "/v1";

    //profiles
    public static final String API = "/api";
    public static final String DEV = "/dev";
    public static final String TEST = "/test";

    public static final String ROOT = DEV + VERSION;

    //controllers
    public static final String ASSIGNMENT = "/assignmenut";
    public static final String AUTH = "/auth";
    public static final String OFFER = "/offer";
    public static final String BREAK = "/break";
    public static final String COMMENT = "/comment";
    public static final String COMPANY = "/company";
    public static final String COMPANY_ITEM = "/company-item";
    public static final String COMPANY_ITEM_ASSIGNMENT = "/company-item-assignment";
    public static final String EXPENDITURE = "/expenditure";
    public static final String HOLIDAY = "/holiday";
    public static final String LEAVE = "/leave";
    public static final String LEAVE_REQUEST = "/leave-request";
    public static final String NOTIFICATION = "/notification";
    public static final String PERSONAL_DOCUMENT = "/personal-document";
    public static final String SHIFT = "/shift";
    public static final String SHIFT_ASSIGNMENT = "/shift-assignment";
    public static final String USER = "/user";
    public static final String FEATURE = "/feature";
    public static final String PASSWORD_RESET = "/password-reset";
    public static final String EMAIL = "/email";

    //methods
    public static final String SAVE = "/save";
    public static final String DELETE = "/delete";
    public static final String UPDATE = "/update";
    public static final String GET = "/get";
    public static final String GET_ALL = "/get-all";
    public static final String GET_BY_ID = "/get-by-id";
    public static final String LOGIN = "/login";
    public static final String REGISTER = "/register";
    public static final String FORGOT_PASSWORD = "/forgot-password";
    public static final String RESET_PASSWORD = "/reset-password";
    public static final String APPROVE_OFFER_AND_REGISTER_AUTH_AND_USER = "/approve-offer-and-register-auth-and-user";
    public static final String GET_ALL_USERS_OF_MANAGER_BY_COMPANY_ID = "/get-all-users-of-manager-by-company-id";
    public static final String FIND_BY_ID ="/find-by-id";
    public static final String ADD_EMPLOYEE_TO_MANAGER = "/add-employee-to-manager";
    public static final String FIND_BY_TOKEN =  "/find-by-token";
    public static final String FIND_COMPANY_NAME_AND_MANAGER_NAME_OF_USER = "/find-company-name-and-manager-name-of-user";
    public static final String SAVE_ADMIN = "/save-admin";
    public static final String GET_POSITIONS = "/get-positions";
    public static final String GET_SECTORS = "/get-sectors";
    public static final String SEND_PASSWORD_RESET_EMAIL = "/send-password-reset-email";
    public static final String GET_ALL_COMPANY_LOGOS = "/get-all-company-logos";
    public static final String DECLINE_OFFER = "/decline-offer";

    public static final String GET_EMPLOYEE_TYPES = "/get-employee-types";
    public static final String GET_COUNT = "/get-count";
    public static final String COUNT_BY_MONTH = "/count-by-month";
    public static final String GET_STATUS = "/get-status";
    public static final String UPDATE_USER_BY_ADMIN = "/update-user-by-admin";
    public static final String UPDATE_EMPLOYEE = "/update-employee-by-manager";
    public static final String ACTIVATE_EMPLOYEE = "/activate-employee";
    public static final String CHANGE_PASSWORD = "/change-password";
}
