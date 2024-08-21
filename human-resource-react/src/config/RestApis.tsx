const server_loadbalancer = 'http://34.123.166.207:9090';
const server_local = 'http://localhost:9090';

const server = server_local;
const apis = {
    authService: server+'/dev/v1/auth',
    bonusService: server+'/dev/v1/bonus',
    breakService: server+'/dev/v1/break',
    commentService: server+'/dev/v1/comment',
    companyService: server+'/dev/v1/company',
    companyItemAssignmentService: server+'/dev/v1/company-item-assignment',
    companyItemService: server+'/dev/v1/company-item',
    definitionService: server+'/dev/v1/definition',
    emailService: server+'/dev/v1/email',
    expenditureService: server+'/dev/v1/expenditure',
    featureService: server+'/dev/v1/feature',
    holidayService: server+'/dev/v1/holiday',
    leaveService: server+'/dev/v1/leave',
    notificationService: server+'/dev/v1/notification',
    offerService: server+'/dev/v1/offer',
    passwordResetService: server+'/dev/v1/password-reset',
    paymentService: server+'/dev/v1/payment',
    personelDocumentService: server+'/dev/v1/personal-document',
    s3Service : server+'/dev/v1/s3',
    shiftService: server+'/dev/v1/shift',
    userService: server+'/dev/v1/user',

}

export default apis;