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
    SUBSCRIPTION_EXPIRED(1023,"Subscription Expired" ,  HttpStatus.BAD_REQUEST),;
    private Integer code;
    private String message;
    private HttpStatus httpStatus;

}