// 单元信息
export interface OutRentUnitItem {
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

type TypeOutRent = {
    id: number;
    parkId: number;
    tenantId: number;
    contractId: number;
    identifier: string;
    tenant_name: string;
    tenant_phone: string;
    refundData: string;
    refundReason: string;
    renameStatus: number;
    refundType: number;
    error: number;
    // 接口返回 null，按 any 处理
    pdfImage: any;
    pdfImageBase64: any;
    remark: string;
    created: string;
    unitList: OutRentUnitItem[];
};

export default TypeOutRent;
