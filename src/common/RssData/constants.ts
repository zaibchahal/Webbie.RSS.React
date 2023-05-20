// export const BASE_URL = 'https://localhost:44302';
export const BASE_URL = 'https://stupefied-proskuriakova.69-10-42-234.plesk.page';
export const API_BASE_URL = BASE_URL + '/api';

export const authUrls = {
	IsTenantAvailable: API_BASE_URL + '/services/app/Account/IsTenantAvailable',
	TokenAuth_Authenticate: API_BASE_URL + '/TokenAuth/Authenticate',
};

export const qBankUrls = {
    GetQuestionCount: '/services/app/QuestionBankService/GetQuestionCount',
    GetSystemQuestionCount: '/services/app/QuestionBankService/GetSystemQuestionCount',
    CreateTestResult: '/services/app/QuestionBankService/CreateTestResult',
    GetQuestionToSolve: '/services/app/QuestionBankService/GetQuestionToSolve',
    SaveResultDetail: '/services/app/QuestionBankService/SaveResultDetail',
    AddRemoveFavourites: '/services/app/QuestionBankService/AddRemoveFavourites',
    GetResults: '/services/app/QuestionBankService/GetResults',
    GetQuestionPapers: '/services/app/QuestionBankService/GetQuestionPapers',
    CreateTestResultByPaper: '/services/app/QuestionBankService/CreateTestResultByPaper',
    Completed: '/services/app/QuestionBankService/Completed',
};

export const profileUrls = {
	GetCurrentUserProfileForEdit:
		API_BASE_URL + '/services/app/Profile/GetCurrentUserProfileForEdit',
	GetProfilePicture: API_BASE_URL + '/services/app/Profile/GetProfilePicture',
	ChangePassword: API_BASE_URL + '/services/app/Profile/ChangePassword',
	UpdateProfilePicture: API_BASE_URL + '/services/app/Profile/UpdateProfilePicture',

	UploadProfilePicture: BASE_URL + '/Profile/UploadProfilePicture',
	DownloadTempFile: BASE_URL + '/File/DownloadTempFile', //fileToken fileName=ProfilePicture &fileType=image/jpeg &v=1683616970003
};

export const studentUrls = {
	GetFovouritsList: API_BASE_URL + '/services/app/QuestionBankService/GetFovouritsList',
	GetLiveClassList: API_BASE_URL + '/services/app/LiveSessionService/MyLiveSession',
	GetTicketList: API_BASE_URL + '/services/app/TicketService/GetTicket',
	PostTicket: API_BASE_URL + '/services/app/TicketService/CreatUpdateTicket',
	SupportCategotyDropdown: API_BASE_URL + '/services/app/DropDownService/GetSupportCategory',
	SupportPriorityDropdown: API_BASE_URL + '/services/app/DropDownService/GetTicketPriority',
	GetStudyPlannerList: API_BASE_URL + '/services/app/TaskReminderService/GetTaskReminder',
	PostStudyPlanner: API_BASE_URL + '/services/app/TaskReminderService/CreateTaskReminder',
	GetFaq: API_BASE_URL + '/services/app/FaqsService/GetFaqs',
	GetKnowladgeBase: API_BASE_URL + '/services/app/KnowledgeBaseService/GetKnowledgeBase',
	GetAllCoursesList: API_BASE_URL + '/services/app/CourseService/GetAllCourseForStudent',
	GetMyCoursesList: API_BASE_URL + '/services/app/EnrollmentService/MyCourses',
	GetSearchContent: API_BASE_URL + '/services/app/SearchService/SearchContent',
	GetCourse: API_BASE_URL + '/services/app/CourseService/GetCourseDetail',
	GetVideoDetails: API_BASE_URL + '/services/app/WatchService/GetVideoPath',
	postIsWatched: API_BASE_URL + '/services/app/WatchService/IsWatched',
	postComment: API_BASE_URL + '/services/app/WatchService/SaveComment',
	postReview: API_BASE_URL + '/services/app/WatchService/SaveReview',

};

export const AppConst = {
	TenantID: 'Abp.TenantId',
	TenantName: 'Abp.TenantName',
	CurrentUser: 'Abp.Current.User',
	CurrentSession: 'Abp.Current.Session',
	ProfilePic: 'Abp.Current.User.ProfilePic',
};

export const PaperMode = {
	Tutor: 'Tutor',
	Exam: 'Exam',
};
