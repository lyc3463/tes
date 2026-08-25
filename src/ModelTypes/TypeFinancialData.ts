export interface FinancialRecord {
    id: number;
    parkId: number;
    number: string;
    number2: string;
    orderDate: string;
    totalAmount: number;
    paidAmount: number;
    moneyType: number;
    accountId: number;
    companyId: number;
    projectId: number;
    orderStatus: number;
    balance: number;
    balance2: number;
    createUser: number;
    foType: number;
    bxId: number;
    supplierId: number;
    supplierName: string;
    supplierAddress: string;
    personName: string;
    personPhone: string;
    foImage: string;
    company_name: string;
    account_card: string;
    account_name: string;
    project_name: string;
    createUserName: string;
    reviewerName: string;
    remark: string;
    rejectReason: string;
    terminateReason: string;
    paidStatus: number;
    fdList: any[];
    poList: any[];
    poOldList: any;
    account_code: string;
    account_type:number
}

export interface FinancialCount {
    count: number;
    total: number;
    paidAmountSum: number;
    totalAmountSum: number;
    data: FinancialRecord[];
}

export interface SupplierItem {
    id: number;
    supplierName: string;
}

export interface FinancialDataProps {
    dispatch: (action: { type: string; payload?: any }) => any;
    count?: FinancialCount;
    SupplierList: SupplierItem[];
}

export interface FinancialDataRootState {
    Supplier: {
        list: SupplierItem[];
    };
    [key: string]: any;
}
