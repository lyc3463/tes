// 单元信息
export interface ChangeWeChatUnitItem {
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

type TypeChangeWeChat = {
    id: number;
    parkId: number;
    tenantId: number;
    phoneOld: string;
    phoneNew: string;
    phoneReason: string;
    // 接口返回 null，按 any 处理
    pdfImage: any;
    tenant_name: string;
    tenant_phone: string;
    remark: string;
    renameStatus: number;
    created: string;
    unitList: ChangeWeChatUnitItem[];
};

export default TypeChangeWeChat;
