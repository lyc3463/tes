type TypeOldBillSum  = {
    id: number; //id
    foId: number; //账单id
    number: string; //编号
    accountName:string; //账户名称
    accountBalance:number; //账户余额
    payAmount:number; //支付金额
    remark:string; //备注
    createName:string; //创建人
    created:string; //创建时间
};

export default TypeOldBillSum;