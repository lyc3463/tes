type TypeRenew  = {
    beginData:string;
    contractId : number;
    created: string;
    endDate: string;
    id: number;
    identifier: string;
    parkId: number;
    pdfImage?: string;
    pdfImageBase64?: string;
    remark: string;
    renameStatus: number;
    tenantId: number
    tenant_name: string;
    tenant_phone: string;
    unitList: any[];
};

export default TypeRenew;