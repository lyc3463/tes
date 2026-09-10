import {Button, DatePicker, Input, InputNumber, message, Radio, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import dayjs from "dayjs";
import {generate, getCurrentDate} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import {ClearOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import * as AccountService from "@/services/account";
import * as NewFinancialDataService from "@/services/newFinancialData";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as BillService from "@/services/bill";

const EditNewFinancialData=(props:any)=>{
    const [spinning, setSpinning] = useState(false);
    const [prohibit,setProhibit]=useState(false);
    const navigate=useNavigate();
    // 账单日期
    const [orderDate,setOrderDate]=useState('2000-01-01');
    // 订单号
    const [orderCode,setOrderCode]=useState('');
    // 添加的物品列表
    const [goodsList,setGoodsList]=useState([]);
    const [billList,setBillList]=useState([]);
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
    const [moneyType,setMoneyType]=useState(1);
    // 备注
    const [remark,setRemark]=useState('');
    // 单号id
    const [uid,setUid]=useState(0);
    const [bxId,setBxId]=useState(0);
    const [imgUrl,setImgUrl]=useState('');
    const [supplierId,setSupplierId]=useState(0);
    const [caigou,setCaigou]=useState([]);

    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneInfo(id)
    },[]);
    const getOneInfo=(id:any)=>{
        NewFinancialDataService.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('详情',res);
                setGoodsList(res.Data.fdList);
                setUid(res.Data.id);
                setAccountId(res.Data.accountId);
                setOrderDate(res.Data.orderDate);
                setMoneyType(res.Data.moneyType);
                setCompanyId(res.Data.companyId);
                setProjectId(res.Data.projectId);
                setOrderCode(res.Data.number);
                setTotalAmount(res.Data.totalAmount);
                setPaidAmount(res.Data.paidAmount);
                setRemark(res.Data.remark);
                setSupplierId(res.Data.supplierId);
                setImgUrl(res.Data.foImage);
                changeAccountId(res.Data.accountId);
            }else {
                message.error(res.Data);
            }
        })
    };
    const columnsz=[
        {
            title:'科目',
            dataIndex:'subject',
            key:'subject',
            width: 140,
            render: (text: string, record: any) => (
                <Select
                    style={{ width: '100%' }}
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
            width: 150,
            ellipsis: true,
        },
        {
            title:'摘要',
            dataIndex:'summary',
            key:'summary',
            width: 300,
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
            width: 110,
            render: (text: number, record: any) => (
                <InputNumber
                    disabled={prohibit}
                    style={{ width: '100%' }}
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
            width: 100,
            render: (text: number, record: any) => (
                <Input
                    disabled={prohibit}
                    style={{ width: '100%' }}
                    value={text}
                    onChange={(value) =>{
                        setGoodsList(prev =>
                            prev.map(item =>
                                item.id === record.id ? { ...item, unit: value.target.value } : item
                            )
                        );
                    }}
                />
            )
        },
        {
            title:'单价',
            dataIndex:'unitPrice',
            key:'unitPrice',
            width: 120,
            render: (text: number, record: any) => (
                <InputNumber
                    disabled={prohibit}
                    style={{ width: '100%' }}
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
            width: 120,
            render: (text: number, record: any) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={text}
                    min={0}
                    onChange={(value) => handleAmountChange(record.id, value as number)}
                />
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_, record: any) => (
                <Button
                    type="text"
                    icon={<ClearOutlined />}
                    onClick={() => handleClearRow(record.id)}
                />
            )
        }
    ];
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
                        amount: 0 ,     // 清空金额
                        quantity:0, // 清空数量
                        unit:'', // 单位
                        unitPrice:0,
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
        if (e.target.value==1){
            setProhibit(false);
            setPaidAmount(0);
            setBxId(0);
            getAccountList();
        }
    };
    // 公司id
    const changeCompanyId=(e)=>{
        setCompanyId(e);
    };
    // 日期选择
    const changeData=(_,item)=>{
        setOrderDate(item)
    };
    // 随机获取单号
    const getOrderCode=async ()=>{
        setOrderCode(generate(StaticInfo.park_name));
    };
    // 账户id
    const changeAccountId=(e)=>{
        setAccountId(e);
        AccountService.one(e).then((res:any)=>{
            console.log('账户详情',res.Data);
            setCompanyId(res.Data.company_id);
            setAccountType(res.Data.account_type);
        })
    };
    // 项目id
    const changeProjectId=(e)=>{
        setProjectId(e);
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
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
    // 获取供应商列表
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    // 获取报销单录入
    const getBillInfo=async()=>{
        BillService.fetch({
            page:1,
            orderCode:'',
            company_name:'',
            account_card:'',
            project_name:'',
            startDate:'2000-01-01',
            endDate:'2099-01-01',
            pageSize:1000,
            orderStatus:12,
            moneyType:0,
            supplierId:0,
            foType:1,
            paidStatus:0,
            expenseCode:'',
            userId:0
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setBillList(res.Data.data);
            }else {

            }
        })
    };
    useEffect(() => {
        getCompanList();
        getProjectList();
        getAccountList();
        getSubjectList();
        getBillInfo();
        getSupplierList();
    }, []);
    const onOK=()=>{
        if (!orderDate) return  message.error('请选择日期');
        if (!accountId) return  message.error('请选择账户');
        if (!companyId) return  message.error('请选择公司');
        if (!projectId) return  message.error('请选择项目');
        const processedList = goodsList.map(item => ({
            ...item,
            unitPrice: !isNaN(Number(item.unitPrice)) ? Number(item.unitPrice) : 0,
            quantity: !isNaN(Number(item.quantity)) ? Number(item.quantity) : 0,
        }));

        const filteredGoodsList = processedList.filter(item =>
            item.amount > 0
        );
        if (filteredGoodsList.length === 0) return message.error('报销明细金额不能为0,请检查!');
        let jsonfd=JSON.stringify(filteredGoodsList);
        let jsonCaigou=JSON.stringify(caigou);
        let caigouFd={fd:jsonfd,caigou:jsonCaigou};
        let jsonData=JSON.stringify(caigouFd);
        // let jsonData = JSON.stringify(filteredGoodsList);

        setSpinning(true);
        props.dispatch({
            type:'NewFinancialData/edit',
            payload:{uid,orderCode, orderDate, accountId, projectId,companyId, paidAmount, totalAmount, moneyType,remark, jsonData,supplierId,bxId,imgUrl}
        }).then((res:any)=>{
            if (res.ErrorCode == 0) {
                message.success('编辑成功');
                history.push('/enter/financialData');
                setSpinning(false);
            } else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    // 备注
    const changeRemark=(e)=>{
        setRemark(e.target.value);
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
    }, [goodsList]);
    const changeBillId=(e)=>{
        const result = billList.find(item => item.id === e);
        console.log('报销单详情',result);
        setGoodsList(result.fdList);
        setCompanyId(result.companyId);
        setProjectId(result.projectId);
        // getAccountListInfo(result.projectId);
        setRemark(result.remark);
        setSupplierId(result.supplierId);
        setBxId(result.id);
        setProhibit(true);
        setImgUrl(result.foImage);
    };
    const changeSupplierId=(e)=>{
        setSupplierId(e);
    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" htmlType="submit" onClick={onOK}>
                    编辑
                </Button>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px',flexWrap:'wrap',rowGap:'10px'}}>
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
                    <DatePicker placeholder={'请选择日期'} value={dayjs(orderDate)} onChange={changeData}/>
                </Space.Compact>
                <InputNumber addonBefore="总金额:" placeholder='总金额' disabled value={totalAmount}/>
                {moneyType==2?<InputNumber addonBefore="已付:" placeholder='已付金额' value={paidAmount} onChange={changePaidAmount} min={0}/>:null}
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
                        disabled={prohibit}
                        onChange={changeSupplierId}
                        placeholder='供应商'
                        value={supplierId}
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.SupplierList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={
                            [
                                ...(Array.isArray(props.SupplierList) && props.SupplierList.length > 0
                                        ? props.SupplierList.map((item:any)=>({
                                            label: item.supplierName,
                                            value: item.id,
                                        }))
                                        : []
                                )
                            ]
                        }
                    />
                </Space.Compact>
                <Input addonBefore="备注:" placeholder='备注' value={remark} onChange={changeRemark}/>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px',flexWrap:'wrap',rowGap:'10px'}}>
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
                        placeholder='项目'
                        value={projectId}
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
                        账户:
                    </div>
                    <Select
                        style={{width:'250px'}}
                        showSearch
                        value={accountId}
                        onChange={changeAccountId}
                        placeholder='账户'
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.AccountList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.account_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.AccountList) && props.AccountList.length > 0
                            ? props.AccountList.map((item:any)=>({
                                label:item.account_name,
                                value:item.id,
                            }))
                            : []}
                    />
                </Space.Compact>
                <Radio.Group value={moneyType} onChange={changeMoneyType}>
                    <Radio value={1}>收入</Radio>
                    <Radio value={2}>支出</Radio>
                </Radio.Group>
                <Radio.Group value={accountType} style={{display:'flex'}} disabled>
                    <Radio value={1} style={{width:'80px'}}>公账</Radio>
                    <Radio value={0} style={{width:'80px'}}>私账</Radio>
                </Radio.Group>

            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px',flexWrap:'wrap',rowGap:'10px'}}>
                {moneyType==2?
                    <>
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
                                报销单号:
                            </div>
                            <Select
                                style={{width:'250px'}}
                                showSearch
                                onChange={changeBillId}
                                placeholder='报销单号'
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = billList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.number?.toLowerCase().includes(input.toLowerCase());
                                }}
                                options={Array.isArray(billList) && billList.length > 0
                                    ? billList.map((item:any)=>({
                                        label:item.number+'('+item.project_name+')',
                                        value:item.id,
                                    }))
                                    : []}
                            />
                        </Space.Compact>
                    </>:''
                }
            </Space>
            <Table
                columns={columnsz}
                dataSource={goodsList} // 添加数据源绑定
                rowKey={(record) => record.id} // 使用id作为唯一键
                pagination={false}
                size='small'
                scroll={{x: 'max-content', y:'55vh'}}
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
export default connect(mapStateToProps)(EditNewFinancialData);
