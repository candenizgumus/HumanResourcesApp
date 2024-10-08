package com.humanresourcesapp.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorType
{
    ID_NOT_FOUND(1000, "Id bulunamadı.", HttpStatus.NOT_FOUND),
    USERNAME_OR_PASSWORD_WRONG(1001, "Kullanıcı adı veya parola yanlış.", HttpStatus.I_AM_A_TEAPOT),
    USERNAME_ALREADY_TAKEN(1002, "Bu kullanıcı adı zaten alınmış. Lütfen tekrar deneyin.", HttpStatus.BAD_REQUEST),
    BAD_REQUEST_ERROR(1003, "Girilen parametreler hatalıdır. Lütfen düzeltiniz.", HttpStatus.BAD_REQUEST),
    MUSTERI_NOT_FOUND(1004, "Böyle bir müşteri bulunamadı.", HttpStatus.NOT_FOUND),
    PASSWORDS_ARE_NOT_SAME(1005,"Sifreler ayni degil", HttpStatus.BAD_REQUEST),
    EMAIL_TAKEN(1006,"Email is Taken", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(1007,"Token Geçersizdir" ,HttpStatus.BAD_REQUEST ),
    TOKEN_CREATION_FAILED(1008,"Token yaratmada hata meydana geldi" ,HttpStatus.SERVICE_UNAVAILABLE ),
    TOKEN_VERIFY_FAILED(1009,"Token verify edilemedi." ,HttpStatus.SERVICE_UNAVAILABLE ),
    TOKEN_ARGUMENT_NOTVALID(1010,"Token argümanı yanlış formatta" ,HttpStatus.BAD_REQUEST ),
    ACCOUNT_IS_NOT_ACTIVE(1011,"Hesap aktif değil." , HttpStatus.SERVICE_UNAVAILABLE),
    AUTH_NOT_FOUND(1012,"Auth bulunamadı." , HttpStatus.BAD_REQUEST),
    ACTIVATIONCODE_WRONG(1013,"Aktivasyon kodu hatalı." , HttpStatus.BAD_REQUEST),
    ACCOUNT_STATUS_ERROR(1014   ,"hesap statü hatası" ,HttpStatus.BAD_REQUEST ),
    COMPANY_NOT_FOUND(1015,"Company Not Found" ,HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1016,"User Not Found" ,      HttpStatus.BAD_REQUEST),
    PHONE_TAKEN(      1017, "Phone Number Is Taken" , HttpStatus.BAD_REQUEST),
    EMAIL_OR_PASSWORD_WRONG(1018,"Email or Password Wrong" ,HttpStatus.BAD_REQUEST),
    NOT_AUTHORIZED(1019,"Not Authorized" ,HttpStatus.BAD_REQUEST),
    OFFER_NOT_FOUND(1020,"Offer Not Found" ,HttpStatus.BAD_REQUEST),
    MAIL_SEND_FAIL(3003,"Failed to send email." , HttpStatus.INTERNAL_SERVER_ERROR),
    EMAIL_OR_PHONE_TAKEN(1021,"Email or Phone Number Is Taken" ,    HttpStatus.BAD_REQUEST),
    INVALID_ACCOUNT(1022,"Account is not active" ,   HttpStatus.BAD_REQUEST),
    SUBSCRIPTION_EXPIRED(1023,"Subscription Expired. Please contact support" ,  HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1024,"Token Expired" ,  HttpStatus.BAD_REQUEST),
    WRONG_PASSWORD(1025,"Wrong Password",   HttpStatus.BAD_REQUEST ),
    COMPANY_ALREADY_COMMENTED(1026,"Company Already Commented",   HttpStatus.BAD_REQUEST ),
    COMMENT_NOT_FOUND(1027,"Comment Not Found" , HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND(1028, "Notification Not Found", HttpStatus.BAD_REQUEST),
    USER_ALREADY_DELETED(1029, "User Already Deleted", HttpStatus.BAD_REQUEST),
    EXPENDITURE_NOT_FOUND( 1030, "Expenditure Not Found",  HttpStatus.BAD_REQUEST ),
    EXPENDITURE_ALREADY_APPROVED( 1031, "Expenditure Already Approved",  HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_FOUND(  1032, "Payment Not Found",  HttpStatus.BAD_REQUEST ),
    PAYMENT_ALREADY_DELETED( 1033, "Payment Already Deleted",  HttpStatus.BAD_REQUEST),
    LEAVE_NOT_FOUND( 1034, "Leave Not Found",  HttpStatus.BAD_REQUEST ),
    LEAVE_ALREADY_APPROVED( 1035, "Leave Already Approved",  HttpStatus.BAD_REQUEST),
    ANNUAL_LEAVE_EXCEEDED(1036, "Annual Leave Exceeded",HttpStatus.BAD_REQUEST ),
    INSUFFICIENT_PERMISSION(1037, "Insufficient Permission",HttpStatus.BAD_REQUEST),
    BONUS_NOT_FOUND(    1038, "Bonus Not Found",    HttpStatus.BAD_REQUEST ),
    DEFINITION_NOT_FOUND(1039,"Definition Not Found" ,HttpStatus.BAD_REQUEST ),
    HOLIDAY_ALREADY_EXISTS(1040, "Holiday Already Exists",HttpStatus.BAD_REQUEST),
    SHIFT_NOT_FOUND(    1041, "Shift Not Found",    HttpStatus.BAD_REQUEST ),
    DEFINITION_ALREADY_EXISTS(1042,"Definition Already Exists" ,HttpStatus.BAD_REQUEST ),
    EMAIL_NOT_VALID(    1043, "Email Not Valid",    HttpStatus.BAD_REQUEST ),
    CAN_NOT_UPDATE_DELETED_LEAVE(1044, "Can Not Update Deleted Leave",HttpStatus.BAD_REQUEST ),
    CAN_NOT_UPDATE_CANCELED_LEAVE(1045, "Can Not Update Canceled Leave" , HttpStatus.BAD_REQUEST ),
    CAN_NOT_UPDATE_APPROVED_LEAVE(1046, "Can Not Update Approved Leave" , HttpStatus.BAD_REQUEST),
    ITEM_ALREADY_EXISTS(1047, "Item Already Exists", HttpStatus.BAD_REQUEST),
    ITEM_NOT_FOUND(1048, "Item Not Found", HttpStatus.BAD_REQUEST),
    PREDEFINED_DEFINITION_CANNOT_BE_DELETED(1049, "Predefined Definition Cannot Be Deleted", HttpStatus.BAD_REQUEST),
    SUPERADMIN_CANNOT_BE_DEACTIVATED(    1050, "Superadmin Cannot Be Deactivated", HttpStatus.BAD_REQUEST),
    ALREADY_DEFINED(1051,"Definition Predefined" , HttpStatus.BAD_REQUEST ),
    ASSIGNMENT_NOT_FOUND(1052,"Assignment Not Found" , HttpStatus.BAD_REQUEST ),
    ASSIGNMENT_ALREADY_EXISTS(1053,"Item is already assigned to the employee" , HttpStatus.BAD_REQUEST ),
    TASK_NOT_FOUND(    1054, "Task Not Found", HttpStatus.BAD_REQUEST  ),
    SUBTASK_NOT_FOUND(  1055, "Subtask Not Found",      HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAILED(1056,"File Upload Failed", HttpStatus.INTERNAL_SERVER_ERROR),
    NO_IMAGES_FOUND(1057,"No Images Found" , HttpStatus.BAD_REQUEST ),
    SLIDE_NOT_FOUND(1058,"Slide Not Found" ,HttpStatus.BAD_REQUEST );
    private final Integer code;
    private final String message;
    private final HttpStatus httpStatus;

}