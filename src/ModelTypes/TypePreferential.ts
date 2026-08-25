// 单元信息
export interface PreferentialUnitItem {
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

type TypePreferential = {
    id: number;
    parkId: number;
    tenantId: number;
    contractId: number;
    identifier: string;
    tenant_name: string;
    tenant_phone: string;
    preRen: number;
    renameStatus: number;
    created: string;
    preBeginTime: string;
    preEndTime: string;
    // 接口返回 null，按 any 处理
    pdfImage: any;
    pdfImageBase64: any;
    remark: string;
    preType: number;
    unitList: PreferentialUnitItem[];
};

export default TypePreferential;
