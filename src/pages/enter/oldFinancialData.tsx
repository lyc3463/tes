import {
    Button,
    DatePicker,
    Descriptions,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip,
    type TableProps
} from "antd";
import dayjs from "dayjs";
import {useEffect, useRef, useState, type ChangeEvent, type Key} from "react";
import {connect,history} from "umi";
import {checkSessionStorage, newprocessBills, processBills, updateSessionStorage, userQx} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import { useReactToPrint } from 'react-to-print';
import * as processConfiguration from '@/services/processConfiguration';
import * as BillService from '@/services/bill';
import AllFinancialDataPrint from "@/components/AllFinancialDataPrint";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {StaticInfo} from "@/StaticInfo";
import type { FinancialCount, FinancialDataProps, FinancialRecord, SupplierItem } from "@/ModelTypes/TypeFinancialData";

interface RootState {
    Bill: {
        count?: FinancialCount;
    };
    Supplier: {
        list: SupplierItem[];
    };
}

interface StatusConfig {
    text: string;
    color: string;
    next?: number;
    btnText?: string;
}

const statusMap: Record<number, StatusConfig> = {
    1: { text: '', color: 'orange',next: 3,btnText:'会计审核' },
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
    100: { text: '待提交', color: 'orange'},
   }
const OldFinancialData=(props: FinancialDataProps)=>{
    // 展示total
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单列表
    const [billList,setBillList]=useState<FinancialRecord[]>([]);
    // 开始时间
    const [startDate,setBillBgeinTime]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDatastartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setBillEndTime]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDataendDate')||'2099-01-01');
    // 账单状态
    const [orderStatus,setOrderStatus]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDatabillStatus')||0);
    // 删除的id
    const [uid,setUid]=useState(0);
    // 账户卡号
    const [account_card,setaccount_card]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDataaccount_card')||'');
    // 公司名称
    const [company_name,setCompany_name]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDatacompany_name')||'');
    // 财务单号
    const [orderCode,setOrderCode]=useState('');
   // 报销单号
    const [expenseCode,setExpenseCode]=useState('');
    // 收入支出类型
    const [moneyType,setMoneyType]=useState(3);
    const [project_name,setProject_name]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDataproject_name')||'');
    const [supplierId,setsupplierId]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDatasupplierId')||0);
    const [foType,setFoType]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDatafoType')||1);
    const [paidStatus,setPaidStatus]=useState(checkSessionStorage('/enter/financialData/','OldFinancialDatapaidStatus')||0);
    const [isOpen,setIsOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [printModalOpen,setPrintModalOpen]=useState(false);
    const [printList,setPrintList]=useState<FinancialRecord[]>([]);
    const [delRecord,setDelRecord]=useState<FinancialRecord | null>(null);
    // 送审弹窗
    const [reviewOpen,setReviewOpen]=useState(false);
    const [reviewRecord,setReviewRecord]=useState<FinancialRecord | null>(null);
    const printRef = useRef<HTMLDivElement | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const columns: TableProps<FinancialRecord>['columns'] =[
        {
            title: '日期',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render:(_,record)=>{
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
            ellipsis: true,
            render:(text,record)=>{
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
            render: (text) => {
                const map: Record<number, { color: string; label: string }> = {
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
            // render:(text:any,record:any)=>{
            //     return(
            //         <span>{record.moneyType==1?text:0}</span>
            //     )
            // }
        },
        // {
        //     title: '余额(元)',
        //     dataIndex: 'balance2',
        //     key: 'balance2',
        //     render:(text:any,record:any)=>{
        //         return(
        //             <div>
        //                 {text.toFixed(2)}
        //             </div>
        //         )
        //     }
        // },
        {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (text,record) => {
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
        // {
        //     title: '审核人',
        //     dataIndex: 'reviewerName',
        //     key: 'reviewerName',
        //     render:(text:any,record:any)=>{
        //         return(
        //             <Tag color={record.orderStatus==2?'green':'blue'}>
        //                 {record.orderStatus==2?text:''}
        //             </Tag>
        //         )
        //     }
        // },
        {
            title: '操作',
            dataIndex: 'amount',
            key: 'amount',
            render:(_,record)=>{
                        return (
                            <Space>
                                {
                                    record.orderStatus==15||record.orderStatus==100 ? (
                                        <>
                                            <Button type='link' onClick={() => {
                                                history.push(`/enter/editInvoiceFinancialDala?id=${record.id}`);
                                            }}>编辑</Button>
                                            <Button type='link' danger onClick={() => isDelOpen(record)}>删除</Button>
                                            <Button type='link' danger onClick={() => submitForReview(record)}>提交审核</Button>
                                        </>
                                    ) : null
                                }
                            </Space>
                        )
            }
        },
    ];
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setBillBgeinTime('2000-01-01');
            setBillEndTime('2099-01-01');
            updateSessionStorage('/enter/financialData/','OldFinancialDatastartDate','2000-01-01');
            updateSessionStorage('/enter/financialData/','OldFinancialDataendDate','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            updateSessionStorage('/enter/financialData/','OldFinancialDatastartDate',data[0]);
            updateSessionStorage('/enter/financialData/','OldFinancialDataendDate',data[1]);
        }
    };
    const toadd=()=>{
        history.push('/enter/addInvoiceFinancialDala');
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const isDelOpen=(record: FinancialRecord)=>{
        setIsOpen(true);
        setUid(record.id);
        setDelRecord(record);
    };
    // 送审：打开弹窗
    const submitForReview=(record: FinancialRecord)=>{
        setReviewRecord(record);
        setReviewOpen(true);
    };
    // 送审：确认提交
    const onReviewOK=()=>{
        if(!reviewRecord) return;
        setspinning(true);
        BillService.submitForReview(reviewRecord.id).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                message.success('送审成功');
                setReviewOpen(false);
                setReviewRecord(null);
                getList();
            }else{
                message.error(res.ErrorCode + res.Data);
            }
            setspinning(false);
        })
    };
    // 删除确定按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Bill/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setIsOpen(false);
                setDelRecord(null);
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
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus,expenseCode,userId:StaticInfo.userId}
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                console.log('原始数据列表',res.Data);
                setBillList(res.Data.data);
            }
            setspinning(false);
        })
    };
    
    const changeOrderCode = (e:ChangeEvent<HTMLInputElement>) => {
        setOrderCode(e.target.value);
    };
    const changeCompany_name = (e:ChangeEvent<HTMLInputElement>) => {
        setCompany_name(e.target.value);
        updateSessionStorage('/enter/financialData/','OldFinancialDatacompany_name',e.target.value);
    };
    const changeMoneyType = (e:number) => {
        setMoneyType(e);
        updateSessionStorage('/enter/financialData/','OldFinancialDatamoneyType',e);
    };
    const changeAccount_card = (e:ChangeEvent<HTMLInputElement>) => {
        setaccount_card(e.target.value);
        updateSessionStorage('/enter/financialData/','OldFinancialDataaccount_card',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };

    const updateStatusMap=(data:Record<string, string>)=> {
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
    const getReviewer=()=>{
        processConfiguration.one().then((res:TypeErrorCode)=>{
            console.log(res);
            updateStatusMap(res.Data);
        })
    };
    useEffect(() => {
        getSupplierList();
        getReviewer();
    }, []);
    useEffect(()=>{
        getList();
    },[page, pageSize]);
    const rowSelection: TableProps<FinancialRecord>['rowSelection'] = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
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
                    ? Math.max(...fdList.map((fdItem:any) => fdItem.id))
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
    const changeProject_name=(e:ChangeEvent<HTMLInputElement>)=>{
        setProject_name(e.target.value);
        updateSessionStorage('/enter/financialData/','OldFinancialDataproject_name',e.target.value);
    }
    const changeSupplierId=(e:number)=>{
        setsupplierId(e);
        updateSessionStorage('/enter/financialData/','OldFinancialDatasupplierId',e);
    }
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
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
            { label: '待提交', value: 100 },
            ...options
        ];
    };
    const changeStutes=(e:number)=>{
        setOrderStatus(e);
        updateSessionStorage('/enter/financialData/','OldFinancialDatabillStatus',e);
    }
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
                        <Button type="primary" onClick={toadd}>报销单</Button>
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
                                    const item = props.SupplierList.find(unit => unit.id === Number(option?.value ?? 0));
                                    return item?.supplierName?.toLowerCase().includes(input.toLowerCase()) ?? false;
                                }}
                                options={
                                    [
                                        { label: '全部', value: 0 },
                                        ...(Array.isArray(props.SupplierList) && props.SupplierList.length > 0
                                                ? props.SupplierList.map((item)=>({
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
                scroll={{y:'60vh'}}
                rowKey={(record) => record.id}
                size='small'
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={1}
                            >
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
            <Modal open={isOpen} onCancel={()=>{setIsOpen(false); setDelRecord(null);}} onOk={onOK} loading={spinning} title='删除确认' width={1000}>
                <div style={{marginBottom:'12px'}}>是否要删除以下数据？</div>
                {
                    delRecord ? (
                        <Descriptions bordered size='small' column={2}>
                            <Descriptions.Item label='日期'>
                                {delRecord.orderDate ? dayjs(delRecord.orderDate).format('YYYY-MM-DD') : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='报销单号'>
                                {delRecord.number || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='类型'>
                                报销
                            </Descriptions.Item>
                            <Descriptions.Item label='公司名称'>
                                {delRecord.company_name || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='项目名称'>
                                {delRecord.project_name || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='供应商'>
                                {delRecord.supplierName || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='总金额(元)'>
                                {delRecord.totalAmount ?? ''}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : null
                }
            </Modal>
            {/* 送审弹窗 */}
            <Modal open={reviewOpen} onCancel={()=>{setReviewOpen(false); setReviewRecord(null);}} onOk={onReviewOK} confirmLoading={spinning} title='送审确认' width={1000}>
                <div style={{marginBottom:'12px'}}>确认要将以下数据提交审核吗？</div>
                {
                    reviewRecord ? (
                        <Descriptions bordered size='small' column={2}>
                            <Descriptions.Item label='日期'>
                                {reviewRecord.orderDate ? dayjs(reviewRecord.orderDate).format('YYYY-MM-DD') : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='报销单号'>
                                {reviewRecord.number || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='公司名称'>
                                {reviewRecord.company_name || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='项目名称'>
                                {reviewRecord.project_name || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='供应商'>
                                {reviewRecord.supplierName || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='总金额(元)'>
                                {reviewRecord.totalAmount ?? ''}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : null
                }
            </Modal>
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
                    {/* 确保传递printList给打印组件 */}
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
const mapStateToProps = (state: RootState) => {
    return {
        count: state.Bill.count,
        SupplierList: state.Supplier.list,

    }
};
export default connect(mapStateToProps) (OldFinancialData)
