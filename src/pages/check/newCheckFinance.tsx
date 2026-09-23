import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, type TableProps, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import {checkSessionStorage, newprocessBills, updateSessionStorage, userQx} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import AllFinancialDataPrint from "@/components/AllFinancialDataPrint";
import {useReactToPrint} from "react-to-print";
import type { FinancialRecord, FinancialCount } from '@/ModelTypes/TypeFinancialData';
import FinancialDataPrint from "@/components/FinancialDataPrint";
interface NewCheckFinanceProps {
    dispatch: (action: { type: string; payload?: any }) => any;
    count?: FinancialCount;
    list?: FinancialRecord[];
    SupplierList?: any[];
}
const NewCheckFinance=(props: NewCheckFinanceProps)=>{
    // 展示total
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单列表
    const [billList,setBillList]=useState<FinancialRecord[]>([]);
    // 开始时间
    const [startDate,setBillBgeinTime]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDatastartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setBillEndTime]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDataendDate')||'2099-01-01');
    // 账单状态
    const [orderStatus,setBillStatus]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDataorderStatus')||0);
    const [uid,setUid]=useState(0);
    // 本次操作类型：2=审核 15=驳回（审核/驳回共用同一个方法）
    const [auditStatus,setAuditStatus]=useState(2);
    const [foType,setFoType]=useState(2);
    const [supplierId,setSupplierId]=useState(0);
    const [printProps,setPrintProps]=useState<FinancialRecord>({});
    // 账户卡号
    const [account_card,setaccount_card]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDataaccount_card')||'');
    const [moneyType,setMoneyType]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDatamoneyType')||0);
    const [company_name,setCompany_name]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDatacompany_name')||'');
    const [orderCode,setOrderCode]=useState('');
    const [expenseCode,setExpenseCode]=useState('');
    const [project_name,setProject_name]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDataprojectName')||'');
    const [paidStatus,setPaidStatus]=useState(checkSessionStorage('/check/checkFinance/','NewCheckFinancialDatapaidStatus')||0);
    const [isOpen,setIsOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [printModalOpen,setPrintModalOpen]=useState(false);
    const [printList,setPrintList]=useState<FinancialRecord[]>([]);
    const printRef = useRef<HTMLDivElement | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // 一键审核弹窗
    const [oneClickOpenModal,setOneClickOpenModal]=useState(false);
    const [showReimburseColumn, setShowReimburseColumn] = useState(false);

    // 用户权限
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setBillBgeinTime('2000-01-01');
            setBillEndTime('2099-01-01');
            updateSessionStorage('/check/checkFinance/','NewCheckFinancialDatastartDate','2000-01-01');
            updateSessionStorage('/check/checkFinance/','NewCheckFinancialDataendDate','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            updateSessionStorage('/check/checkFinance/','NewCheckFinancialDatastartDate',data[0]);
            updateSessionStorage('/check/checkFinance/','NewCheckFinancialDataendDate',data[1]);
        }
    };
    const toadd=()=>{
        history.push('/enter/addNewFinancialData');
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'NewFinancialData/check',
            payload:{id:uid,status:auditStatus}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success(auditStatus==2?'审核成功':'驳回成功')
                setIsOpen(false);
                setspinning(false);
                getList();
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
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
            title: (
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        setShowReimburseColumn(!showReimburseColumn)
                        setOrderCode('');
                        setExpenseCode('');
                    }}
                >
                    {showReimburseColumn ? '报销单号' : '财务单号'}
                </div>
            ),
            dataIndex: 'number',
            key: 'number',
            // 👇 你原来的逻辑 100% 保留，完全不动
            render: (text: any, record: any) => {
                const hasUnderline = record.number && /_\d+$/.test(record.number);
                return (
                    <span
                        style={{
                            color: hasUnderline ? '#333' : '#1890FF',
                            cursor: hasUnderline ? 'default' : 'pointer'
                        }}
                        onClick={() => {
                            if (hasUnderline) return;
                            // 你原来的跳转逻辑
                            history.push(`/enter/newFinancialDataInfo?id=${record.id}`);
                        }}
                    >
        {showReimburseColumn?record.number2:record.number}
      </span>
                );
            }
        },
        {
            title: '公司',
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            key: 'project_name',
            ellipsis: true,
        },
        {
            title: '账户名',
            dataIndex: 'account_name',
            key: 'account_name',
            ellipsis: true,
        },
        {
            title: '账户卡号',
            dataIndex: 'account_card',
            key: 'account_card',
            ellipsis: true,
        },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            key: 'supplierName',
            ellipsis: true,
        },
        {
            title: '类型',
            dataIndex: 'moneyType',
            key: 'moneyType',
            render:(text:any,record:any)=>{
                return(
                    <Tag color={text==1?'green':'red'}>
                        {text==1?'收入':'支出'}
                    </Tag>
                )
            }
        },
        {
            title: '收入总金额(元)',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render:(text:any,record:any)=>{
                return(
                    <span>{record.moneyType==1?text:0}</span>
                )
            }
        },
        {
            title: '已付金额(元)',
            dataIndex: 'paidAmount',
            key: 'paidAmount',
        },
        {
            title: '支出总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render:(text:any,record:any)=>{
                return(
                    <span>{record.moneyType==2?text:null}</span>
                )
            }
        },
        {
            title: '余额(元)',
            dataIndex: 'balance2',
            key: 'balance2',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {text.toFixed(2)}
                    </div>
                )
            }
        },
       {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render:(text)=>{
                const map: Record<number, { color: string; label: string }> = {
                    1: { color: 'red', label: '未审核' },
                    2: { color: 'green', label: '已审核' },
                    100: { color: 'orange', label: '待提交' },
                    15: { color: 'orange', label: '驳回' },
                };
                const current = map[text] || { color: 'default', label: '未知' };
                return (
                    <Tag color={current.color}>
                        {current.label}
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
            title: '审核人',
            dataIndex: 'reviewerName',
            key: 'reviewerName',
            render:(text:any,record:any)=>{
                return(
                    <Tag color={record.orderStatus==2?'green':'blue'}>
                        {record.orderStatus==2?text:''}
                    </Tag>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'amount',
            key: 'amount',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {record.orderStatus==1?
                        <Space>
                            <Button type='primary' onClick={()=>isCheck(record,2)}>审核</Button>
                            <Button type='danger' onClick={()=>isCheck(record,15)}>驳回</Button>
                        </Space>
                        :null}
                    </Space>
                )
            }
        },
    ];
    const changeOrderCode = (e:any) => {
        setOrderCode(e.target.value);
        updateSessionStorage('/check/checkFinance/','NewCheckFinancialDataorderCode',e.target.value);
    };
    const changeCompany_name = (e:any) => {
        setCompany_name(e.target.value);
        updateSessionStorage('/check/checkFinance/','NewCheckFinancialDatacompany_name',e.target.value);
    };
    const changeProject_name = (e:any) => {
        setProject_name(e.target.value);
        updateSessionStorage('/check/checkFinance/','NewCheckFinancialDataproject_name',e.target.value);
    };
    const changeMoneyType = (e:any) => {
        setMoneyType(e);
        updateSessionStorage('/check/checkFinance/','NewCheckFinancialDatamoneyType',e);
    };
    const changeOrderStatus = (e:any) => {
        setBillStatus(e);
        updateSessionStorage('/check/checkFinance/','NewCheckFinancialDataorderStatus',e);
    };
    const changeAccount_card = (e:any) => {
        setaccount_card(e.target.value);
        updateSessionStorage('/check/checkFinance/','NewCheckFinancialDataaccount_card',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const getList=()=>{
        setspinning(true);
        props.dispatch({
            type:'NewFinancialData/fetch',
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,foType,supplierId,paidStatus,expenseCode}
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                const newArr = newprocessBills(res.Data.data) as { ErrorCode: number; Data: FinancialRecord[] };
                // console.log('新数据列表',newArr);
                setBillList(newArr.Data);
            }
            setspinning(false);
        })
    };
    // 审核/驳回统一入口：status 2=审核 15=驳回
    const isCheck=(e:FinancialRecord,status:number)=>{
        setPrintProps(e);
        setIsOpen(true);
        setUid(e.id);
        setAuditStatus(status);
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    useEffect(() => {
        getSupplierList();
    }, []);
    useEffect(()=>{
        getList();
    },[page, pageSize])
    const rowSelection: TableProps<FinancialRecord>['rowSelection'] = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox' as any,  // 复选框类型
        // 根据iskc值控制复选框是否可用
        getCheckboxProps: (record: FinancialRecord) => ({
            disabled: (record.number && record.number.includes('_')),
        }),
    };
    // 一键审核弹窗
    const oneClickOpen=()=>{
        setOneClickOpenModal(true);
    };
    // 一键审核弹窗
    const onOneClick=()=>{
        setspinning(true);
        props.dispatch({
            type:'NewFinancialData/allReview',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('一键审核成功');
                setOneClickOpenModal(false);
            }else {
                message.error(res.Data);
            }
            setspinning(false);
        })
    };
    const changeSupplierId=(e:any)=>{
        setSupplierId(e);
        updateSessionStorage('/enter/financialData/','NewFinancialDatasupplierId',e);
    }
    const changeStutes=(e:any)=>{
        setPaidStatus(e);
        updateSessionStorage('/enter/financialData/','NewFinancialDatapaidStatus',e);
    }
     const isPrintModalOpen=()=>{
        if(selectedRowKeys.length===0){
            message.error('请选择要打印的财务数据');
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
                        {!showReimburseColumn? <Input
                            addonBefore="财务单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />:  <Input
                            addonBefore="报销单号:"
                            value={expenseCode}
                            onChange={(e)=>setExpenseCode(e.target.value)}
                        />}
                        <Input
                            addonBefore="公司名称:"
                            value={company_name}
                            onChange={changeCompany_name}
                        />
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
                                供应商:
                            </div>
                            <Select
                                style={{width:'250px'}}
                                showSearch
                                onChange={changeSupplierId}
                                placeholder='供应商'
                                value={supplierId}
                                filterOption={(input, option) => {
                                    return option?.label?.toLowerCase().includes(input.toLowerCase());
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
                            addonBefore="账户卡号:"
                            value={account_card}
                            onChange={changeAccount_card}
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
                                类型:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={moneyType}
                                onChange={changeMoneyType}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '收入' },
                                    { value: 2, label: '支出' },
                                ]}
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
                                状态:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={orderStatus}
                                onChange={changeOrderStatus}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                    { value: 100, label: '待提交' },
                                    { value: 15, label: '驳回' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <Button type="primary" onClick={isPrintModalOpen}>打印</Button>
                         {/*<Button type="primary" danger onClick={oneClickOpen}>一键审核</Button>*/}
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                dataSource={billList}
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
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>

                            <Table.Summary.Cell index={8}>
                                {props.count?props.count.totalAmountSum.toFixed(2):''}
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
                rowSelection={rowSelection}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOK} loading={spinning} width={1000}>
                <div>是否要{auditStatus==2?'审核':'驳回'}？</div>
                 <FinancialDataPrint {...{
                    orderCode:printProps.number,
                    title:printProps.moneyType==1?'收入证明单':'支付证明单',
                    goodsList:printProps.fdList,
                    totalAmount:printProps.totalAmount,
                    paidAmount:printProps.paidAmount,
                    moneyType:printProps.moneyType,
                    orderDate:printProps.orderDate,
                    company_name:printProps.company_name,
                    createUserName:printProps.createUserName,
                    reviewerName:printProps.reviewerName,
                    remark:printProps.remark,
                    project_name:printProps.project_name,
                    account_name:printProps.account_name,
                    account_code:printProps.account_code,
                    account_type:printProps.account_type,
                 }} />
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
                    <AllFinancialDataPrint
                        ref={printRef}
                        printList={printList}
                        className="print-only-content"
                    />
                </div>
            </Modal>
            {/* 一键审核 */}
            <Modal open={oneClickOpenModal} onCancel={()=>setOneClickOpenModal(false)} title='是否一键审核' loading={spinning} onOk={onOneClick}>
                <div>是否要一键审核?</div>
            </Modal>
            
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        count: state.NewFinancialData.count,
        list: state.NewFinancialData.list,
        SupplierList: state.Supplier.list,

    }
};
export default connect(mapStateToProps) (NewCheckFinance)