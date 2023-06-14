//export const BASE_URL = 'https://localhost:44302';
export const BASE_URL = 'https://youthful-lumiere.69-10-42-234.plesk.page';
export const API_BASE_URL = BASE_URL + '/api';

export const authUrls = {
    IsTenantAvailable: API_BASE_URL + '/services/app/Account/IsTenantAvailable',
    TokenAuth_Authenticate: '/TokenAuth/Authenticate',
    MakeCredentialOptions: API_BASE_URL + '/Fido/MakeCredentialOptions',
    MakeCredential: '/Fido/MakeCredential',

    AssertionOptionsPost: API_BASE_URL + '/Fido/AssertionOptionsPost',
    MakeAssertion: API_BASE_URL + '/Fido/MakeAssertion',
    AuthenticateFido: API_BASE_URL + '/TokenAuth/AuthenticateFido',
};


export const PROFILE_URLS = {
    GetCurrentUserProfileForEdit: '/services/app/Profile/GetCurrentUserProfileForEdit',
    GetProfilePicture: '/services/app/Profile/GetProfilePicture',
    ChangePassword: API_BASE_URL + '/services/app/Profile/ChangePassword',
    UpdateProfilePicture: API_BASE_URL + '/services/app/Profile/UpdateProfilePicture',

    UploadProfilePicture: BASE_URL + '/Profile/UploadProfilePicture',
    DownloadTempFile: BASE_URL + '/File/DownloadTempFile', //fileToken fileName=ProfilePicture &fileType=image/jpeg &v=1683616970003
};

export const BANKS_URLS = {
    CreatUpdateBanks: '/services/app/BanksService/CreatUpdateBanks',
    Delete: '/services/app/BanksService/Delete',//'?id'
    Get: '/services/app/BanksService/Get',//'?id'
    GetList: '/services/app/BanksService/GetBanks', //'?Type'
}

export const BANKS_ACCOUNT_URLS = {
    CreatUpdateBankAccounts: '/services/app/BankAccountsService/CreatUpdateBankAccounts',
    Delete: '/services/app/BankAccountsService/Delete',//'?id'
    Get: '/services/app/BankAccountsService/Get',//'?id'
    GetList: '/services/app/BankAccountsService/GetBankAccounts', //'?BankID'
    GetDetailList: '/services/app/BankAccountsService/GetAccountsListLedger', //'?BankID'
}

export const ACCTRANSACTION_URLS = {
    CreatUpdate: '/services/app/TransactionsService/CreatUpdateTransactions',
    Delete: '/services/app/TransactionsService/Delete',//'?id'
    Get: '/services/app/TransactionsService/Get',//'?id'
    GetList: '/services/app/TransactionsService/GetTransactions',
}


export const BILL_URLS = {
    CreatUpdate: '/services/app/BillPaymentService/CreatUpdateBillPayment',
    Delete: '/services/app/BillPaymentService/Delete',//'?id'
    Get: '/services/app/BillPaymentService/Get',//'?id'
    GetList: '/services/app/BillPaymentService/GetBillPayment',
}

export const FILE_URLS = {
    UploadFile: API_BASE_URL + '/services/app/AppFileService/UploadFile',
    Delete: '/services/app/AppFileService/Delete',//'?path'
}


export const PRODUCT_URLS = {
    CreatUpdateProduct: '/services/app/ProductService/CreatUpdateProduct',
    Delete: '/services/app/ProductService/Delete',//'?id'
    Get: '/services/app/ProductService/Get',//'?id'
    GetList: '/services/app/ProductService/GetProduct', //'?Type'
    GetDetailList: '/services/app/ProductService/GetProductWithDetail', //'?Type'
}

export const BRAND_URLS = {
    CreatUpdateBrand: '/services/app/BrandService/CreatUpdateBrand',
    Delete: '/services/app/BrandService/Delete',//'?id'
    Get: '/services/app/BrandService/Get',//'?id'
    GetList: '/services/app/BrandService/GetBrand', //'?Type'
}
export const CATEGORY_URLS = {
    CreatUpdateCategory: '/services/app/CategoryService/CreatUpdateCategory',
    Delete: '/services/app/CategoryService/Delete',//'?id'
    Get: '/services/app/CategoryService/Get',//'?id'
    GetList: '/services/app/CategoryService/GetCategory', //'?Type'
}
export const STOCKADJUST_URLS = {
    CreatUpdateStockAdjustment: '/services/app/StockAdjustmentService/CreatUpdateStockAdjustment',
    Delete: '/services/app/StockAdjustmentService/Delete',//'?id'
    Get: '/services/app/StockAdjustmentService/Get',//'?id'
    GetList: '/services/app/StockAdjustmentService/GetStockAdjustment', //'?Type'
}
export const STOCKCOUNT_URLS = {
    CreatUpdateStockCount: '/services/app/StockCountService/CreatUpdateStockCount',
    Delete: '/services/app/StockCountService/Delete',//'?id'
    Get: '/services/app/StockCountService/Get',//'?id'
    GetList: '/services/app/StockCountService/GetStockCount', //'?Type'
}
export const SALE_URLS = {
    CreatUpdateSale: '/services/app/SaleService/CreatUpdateSale',
    Delete: '/services/app/SaleService/Delete',//'?id'
    Get: '/services/app/SaleService/Get',//'?id'
    GetList: '/services/app/SaleService/GetSale', //'?Type'
}
export const PURCHASE_URLS = {
    CreatUpdatePurchase: '/services/app/PurchaseService/CreatUpdatePurchase',
    Delete: '/services/app/PurchaseService/Delete',//'?id'
    Get: '/services/app/PurchaseService/Get',//'?id'
    GetList: '/services/app/PurchaseService/GetPurchase', //'?Type'
}
export const RETURN_URLS = {
    CreatUpdateReturn: '/services/app/ReturnService/CreatUpdateReturn',
    Delete: '/services/app/ReturnService/Delete',//'?id'
    Get: '/services/app/ReturnService/Get',//'?id'
    GetList: '/services/app/ReturnService/GetReturn', //'?Type'
}
export const AppConst = {
    TenantID: 'Abp.TenantId',
    TenantName: 'Abp.TenantName',
    CurrentUser: 'Abp.Current.User',
    CurrentSession: 'Abp.Current.Session',
    ProfilePic: 'Abp.Current.User.ProfilePic',

    SubFolders: {
        Banks: "Banks",
        Product: "Product",
        Brand: "Brand",
        Category: "Category",
        BankAccounts: "BankAccounts",
        Device: "Device",
        StockAdjust: "StockAdjust",
        StockCount: "StockCount",
    },
    Formats: {
        dateTime: 'DD/MM/YYYY hh:mm A',
        date: 'DD/MM/YYYY',
        dateForm: "YYYY-MM-DD",
        datetimeForm: "YYYY-MM-DD HH:mm"
    },
    Slices: {
        Bank: 'BankSlice',
        BankAccount: 'BankAccountSlice',
        TransType: 'TransTypeSlice',
        Session: 'SessionSlice',
    },
    Calculations: {
        CashInOut: 72.5,
        TillSendReceive: 1,
    }
};
export const AppEnums = {

    AccTransTypes:
    {
        None: 0,

        CashIn: 1,
        CashOut: 2,

        TillIDSend: 3,
        TillIDReceive: 4,

        Load: 5,
        LoadDuplicateSim: 6,
        LoadPurchase: 7,
    },
    CashTypes:
    {
        None: 0,

        CashIn: 1,
        CashOut: 2,
    }
};


