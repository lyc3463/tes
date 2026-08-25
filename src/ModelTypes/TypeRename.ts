// 单元信息
export interface RenameUnitItem {
    id: number;
    tenantId: number;
    park_id: number;
    house_id: number;
    house_name: string;
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

type TypeRename = {
    id: number;
    parkId: number;
    tenantId: number;
    contractId: number;
    identifier: string;
    rename: string;
    tenant_name: string;
    rephone: string;
    tenant_phone: string;
    reCard: string;
    customCard: string;
    // 接口返回 null，按字符串处理
    pdfImage: string;
    pdfImageBase64: string;
    remark: string;
    renameStatus: number;
    created: string;
    unitList: RenameUnitItem[];
};

export default TypeRename;
