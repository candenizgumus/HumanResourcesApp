package com.humanresourcesapp.constants;

public class Endpoints
{

    // server
    public static final String BASE_URL = "http://";
    public static final String HOST = "localhost";
    public static final String PORT = ":9090";
    public static final String BASE_PATH = BASE_URL + HOST + PORT;

    // version
    public static final String VERSION = "/v1";

    //profiles
    public static final String API = "/api";
    public static final String DEV = "/dev";
    public static final String TEST = "/test";

    public static final String ROOT = DEV + VERSION;

    //controllers
    public static final String ASSIGNMENT = "/assignment";
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
    public static final String MEDIA = "/media";
    public static final String PAYMENT = "/payment";
    public static final String S3 ="/s3";

    //methods
    public static final String SAVE = "/save";
    public static final String DELETE = "/delete";
    public static final String UPDATE = "/update";
    public static final String GET = "/get";
    public static final String GET_ALL = "/get-all";
    public static final String GET_BY_ID = "/get-by-id";
    public static final String GET_BY_EMPLOYEE_ID = "/get-by-employee-id";
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
    public static final String GET_HOLIDAY_BY_USER = "/get-holiday-by-user";
    public static final String GET_HOLIDAY_BY_ADMIN = "/get-holiday-by-admin";
    public static final String GET_HOLIDAYS_OF_COMPANY = "/get-holidays-of-company";
    public static final String SAVE_HOLIDAY_MANAGER = "/save-holiday-manager";
    public static final String SAVE_HOLIDAY_ADMIN = "/save-holiday-admin";

    public static final String GET_EMPLOYEE_TYPES = "/get-employee-types";
    public static final String GET_COUNT = "/get-count";
    public static final String COUNT_BY_MONTH = "/count-by-month";
    public static final String GET_STATUS = "/get-status";
    public static final String UPDATE_USER_BY_ADMIN = "/update-user-by-admin";
    public static final String UPDATE_EMPLOYEE = "/update-employee-by-manager";
    public static final String ACTIVATE_EMPLOYEE = "/activate-employee";
    public static final String CHANGE_PASSWORD = "/change-password";
    public static final String GET_COMPANY_COMMENT = "/get-company-comment";
    public static final String GET_COMPANY_OF_MANAGER = "/get-company-of-manager";
    public static final String UPDATE_COMPANY_BY_MANAGER = "/update-company-by-manager";
    public static final String CHANGE_STATUS = "/change-status";

    public static final String UPDATE_IS_READ = "/update-is-read";
    public static final String GET_ALL_UNREAD = "/get-all-unread";
    public static final String COUNT_OF_CUSTOMERS_FOR_GRAPH = "/count-of-customers-for-graph";
    public static final String FIND_EMPLOYEES_WITH_UPCOMING_BIRTHDAYS = "/find-employees-with-upcoming-birthdays";
    public static final String SEARCH_BY_EMPLOYEE_ID = "/search-by-employee-id";
    public static final String SEARCH_BY_COMPANY_ID = "/search-by-company-id";
    public static final String APPROVE_EXPENDITURE ="/approve-expenditure";
    public static final String SAVE_CONTACT_US_NOTIFICATION = "/save-contact-us-notification";
    public static final String MAIL_TO_OFFER_CUSTOMER = "/mail-to-offer-customer";
    public static final String MAIL_TO_NOTIFICATION_SENDER = "/mail-to-notification-sender";
    public static final String DELETE_BY_MANAGER =  "/delete-by-manager";
    public static final String CANCEL = "/cancel";
    public static final String FIND_MONTHLY_SALARY_OF_EMPLOYEES = "/find-monthly-salary-of-employees";

    public static final String GET_ALL_PERSONAL_DOCUMENT_TYPES = "/get-all-personal-document-types";
    public static final String DOWNLOAD_PERSONAL_DOCUMENT = "/download-personal-document";
    public static final String GET_MONTHLY_PAYMENTS = "/get-monthly-payments";
    public static final String GET_CURRENT_MONTHS_HOLIDAYS = "/get-current-months-holidays";
    public static final String APPROVE_LEAVE = "/approve-leave";
    public static final String DOWNLOAD = "/download";
    public static final String UPLOAD = "/upload";

    public static final String BONUS = "/bonus";
    public static final String GET_ALL_BONUSES_OF_EMPLOYEE = "/get-all-bonuses-of-employee";
    public static final String CHANGE_LEAVE_DAY = "/change-leave-day";
}
