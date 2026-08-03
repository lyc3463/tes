import {
    Button,
    Col,
    DatePicker,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Form, InputNumber, Tooltip
} from "antd";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import {checkSessionStorage, newprocessBills, processBills, updateSessionStorage, userQx} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import { useReactToPrint } from 'react-to-print';
import AllFinancialDataPrint from "@/components/AllFinancialDataPrint";
import {StaticInfo} from "@/StaticInfo";
import * as processConfiguration from "@/services/processConfiguration";
import ReimbursePrint from "@/components/MyReimbursePrint";
import {QuestionCircleOutlined} from "@ant-design/icons";
const statusMap: any = {
    1: { text: '', color: 'orange',next: 3,btnText:'' },
    // 2: { text: '已入账', color: 'green'  },
    3: { text: '', color: 'blue' ,next: 4,btnText:''},
    4: { text: '', color: 'purple',next: 5 ,btnText:''},
    5: { text: '', color: 'purple',next: 6 ,btnText:''},
    6: { text: '', color: 'purple',next: 7 ,btnText:''},
    7: { text: '', color: 'purple',next: 8 ,btnText:''},
    8: { text: '', color: 'purple',next: 9 ,btnText:''},
    9: { text: '', color: 'purple',next: 10 ,btnText:''},
    10: { text: '', color: 'purple',next: 11 ,btnText:''},
    11: { text: '', color: 'purple',next: 12 ,btnText:''},
    12: { text: '已审核,未入账', color: 'purple'},
    13: { text: '终止', color: 'purple'},
    14: { text: '已入账', color: 'purple'},
    15: { text: '驳回', color: 'red'},
}
const OldCheckFinance=(props:any)=>{
    // 展示total
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单列表
    const [billList,setBillList]=useState([]);
    // 开始时间
    const [startDate,setBillBgeinTime]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinanceStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setBillEndTime]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinanceEndDate')||'2099-01-01');
    // 账单状态
    const [orderStatus,setOrderStatus]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinanceorderStatus')||0);
    // 报销单id
    const [uid,setUid]=useState(0);
    // 账户卡号
    const [account_card,setaccount_card]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinanceaccount_card')||'');
    // 公司名称
    const [company_name,setCompany_name]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinancecompany_name')||'');
    // 财务单号
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinanceorderCode')||'');
    const [expenseCode,setExpenseCode]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinanceexpenseCode')||'');
    // 收入支出类型
    const [moneyType,setMoneyType]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinancemoneyType')||3);
    const [project_name,setProject_name]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinanceproject_name')||'');
    const [supplierId,setsupplierId]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinancesupplierId')||0);
    const [foType,setFoType]=useState(checkSessionStorage('/check/checkFinance/','OldCheckFinancefoType')||1);
    const [spinning,setspinning]=useState(false);
    const [paidStatus,setPaidStatus]=useState(0);
    const [printModalOpen,setPrintModalOpen]=useState(false);
    // 终止弹窗
    const [terminateOpen,setTerminateOpen]=useState(false);
    const [printList,setPrintList]=useState([]);
    const printRef = useRef();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 缴费的弹窗
    const [paymentOpen,setPaymentOpen]=useState(false);
    const [rejectOpen,setRejectOpen]=useState(false);
    // 审核状态
    const [status,setStatus]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    // 账户名称
    const [accountName,setAccountName]=useState('');
    // 账户余额
    const [accountBalance,setAccountBalance]=useState(0);
    // 备注
    const [remark,setRemark]=useState('');
    // 报销单明细
    const [fdList,setFdList]=useState([]);
    const [accId,setAccId]=useState(0);
    const [checkUser,setCheckUser]=useState('');
    const [checkInfo,setCheckInfo]=useState({});
    const [goodsList,setGoodsList]=useState([]);
    // 终止描述
    const [terminateTxt,setTerminateTxt]=useState('');
    // 驳回描述
    const [rejectTxt,setRejectTxt]=useState('');
    const columns =[
        {
            title: '日期',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.orderDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '单号',
            dataIndex: 'number',
            key: 'number',
            render:(text:any,record:any)=>{
                return(
                    <span style={{color:'#1890FF'}} onClick={()=>{
                        history.push(`/enter/invoiceFinancialDalaInfo?id=${record.id}`);
                    }}>{text}</span>
                )
            }
        },
        {
            title: '公司',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            key: 'supplierName',
        },
        {
            title: '类型',
            dataIndex: 'moneyType',
            key: 'moneyType',
            render: (text: any) => {
                const map: any = {
                    1: { color: 'green', label: '收入' },
                    2: { color: 'red', label: '支出' },
                    3: { color: 'blue', label: '报销' },
                };
                const current = map[text] || { color: 'default', label: '未知' };
                return (
                    <Tag color={current.color}>
                        {current.label}
                    </Tag>
                );
            }
        },
        {
            title: '报销金额(元)',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (text: any,record:any) => {
                const current = statusMap[text] || { text: '未知', color: 'default' }
                return (
                    <Tag color={current.color}>
                        {current.text}
                        {record.orderStatus === 15 && (
                            <Tooltip
                                title={record.rejectReason}
                                placement="right"
                            >
                                <QuestionCircleOutlined style={{ color: '#999', cursor: 'pointer' }} />
                            </Tooltip>
                        )}
                        {record.orderStatus === 13 && (
                            <Tooltip
                                title={record.terminateReason}
                                placement="right"
                            >
                                <QuestionCircleOutlined style={{ color: '#999', cursor: 'pointer' }} />
                            </Tooltip>
                        )}
                    </Tag>
                )
            }
        },
        {
            title: '提交人',
            dataIndex: 'createUserName',
            key: 'createUserName',
        },
        {
            title: '操作',
            dataIndex: 'amount',
            key: 'amount',
            render:(text:any,record:any)=>{
                let isCok=checkAuditPermission(record.orderStatus,checkUser);
                const current = statusMap[record.orderStatus];
                return(
                    <Space>
                        {
                            record.orderStatus !== 15 && isCok?<Space>
                                {[1,2,3,4,5,6,7,8,9,10,11].includes(record.orderStatus) && (
                                    <a
                                        onClick={() => handleUpdateStatus(record, current.next)}
                                    >
                                        审核
                                    </a>
                                )}
                                {/* 终止按钮（所有流程中都可以点） */}
                                {[1,2,3,4,5,6,7,8,9,10,11].includes(record.orderStatus) && (
                                    <a
                                        style={{ color: 'red' }}
                                        onClick={() => handleTerminateStatus(record)}
                                    >
                                        终止
                                    </a>
                                )}
                                {record.orderStatus !== 12 && record.orderStatus !== 13 && record.orderStatus !== 14 && (
                                    <a
                                        style={{ color: '#1890ff' }}
                                        onClick={() => handleReject(record)}
                                    >
                                        驳回
                                    </a>
                                )}
                            </Space>:''
                        }
                    </Space>
                )
            }
        },
    ];
    // 终止弹窗
    const handleTerminateStatus=(e)=>{
        setUid(e.id);
        setTerminateOpen(true);
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
    // 3-4-5审核，6终止
    const handleUpdateStatus = (record: any, status: number) => {
        setUid(record.id);
        setStatus(status);
        setCheckInfo(record);
        setGoodsList(record.fdList);
        setIsOpen(true);
    };
    // 驳回弹窗
    const handleReject=(record:any)=>{
        setUid(record.id);
        setRejectOpen(true);
    };
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setBillBgeinTime('2000-01-01');
            setBillEndTime('2099-01-01');
            updateSessionStorage('/check/checkFinance/','OldCheckFinanceStartDate','2000-01-01');
            updateSessionStorage('/check/checkFinance/','OldCheckFinanceEndDate','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            updateSessionStorage('/check/checkFinance/','OldCheckFinanceStartDate',data[0]);
            updateSessionStorage('/check/checkFinance/','OldCheckFinanceEndDate',data[1]);
        }
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const isDelOpen=(e)=>{
        setIsOpen(true);
        setUid(e);
    };
    // 审核按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/check',
            payload:{uid,status}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success(status==6?'终止成功':'审核成功');
                setspinning(false);
                setIsOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    // 终止按钮
    const onTerminateOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/terminate',
            payload:{uid,terminateTxt}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('终止成功')
                setspinning(false);
                setTerminateOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    // 驳回按钮
    const rejectOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/reject',
            payload:{uid,rejectTxt}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode == 0||res.ErrorCode == 9038) {
                message.success('驳回成功');
                setspinning(false);
                setRejectOpen(false);
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    const getList=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/fetch',
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus,expenseCode,userId:0}
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                console.log('rees',res)
                setBillList(res.Data.data);
            }
            setspinning(false);
        })
    };
    const changeOrderCode = (e:any) => {
        setOrderCode(e.target.value);
        updateSessionStorage('/check/checkFinance/','OldCheckFinanceorderCode',e.target.value);
    };
    const changeCompany_name = (e:any) => {
        setCompany_name(e.target.value);
        updateSessionStorage('/check/checkFinance/','OldCheckFinancecompany_name',e.target.value);
    };
    const changeMoneyType = (e:any) => {
        setMoneyType(e);
        updateSessionStorage('/check/checkFinance/','OldCheckFinancemoneyType',e);
    };
    const changeAccount_card = (e:any) => {
        setaccount_card(e.target.value);
        updateSessionStorage('/check/checkFinance/','OldCheckFinanceaccount_card',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };

    const updateStatusMap=(data)=> {
        const statusKeys = [1,3,4,5,6,7,8,9,10,11];
        // 先清空
        statusKeys.forEach(key => {
            statusMap[key].text = '';
            statusMap[key].btnText = '';
        });
        for (let i = 0; i < statusKeys.length; i++) {
            const reviewIndex = i + 1;
            const status = statusKeys[i];
            const reviewer = data[`reviewer${reviewIndex}`];
            const rpName = data[`rpName${reviewIndex}`];

            // 没有审核人 → 后面不显示按钮
            if (!reviewer || reviewer.trim() === '') {
                if (rpName) {
                    // 自动加：待xx审核
                    statusMap[status].text = `待${rpName}审核`;
                }
                for (let j = i; j < statusKeys.length; j++) {
                    statusMap[statusKeys[j]].btnText = '';
                }
                break;
            }

            // ✅ 自动拼接：待xx审核
            statusMap[status].text = `待${rpName}审核`;

            // 按钮文字 = 下一个审核名称
            const nextRpName = data[`rpName${reviewIndex + 1}`];
            if (nextRpName) {
                statusMap[status].btnText = nextRpName;
            }
        }
        return statusMap
    }
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    const getReviewer=()=>{
        processConfiguration.one().then((res:TypeErrorCode)=>{
            updateStatusMap(res.Data);
            setCheckUser(res.Data);
        })
    };
    useEffect(() => {
        getAccountList();
        getReviewer();
        getSupplierList();

    }, []);
    useEffect(()=>{
        getList();
    },[page, pageSize]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',  // 复选框类型
    };
    const isPrintModalOpen=()=>{
        if(selectedRowKeys.length===0){
            message.error('请选择要打印的报销数据');
            return;
        }
        const selectedIds = selectedRowKeys.map(key => Number(key));
        // 筛选出选中的财务数据，并处理fdList不足7条的情况
        const printList = billList
            .filter(item => selectedIds.includes(item.id))
            .map(item => {
                const fdList = item.fdList || []; // 获取当前项目的fdList，默认空数组
                const currentLength = fdList.length;

                // 如果已达到或超过7条，直接返回原数据
                if (currentLength >= 7) {
                    return item;
                }

                // 计算需要补充的空记录数量
                const neededCount = 7 - currentLength;
                // 获取当前fdList中的最大ID，用于生成新记录ID
                const maxId = currentLength > 0
                    ? Math.max(...fdList.map(item => item.id))
                    : 0;

                // 生成补充的空记录
                const newArr = Array.from({ length: neededCount }, (_, i) => ({
                    id: maxId + i + 1,       // 自增ID
                    subjectName: '',         // 空科目
                    summary: '',             // 空摘要
                    amount: 0                // 金额0
                }));

                // 返回包含补充记录的新对象（不修改原数据）
                return {
                    ...item,
                    fdList: [...fdList, ...newArr]
                };
            });
        setPrintList(printList);
        setPrintModalOpen(true);
    };
    const changeProject_name=(e:any)=>{
        setProject_name(e.target.value);
        updateSessionStorage('/check/checkFinance/','OldCheckFinanceproject_name',e.target.value);
    }
    // 获取账户列表
    const getAccountList=()=>{
        props.dispatch({
            type:'Account/fetch',
        })
    };
    const changeAccountId=(e:any)=>{
        const selected = props.AccountList.find((item: any) => item.id === e);
        console.log('选择的账户id:', selected);
        setAccId(selected.id);
        setAccountName(selected.account_name+selected.account_card);
        setAccountBalance(selected.balance);
    };
    const getAuditSelectOptions = () => {
        // 你要的顺序（固定不变）
        const keys = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15];

        const options = keys.map(key => ({
            label: statusMap[key].text,
            value: key,
        })).filter(item => item.label);

        // ✅ 在最前面插入一行：全部（value=0）
        return [
            { label: '全部', value: 0 },
            ...options
        ];
    };
    const changeStutes=(e:any)=>{
        setOrderStatus(e);
        updateSessionStorage('/check/checkFinance/','OldCheckFinanceorderStatus',e);
    }
    const changeSupplierId=(e:any)=>{
        setsupplierId(e);
        updateSessionStorage('/check/checkFinance/','OldCheckFinancesupplierId',e);
    }
    const checkAuditPermission = (status, auditObj) => {
        const statusMap = {
            1: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5,
            7: 6,
            8: 7,
            9: 8,
            10: 9,
            11: 10,
        };
        // 2. 获取当前状态对应的审核人索引，不存在则直接无权限
        const reviewerIndex = statusMap[status];
        if (!reviewerIndex) return false;

        // 3. 拼接对应的字段名 reviewer1 ~ reviewer11
        const reviewerKey = `reviewer${reviewerIndex}`;

        // 4. 获取该字段的值
        const reviewerValue = auditObj[reviewerKey];

        // 5. 校验：字段为空 → 无权限
        if (!reviewerValue) return false;

        // 6. 把用户ID转为字符串，兼容数字/字符串类型
        const targetId = String(StaticInfo.userId);

        // 7. 判断用户ID是否在审核人列表中（用|分隔）
        const userList = reviewerValue.split('|');
        return userList.includes(targetId);
    };
    // 修改打印方法，使用useReactToPrint的完整功能
    const handlePrint = useReactToPrint({
        contentRef: printRef,  // 使用 content 而不是 contentRef
        pageStyle: `
        @page {
            size: A4;
            margin: 2mm 20mm;
        }
        @media print {
            /* 分页样式 */
            .page-break {
                page-break-after: always;
            }
            /* 防止内容被分页截断 */
            .no-break {
                page-break-inside: avoid;
            }
            /* 隐藏 Modal 相关元素 */
            .ant-modal-wrap,
            .ant-modal-mask {
                display: none !important;
            }
            .ant-modal {
                position: static !important;
                width: 100% !important;
                margin: 0 !important;
            }
            .ant-modal-content {
                box-shadow: none !important;
                background: transparent !important;
            }
            .ant-modal-header,
            .ant-modal-footer {
                display: none !important;
            }
            .ant-modal-body {
                padding: 0 !important;
            }
            body *:not(.print-only-content):not(.print-only-content *) {
                        visibility: hidden;
                      }
        }
    `,
    });
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
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
                                时间:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
                        <Input
                            addonBefore="公司名称:"
                            value={company_name}
                            onChange={changeCompany_name}
                        />
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
                                    return item?.supplierName?.toLowerCase().includes(input.toLowerCase());
                                }}
                                options={
                                    [
                                        { label: '全部', value: 0 },
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
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="项目:"
                            value={project_name}
                            onChange={changeProject_name}
                        />
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
                                审核状态:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={orderStatus}
                                onChange={changeStutes}
                                options={getAuditSelectOptions()}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={isPrintModalOpen}>打印</Button>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={billList}
                scroll={{y:'60vh',x:1500}}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>
                                {props.count?props.count.totalAmountSum.toFixed(2):''}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
                rowSelection={rowSelection}  // 添加选择功能配置
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*审核流程*/}
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOK} loading={spinning} width={1000} height={800}>
                <div>{<ReimbursePrint
                    item={{
                        printItem: {
                            ...checkInfo,
                            fdList: goodsList
                        }
                    }}
                />
                }</div>
            </Modal>
            {/*终止流程*/}
            <Modal open={terminateOpen} onCancel={()=>setTerminateOpen(false)} onOk={onTerminateOK} loading={spinning} title={'终止'}>
               <Form>
                   <Form.Item label={'终止描述'}>
                       <Input.TextArea value={terminateTxt} onChange={(e)=>setTerminateTxt(e.target.value)}/>
                   </Form.Item>
               </Form>
            </Modal>
            {/*驳回弹窗*/}
            <Modal open={rejectOpen} onCancel={()=>setRejectOpen(false)} onOk={rejectOK} loading={spinning} title={'驳回'}>
                <Form>
                    <Form.Item label={'驳回描述'}>
                        <Input.TextArea value={rejectTxt} onChange={(e)=>setRejectTxt(e.target.value)}/>
                    </Form.Item>
                </Form>
            </Modal>
            {/*打印*/}
            <Modal
                width={1000}
                open={printModalOpen}
                onCancel={()=>setPrintModalOpen(false)}
                footer={[
                    <Button key="print" type="primary" onClick={handlePrint}>打印</Button>,
                    <Button key="cancel" type="primary" onClick={()=>setPrintModalOpen(false)}>关闭</Button>
                ]}
            >
                <div className="print-only-content">
                    <AllFinancialDataPrint
                        ref={printRef}
                        printList={printList}
                        className="print-only-content"
                    />
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        count: state.Bill.count,
        AccountList: state.Account.list,
        SupplierList: state.Supplier.list,
    }
};
export default connect(mapStateToProps) (OldCheckFinance)