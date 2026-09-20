import TypeUnitBill from './TypeUnit';

type TypeTenantBill = {
    id: number;
    tenant_name: string;
    tenant_phone: string;
    monthBeginDate: string;
    monthEndDate: string;
    rent: number;
    prepayment: number;
    unitList: TypeUnitBill[];
};

export default TypeTenantBill;