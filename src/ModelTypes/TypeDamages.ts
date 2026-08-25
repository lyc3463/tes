// 单元信息
export interface DamagesUnitItem {
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

// 罚息明细
export interface DamagesPbItem {
    penId: number;
    wyjId: number;
    amount: number;
    defaultAmount: number;
    stopAmount: number;
}

type TypeDamages = {
    Id: number;
    parkId: number;
    tenantId: number;
    contractId: number;
    exemptReason: string;
    // 接口返回 null，按 any 处理
    pdfImage: any;
    pdfImageBase64: any;
    identifier: any;
    tenant_name: string;
    tenant_phone: string;
    remark: string;
    renameStatus: number;
    created: string;
    pbList: DamagesPbItem[];
    unitList: DamagesUnitItem[];
};

export default TypeDamages;
