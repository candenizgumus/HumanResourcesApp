package com.humanresourcesapp.services;

import com.humanresourcesapp.constants.ENotificationTextBase;
import com.humanresourcesapp.dto.requests.LeaveSaveRequestDto;
import com.humanresourcesapp.dto.requests.NotificationSaveRequestDto;
import com.humanresourcesapp.dto.responses.LeaveResponseDto;
import com.humanresourcesapp.entities.Leave;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EAccessIdentifier;
import com.humanresourcesapp.entities.enums.ENotificationType;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import com.humanresourcesapp.repositories.LeaveRepository;
import com.humanresourcesapp.utility.UserInfoSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.humanresourcesapp.constants.FrontendPaths.EXPENDITURE;

@Service
@RequiredArgsConstructor
public class LeaveService {
//
//    private final LeaveRepository leaveRepository;
//    private UserService userService;
//    private final NotificationService notificationService;
//
//    //To break circular reference in UserService
//    @Autowired
//    public void setUserService(@Lazy UserService userService) {
//        this.userService = userService;
//    }
//    public List<LeaveResponseDto> findAll() {
//        return null;
//    }
//
//    public Boolean save(LeaveSaveRequestDto dto) {
//        String email = UserInfoSecurityContext.getUserInfoFromSecurityContext();
//        User user = userService.findByEmail(email).orElseThrow(() -> new HumanResourcesAppException(ErrorType.USER_NOT_FOUND));
//
//        leaveRepository.save(Leave.builder()
//                        .description(dto.description())
//                        .employeeId(dto.employeeId())
//                        .attachedFile(dto.attachedFile())
//                        .employeeName(user.getName())
//                        .employeeSurname(user.getSurname())
//                        .companyId(user.getCompanyId())
//                        .leaveType(dto.leaveType())
//                        .startDate(dto.startDate())
//                        .endDate(dto.endDate())
//                .build());
//
////        notificationService.save(NotificationSaveRequestDto.builder()
////                .notificationText(ENotificationTextBase.EXPENDITURE_REQUEST_NOTIFICATION.getText() + userEmail)
////                .userType(null)
////                .userId(employee.getManagerId())
////                .isRead(false)
////                .status(EStatus.ACTIVE)
////                .notificationType(ENotificationType.WARNING)
////                .url(EXPENDITURE)
////                .accessIdentifier(EAccessIdentifier.EXPENDITURE_SAVE)
////                .build());
//        return true;
//    }
}




