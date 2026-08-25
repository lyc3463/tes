// 单元信息
export interface RenewUnitItem {
    id: number;
    tenantId: number;
    park_id: number;
    house_id: number;
    house_name: any;
    unit_name: string;
    floor_area: number;
    rentable_area: number;
    floor: number;
    rent: number;
    price: number;
    unit_type: number;
    add_area: number;
    status: number;
}

type TypeRenew = {
    id: number;
    parkId: number;
    tenantId: number;
    contractId: number;
    identifier: string;
    tenant_name: string;
    tenant_phone: string;
    beginData: string;
    endDate: string;
    renameStatus: number;
    // 接口返回 null，按 any 处理
    pdfImage: any;
    pdfImageBase64: any;
    remark: string;
    created: string;
    unitList: RenewUnitItem[];
};

export default TypeRenew;
