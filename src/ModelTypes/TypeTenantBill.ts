import TypeUnitBill from './TypeUnit';

export type TenantBillList = {
    id: number;
    contractId: number;
    tenantId: number;
    park_id: number;
    userId: number;
    monthBeginDate: string;
    monthEndDate: string;
    rentFreeDay: number;
    rent: number;
    manageFee: number;
    payRent: number;
    payManageFee: number;
    prepayment: number;
    rentDz: number;
    manageFeeDz: number;
    billMoney: number;
    billStatus: number;
    generateStatus: number;
    payBillMoneySum: number;
    tenant_name: string;
    tenant_phone: string;
    identifier: string;
    unusedPrepayment: number;
};

type TypeTenantBill = {
    id?: number;
    contractId: number;
    tenantId: number;
    park_id?: number;
    userId?: number;
    identifier: string;
    prepayment: number;
    tenant_name: string;
    tenant_phone: string;
    unusedPrepayment: number;
    unitList?: TypeUnitBill[];
    tenantBillList: TenantBillList[];
};

export default TypeTenantBill;
