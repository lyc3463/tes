export interface EmployeeRecord {
    id: number;
    park_id: number;
    tenantId: number;
    name: string;
    nickname: string;
    phone: string;
    avatarBase64: string | null;
    empFileName: string | null;
    wiegandno: string | null;
    custom: any;
    begintime: string;
    eendtime: string;
    emp_status: number;
    companyName: string;
    gateIds: any;
    park_name: string | null;
}

export interface EmployeeResponse {
    count: number;
    total: number;
    data: EmployeeRecord[];
}

export default EmployeeRecord;