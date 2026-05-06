import {Button, DatePicker, Image, Input, InputNumber, message, Radio, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import dayjs from "dayjs";
import {generate, getCurrentDate} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import {ClearOutlined} from "@ant-design/icons";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as AccountService from "@/services/account";
import * as ProjectService from "@/services/project";
import ImageUploadPng from "@/components/ImageUploadPng";

const AddInvoiceFinancialDala=(props:any)=>{
    const [spinning, setSpinning] = useState(false);
    const navigate=useNavigate();
    // 账单日期
    const [orderDate,setOrderDate]=useState(getCurrentDate());
    // 订单号
    const [orderCode,setOrderCode]=useState('');
    // 添加的物品列表
    const [goodsList,setGoodsList]=useState([]);
    // 1公账，0私账
    const [accountType,setAccountType]=useState(0);
    // 总金额
    const [totalAmount, setTotalAmount] = useState(0);
    // 已付金额
    const [paidAmount, setPaidAmount] = useState(0);
    // 公司id
    const [companyId,setCompanyId]=useState(0);
    // 账户id
    const [accountId,setAccountId]=useState(0);
    // 项目id
    const [projectId,setProjectId]=useState(0);
    // 收入支出类型
    const [moneyType,setMoneyType]=useState(3);
    // 供应商id
    const [supplierId,setSupplierId]=useState(0);
    // 备注
    const [remark,setRemark]=useState('');
    // 图片列表
    const [imgList,setImgList]=useState([]);
    const columnsz=[
        {
            title:'科目',
            dataIndex:'subject',
            key:'subject',
            render: (text: string, record: any) => (
                <Select
                    style={{ width: '120px' }}
                    // 修改onChange，获取value和option对象，传递label
                    onChange={(value, option) => handleSubjectChange(record.id, value, option.label)}
                    showSearch
                    filterOption={(input, option) => {
                        // 假设每个 option 都有一个与数据项对应的 value 属性
                        const item = props.SubjectList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                        return item?.subject_name?.toLowerCase().includes(input.toLowerCase());
                    }}
                    options={Array.isArray(props.SubjectList)
                        ? props.SubjectList.map((item: any) => ({
                            label: item.subject_name,
                            value: item.id
                        }))
                        : []}
                />
            )
        },
        {
            title:'科目',
            dataIndex:'subjectName',
            key:'subjectName',
        },
        {
            title:'用途',
            dataIndex:'summary',
            key:'summary',
            width:'300px',
            align:'center',
            render: (text: string, record: any) => (
                <Input
                    style={{ width: '100%' }}
                    value={text}
                    onChange={(e) => handleSummaryChange(record.id, e.target.value)}
                />
            )
        },
        {
            title:'数量',
            dataIndex:'quantity',
            key:'quantity',
            render: (text: number, record: any) => (
                <InputNumber
                    value={text}
                    min={0}
                    onChange={(value) =>{
                        setGoodsList(prev =>
                            prev.map(item =>
                                item.id === record.id ? { ...item, quantity: value,amount:((value*record.unitPrice).toFixed(2) *1) } : item
                            )
                        );
                    }}
                />
            )
        },
        {
            title:'单位',
            dataIndex:'unit',
            key:'unit',
            render: (text: string, record: any) => (
                <Input
                    value={text}
                    min={0}
                    onChange={(e) => handleUnitChange(record.id, e.target.value)}
                />
            )
        },
        {
            title:'单价',
            dataIndex:'unitPrice',
            key:'unitPrice',
            render: (text: number, record: any) => (
                <InputNumber
                    value={text}
                    min={0}
                    onChange={(value) =>{
                        setGoodsList(prev =>
                            prev.map(item =>
                                item.id === record.id ? { ...item, unitPrice: value,amount:((value*record.quantity).toFixed(2))*1 } : item
                            )
                        );
                    }}
                />
            )
        },
        {
            title:'金额(元)',
            dataIndex:'amount',
            key:'amount',
            render: (text: number, record: any) => (
                <InputNumber
                    value={text}
                    min={0}
                    onChange={(value) => handleAmountChange(record.id, value as number)}
                />
            )
        },
        // {
        //     title:'图片',
        //     dataIndex:'image',
        //     key:'image',
        //     render: (text: any, record: any) => {
        //         return (
        //             <>
        //                 <ImageUploadPng onImageUpload={(base64)=>onImageUpload(base64,record.id)}/>
        //                 <div  style={{ display: 'flex'}}>
        //                     {text.length>0?text.map((item:any,index:number)=>{
        //                         return(
        //                             <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
        //                                 <Image src={item} style={{ width: '50px', height: '50px' }} />
        //                                 <Button
        //                                     type="primary"
        //                                     danger
        //                                     // onClick={() => handleDeleteunitImg(index)}
        //                                     style={{
        //                                         position: 'absolute',
        //                                         top: '0',
        //                                         left: '0',
        //                                         zIndex: 1,
        //                                         padding: '2px 4px',
        //                                         transform: 'translate(-50%, -50%)',
        //                                     }}
        //                                 >
        //                                     删除
        //                                 </Button>
        //                             </div>
        //                         )
        //                     }):''}
        //                 </div>
        //
        //             </>
        //         )
        //     }
        // },
        {
            title: '操作',
            key: 'action',
            width: '100px',
            render: (_, record: any) => (
                <Button
                    type="text"
                    icon={<ClearOutlined />}
                    onClick={() => handleClearRow(record.id)}
                />
            )
        }
    ];
    // 上传图片
    const onImageUpload = (imgName: string) => {
        setImgList(prev => [...prev, imgName]);
    };
    // 单位
    const handleUnitChange=(id:number,value:string)=>{
         setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, unit: value } : item
            )
        );
    };

    const generateMultipleRecords = (count: number) => {
        // 计算起始ID（当前最大ID + 1，若为空则从1开始）
        const maxId = goodsList.length > 0
            ? Math.max(...goodsList.map(item => item.id))
            : 0;

        // 生成指定数量的新记录
        const newRecords = Array.from({ length: count }, (_, i) => ({
            id: maxId + i + 1,
            subjectName: '', // 科目
            summary: '', // 摘要
            amount: 0,    // 金额
            quantity:0, // 数量
            unit:'', // 单位
            unitPrice:0, // 单价
            // image:[], // 图片
        }));

        // 添加到现有列表
        setGoodsList(prevGoodsList => [...prevGoodsList, ...newRecords]);
    };
    useEffect(() => {
        // 仅当现有记录不足7条时才补充生成
        const neededCount = 7 - goodsList.length;
        if (neededCount > 0) {
            generateMultipleRecords(neededCount);
        }
    }, []);
    // 处理科目变更
    const handleSubjectChange = (id: number, value: string, label: string) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        subjectName: label    // 存储科目名称（label）
                    }
                    : item
            )
        );
    };
    // 处理摘要变更
    const handleSummaryChange = (id: number, value: string) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, summary: value } : item
            )
        );
    };

    // 处理金额变更
    const handleAmountChange = (id: number, value: number) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, amount: value } : item
            )
        );
    };
    // 添加清空行处理函数
    const handleClearRow = (id: number) => {
        setGoodsList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        subjectName: '', // 清空科目名称
                        summary: '',     // 清空摘要
                        amount: 0 ,       // 清空金额
                        quantity:0, // 清空数量
                        unit:'', // 单位
                        unitPrice:0, // 单价
                        // image:[], // 图片
                    }
                    : item
            )
        );
    };
    useEffect(() => {
        // 累加所有金额，处理可能的空值
        const sum = goodsList.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
        // 四舍五入保留两位小数
        setTotalAmount(Number(sum.toFixed(2)));
    }, [goodsList]);
    const changePaidAmount=(e)=>{
        setPaidAmount(e);
    };
    // 收入支出
    const changeMoneyType=(e)=>{
        setMoneyType(e.target.value);
    };
    // 公司id
    const changeCompanyId=(e)=>{
        setCompanyId(e);
        setProjectId(0);
        setAccountId(0);
        getProjectList(e);
    };
    // 日期选择
    const changeData=(_,item)=>{
        setOrderDate(item)
    };
    // 随机获取单号
    const getOrderCode=async ()=>{
        setOrderCode(generate(StaticInfo.park_name));
    };
    // 供应商id
    const changeSupplierId=(e)=>{
        setSupplierId(e);
    };
    // 项目id
    const changeProjectId=(e)=>{
        console.log('项目id',e);
        setProjectId(e);
        ProjectService.one(e).then((res:any)=>{
            console.log('项目详情',res.Data);
            setCompanyId(res.Data.company_id);
            // getAccountListInfo(e);
            // setAccountId(0);
        })
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        })
    };
    // 获取项目列表
    const getProjectList=(e)=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:'', companyId:e, pageSize:1000}
        })
    };
    const getAccountListInfo=(e)=>{
        props.dispatch({
            type:'Account/projectOrAccount',
            payload:e,
        })
    };
    // 获取账户列表
    const getAccountList=()=>{
        props.dispatch({
            type:'Account/fetch',
        })
    };
    // 获取科目列表
    const getSubjectList=()=>{
        props.dispatch({
            type:'Subject/fetch',
        })
    };
    // 备注
    const changeRemark=(e)=>{
        setRemark(e.target.value);
    };
    useEffect(() => {
        getOrderCode();
        getCompanList();
        getProjectList(0);
        // getAccountList();
        getSupplierList();
        getSubjectList();
    }, []);
    const onOK=()=>{
        if (!orderDate) return  message.error('请选择日期');
        // if (!accountId) return  message.error('请选择账户');
        if (!companyId) return  message.error('请选择公司');
        if (!projectId) return  message.error('请选择项目');
        if (!supplierId) return  message.error('请选择供应商');
        if (goodsList.length === 0) return message.error('请增加明细记录');
        const filteredGoodsList = goodsList.filter(item =>
            item.subjectName.trim() !== '' || item.summary.trim() !== ''
        )
        console.log('filteredGoodsList',filteredGoodsList)
        //     .map(item => ({
        //     ...item,
        //     image: Array.isArray(item.image) ? item.image.join('|') : ''
        // }));
        let jsonData=JSON.stringify(filteredGoodsList);
        let imgUrl=imgList.join("|");
        setSpinning(true);
        props.dispatch({
            type:'Bill/add',
            payload:{orderCode, orderDate, accountId,projectId, companyId, paidAmount, totalAmount, moneyType, jsonData,remark,supplierId,imgUrl,bxId:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('添加成功');
                setOrderCode(generate(StaticInfo.park_name));
                setSpinning(false);
            } else {
                message.error(res.ErrorCode + res.Data);
                setOrderCode(generate(StaticInfo.park_name));
                setSpinning(false);
            }
        })
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    const handleDeleteunitImg = (index: number) => {
        setImgList((prev: any[]) =>
            prev.filter((_, i) => i !== index)
        );

    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" htmlType="submit" onClick={onOK}>
                    确定
                </Button>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px'}}>
                <Input addonBefore="单号:" placeholder='随机生成' style={{width:'300px'}} value={orderCode} disabled/>
                <Space.Compact>
                    <div
                        style={{
                            borderRadius: '6px',
                            borderStartEndRadius: 0,
                            borderEndEndRadius: 0,
                            padding: '0 11px',
                            border: '1px solid #d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            borderInlineEnd: 0,
                        }}
                    >
                        日期:
                    </div>
                    <DatePicker placeholder={'请选择日期'} defaultValue={dayjs(orderDate)} onChange={changeData}/>
                </Space.Compact>
                <InputNumber addonBefore="总金额:" placeholder='总金额' disabled value={totalAmount}/>
                {/*<InputNumber addonBefore="已收/已付:" placeholder='已收/已付金额' value={paidAmount} onChange={changePaidAmount}/>*/}
                <Input addonBefore="备注:" placeholder='备注' value={remark} onChange={changeRemark}/>
                <Radio.Group value={moneyType} onChange={changeMoneyType}>
                    {/*<Radio value={1}>收入</Radio>*/}
                    {/*<Radio value={2}>支出</Radio>*/}
                    <Radio value={3}>报销</Radio>
                </Radio.Group>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px'}}>
                <Space.Compact>
                    <div
                        style={{
                            borderRadius: '6px',
                            borderStartEndRadius: 0,
                            borderEndEndRadius: 0,
                            padding: '0 11px',
                            border: '1px solid #d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            borderInlineEnd: 0,
                        }}
                    >
                        公司:
                    </div>
                    <Select
                        style={{width:'250px'}}
                        showSearch
                        value={companyId}
                        onChange={changeCompanyId}
                        placeholder='公司'
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.CompanList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.company_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.CompanList) && props.CompanList.length > 0
                            ? props.CompanList.map((item:any)=>({
                                label:item.company_name,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Space.Compact>
                    <div
                        style={{
                            borderRadius: '6px',
                            borderStartEndRadius: 0,
                            borderEndEndRadius: 0,
                            padding: '0 11px',
                            border: '1px solid #d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            borderInlineEnd: 0,
                        }}
                    >
                        项目:
                    </div>
                    <Select
                        style={{width:'250px'}}
                        showSearch
                        onChange={changeProjectId}
                        value={projectId}
                        placeholder='项目'
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.ProjectList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.project_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.ProjectList) && props.ProjectList.length > 0
                            ? props.ProjectList.map((item:any)=>({
                                label:item.project_name,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Space.Compact>
                    <div
                        style={{
                            borderRadius: '6px',
                            borderStartEndRadius: 0,
                            borderEndEndRadius: 0,
                            padding: '0 11px',
                            border: '1px solid #d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            borderInlineEnd: 0,
                        }}
                    >
                        供应商:
                    </div>
                    <Select
                        style={{width:'250px'}}
                        showSearch
                        onChange={changeSupplierId}
                        placeholder='供应商'
                        value={supplierId}
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.SupplierList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.supplier_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.SupplierList) && props.SupplierList.length > 0
                            ? props.SupplierList.map((item:any)=>({
                                label:item.supplierName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                {/*<Radio.Group value={accountType} style={{display:'flex'}} disabled>*/}
                {/*    <Radio value={1} style={{width:'80px'}}>公账</Radio>*/}
                {/*    <Radio value={0} style={{width:'80px'}}>私账</Radio>*/}
                {/*</Radio.Group>*/}
                <div  style={{ display: 'flex'}}>
                <ImageUploadPng onImageUpload={(base64)=>onImageUpload(base64)}/>
                    {imgList.length>0?imgList.map((item:any,index:number)=>{
                        return(
                            <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                <Image src={`${window.ServerConfig.imgServer}${item}`} style={{ width: '50px', height: '50px' }} />
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => handleDeleteunitImg(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        zIndex: 1,
                                        padding: '2px 4px',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    删除
                                </Button>
                            </div>
                        )
                    }):''}
                </div>
            </Space>
            <Table
                columns={columnsz}
                dataSource={goodsList} // 添加数据源绑定
                rowKey={(record) => record.id} // 使用id作为唯一键
                pagination={false}
                size='small'
                scroll={{y:'55vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        SubjectList: state.Subject.list,
        AccountList: state.Account.list,
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
        SupplierList: state.Supplier.list,

    }
};
export default connect(mapStateToProps)(AddInvoiceFinancialDala);
