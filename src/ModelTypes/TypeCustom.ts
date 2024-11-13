type TypeCustom = {
    id: number; //id
    company_name:string,// 公司名称
    custom_date:string,//到访时间
    custom_name:string,//访客姓名
    custom_sattus:number,// 审核状态 0 未审核,1审核通过,2全部
    demands:string,//产品需求
    industry:string,//行业
    intermediary_name:string,//中介名称
    office_area:string,//目前办公区域
    phone:string,//联系方式
    reason_lease:string,//租赁原因
    remark:string,//备注
    required_area:string,//需求面积
    visitor_channels:string,//来访渠道
    visitor_number:number,//到访次数
    visitor_position:string,//访客职位
    visitor_type:string,//访客类别
};

export default TypeCustom;