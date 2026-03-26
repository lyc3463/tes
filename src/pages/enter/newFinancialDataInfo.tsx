import {Button, DatePicker, Input, InputNumber, message, Modal, Radio, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import dayjs from "dayjs";
import {generate, getCurrentDate} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import {AlignCenterOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import * as AccountService from "@/services/account";
import * as NewFinancialDataService from "@/services/newFinancialData";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import SalesPrint from "@/components/SalesPrint";
import FinancialDataPrint from "@/components/FinancialDataPrint";

const AddNewFinancialData=(props:any)=>{
    const [spinning, setSpinning] = useState(false);
    const [printVisible,setPrintVisible]=useState(false);
    const navigate=useNavigate();
    // 账单日期
    const [orderDate,setOrderDate]=useState('2000-01-01');
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
    const [moneyType,setMoneyType]=useState(1);
    const [company_name,setCompany_name]=useState('');
    const [user_name,setUser_name]=useState('');
    const [project_name,setProject_name]=useState('');
    const [account_name,setAccount_name]=useState('');
    const [account_code,setAccount_code]=useState('');
    const [createUserName,setCreateUserName]=useState('');
    const [reviewerName,setReviewerName]=useState('');
    const [remark,setRemark]=useState('');
    const [account_type,setAccount_type]=useState(0);
    // 单号id
    const [uid,setUid]=useState(0);
    const printProps = {
        orderCode,
        title:moneyType==1?'收入证明单':'支付证明单',
        goodsList,
        totalAmount,
        paidAmount,
        moneyType,
        orderDate,
        company_name,
        createUserName,
        reviewerName,
        remark,
        project_name,
        account_name,
        account_code,
        account_type,
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneInfo(id)
    },[]);
    const getOneInfo=(id:any)=>{
        NewFinancialDataService.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('详情',res)
                setGoodsList(res.Data.fdList);
                setRemark(res.Data.remark);
                setCreateUserName(res.Data.createUserName);
                setReviewerName(res.Data.reviewerName);
                setCompany_name(res.Data.company_name);
                setUser_name(res.Data.user_name);
                setProject_name(res.Data.project_name);
                setUid(res.Data.id);
                setAccountId(res.Data.accountId);
                setOrderDate(res.Data.orderDate);
                setMoneyType(res.Data.moneyType);
                setCompanyId(res.Data.companyId);
                setProjectId(res.Data.projectId);
                setOrderCode(res.Data.number);
                setTotalAmount(res.Data.totalAmount);
                setPaidAmount(res.Data.paidAmount);
            }else {
                message.error(res.Data);
            }
        })
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
            amount: 0    // 金额
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
    const columnsz=[
        {
            title:'科目',
            dataIndex:'subjectName',
            key:'subjectName',
            width:'200px',
        },
        {
            title:'摘要',
            dataIndex:'summary',
            key:'summary',
            align:'center',
            render: (text: string, record: any) => (
                <Input
                    style={{ width: '100%' }}
                    value={text}
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
                />
            )
        },
    ];

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
    useEffect(() => {
        getCompanList();
        getProjectList();
        getAccountList();
        getSubjectList();
    }, []);
    const isOpen=()=>{
        setPrintVisible(true);
        const foundAccount = props.AccountList.find(item => item.id === accountId);
        if (foundAccount) {
            console.log(foundAccount)
            setAccount_name(foundAccount?.account_name || '');
            setAccount_code(foundAccount?.account_card || '');
            setAccount_type(foundAccount?.account_type || 0);
        } else {
            console.log('未找到匹配的账户');
        }

    };
    // 自定义打印方法（处理内容隔离和样式）
    const handlePrint = () => {
        setTimeout(() => {
            window.print();
        }, 0);
    };
    return(
        <Spin spinning={spinning}>
            <style global>
                {`
                    /* 隐藏浏览器默认页眉页脚（包含路由路径） */
                    @media print {
                      @page {
                        size: A4; /* 指定A4纸张 */
                        margin: 0; /* 边距设为0，消除默认页眉页脚区域 */
                      }
            
                      /* 确保打印内容有内边距（替代浏览器默认边距） */
                      .print-only-content {
                        padding: 20mm; /* 模拟A4标准边距（上右下左） */
                        width: 100%; /* A4宽度 */
                        min-height: 297mm; /* A4高度 */
                        box-sizing: border-box;
                      }
                       /* 确保打印容器可见且定位正确 */
                      .print-only-content {
                        visibility: visible !important;
                        position: fixed;
                        left: 0;
                        top: 0;
                        background: white;
                      }
            
                      /* 隐藏所有非打印内容 */
                      body *:not(.print-only-content):not(.print-only-content *) {
                        visibility: hidden;
                      }
                    }
                  `}
            </style>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button
                    onClick={isOpen}
                    icon={<AlignCenterOutlined />}
                />
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
                    <DatePicker placeholder={'请选择日期'} value={dayjs(orderDate)} disabled/>
                </Space.Compact>
                <InputNumber addonBefore="总金额:" placeholder='总金额' disabled value={totalAmount}/>
                <Input addonBefore="备注:" placeholder='备注' disabled value={remark}/>
                {/*<InputNumber addonBefore="已收/已付:" placeholder='已收/已付金额' value={paidAmount} disabled/>*/}
                <Radio.Group value={moneyType} disabled>
                    <Radio value={1}>收入</Radio>
                    <Radio value={2}>支出</Radio>
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
                        disabled
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
                        disabled
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
                        disabled
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
            <Modal
                open={printVisible}
                onCancel={()=>setPrintVisible(false)}
                width={1000}
                footer={[
                    <Button key="print" type="primary" onClick={handlePrint}>打印</Button>,
                    <Button key="cancel" onClick={()=>setPrintVisible(false)}>关闭</Button>
                ]}
            >
                <div className="print-only-content">
                    <FinancialDataPrint {...printProps} />
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        SubjectList: state.Subject.list,
        AccountList: state.Account.list,
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps)(AddNewFinancialData);
