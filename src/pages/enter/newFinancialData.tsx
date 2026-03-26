import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import {checkSessionStorage, newprocessBills, processBills, updateSessionStorage, userQx} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import { useReactToPrint } from 'react-to-print';
import AllFinancialDataPrint from "@/components/AllFinancialDataPrint";
const NewFinancialData=(props:any)=>{
    // 展示total
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单列表
    const [billList,setBillList]=useState([]);
    // 开始时间
    const [startDate,setBillBgeinTime]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDatastartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setBillEndTime]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDataendDate')||'2099-01-01');
    // 账单状态
    const [orderStatus,setBillStatus]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDatabillStatus')||0);
    // 删除的id
    const [uid,setUid]=useState(0);
    // 账户卡号
    const [account_card,setaccount_card]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDataaccount_card')||'');
    // 公司名称
    const [company_name,setCompany_name]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDatacompany_name')||'');
    // 财务单号
    const [orderCode,setOrderCode]=useState('');
    const [expenseCode,setExpenseCode]=useState('');
    // 收入支出类型
    const [moneyType,setMoneyType]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDatamoneyType')||0);
    const [project_name,setProject_name]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDataproject_name')||'');
    const [supplierId,setsupplierId]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDatasupplierId')||0);
    const [foType,setFoType]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDatafoType')||2);
    const [paidStatus,setPaidStatus]=useState(checkSessionStorage('/enter/financialData/','NewFinancialDatapaidStatus')||0);
    const [isOpen,setIsOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [printModalOpen,setPrintModalOpen]=useState(false);
    const [printList,setPrintList]=useState([]);
    const printRef = useRef();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [showReimburseColumn, setShowReimburseColumn] = useState(false);

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
                const hasUnderline = record.number && record.number.includes('_');
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
            render:(text:any,record:any)=>{
                return(
                    <Tag color={text==1?'red':'green'}>
                        {text==1?'未审核':'已审核'}
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
                        {
                            record.orderStatus==1?<>
                                <Button type='primary' onClick={()=>{
                                    history.push(`/enter/editNewFinancialData?id=${record.id}`);
                                }}>编辑</Button>
                                <Button type='primary' danger onClick={()=>isDelOpen(record.id)}>删除</Button>
                            </>:null
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
            updateSessionStorage('/enter/financialData/','NewFinancialDatastartDate','2000-01-01');
            updateSessionStorage('/enter/financialData/','NewFinancialDataendDate','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            updateSessionStorage('/enter/financialData/','NewFinancialDatastartDate',data[0]);
            updateSessionStorage('/enter/financialData/','NewFinancialDataendDate',data[1]);
        }
    };
    const toadd=()=>{
        history.push('/enter/addNewFinancialData');
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const isDelOpen=(e)=>{
        setIsOpen(true);
        setUid(e);
    };
    // 删除确定按钮
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'NewFinancialData/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setIsOpen(false);
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
            type:'NewFinancialData/fetch',
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus,expenseCode}
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                console.log('原始数据列表',res.Data);
                let newArr=newprocessBills(res.Data);
                // console.log('新数据列表',newArr);
                setBillList(res.Data);
            }
            setspinning(false);
        })
    };
    const changeOrderCode = (e:any) => {
        setOrderCode(e.target.value);
    };
    const changeCompany_name = (e:any) => {
        setCompany_name(e.target.value);
        updateSessionStorage('/enter/financialData/','NewFinancialDatacompany_name',e.target.value);
    };
    const changeMoneyType = (e:any) => {
        setMoneyType(e);
        updateSessionStorage('/enter/financialData/','NewFinancialDatamoneyType',e);
    };
    const changeAccount_card = (e:any) => {
        setaccount_card(e.target.value);
        updateSessionStorage('/enter/financialData/','NewFinancialDataaccount_card',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    const getFenye=()=>{
        props.dispatch({
            type:'NewFinancialData/fenye',
            payload:{pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus,expenseCode}
        })
    };
    useEffect(() => {
        getFenye();
        getSupplierList();
    }, []);
    useEffect(()=>{
        getList();
    },[page, pageSize]);
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    const changeSupplierId=(e:any)=>{
        setsupplierId(e);
        updateSessionStorage('/enter/financialData/','NewFinancialDatasupplierId',e);
    }
    const changeStutes=(e:any)=>{
        setPaidStatus(e);
        updateSessionStorage('/enter/financialData/','NewFinancialDatapaidStatus',e);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',  // 复选框类型
        // 根据iskc值控制复选框是否可用
        getCheckboxProps: (record) => ({
            disabled: (record.number && record.number.includes('_')),
        }),
    };
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
        updateSessionStorage('/enter/financialData/','NewFinancialDataproject_name',e.target.value);
    }
    const changeOrderStatus=(e:any)=>{
        setBillStatus(e);
        updateSessionStorage('/enter/financialData/','NewFinancialDataorderStatus',e);
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
                        <Button type="primary" onClick={toadd}>财务数据录入</Button>
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
                            addonBefore="账户卡号:"
                            value={account_card}
                            onChange={changeAccount_card}
                        />
                        <Input
                            addonBefore="项目:"
                            value={project_name}
                            onChange={changeProject_name}
                        />
                    </Space>
                </List.Item>
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
                                    { value: 1, label: '收入' },
                                    { value: 2, label: '支出' },
                                    { value: 0, label: '全部' },
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
                                缴费状态:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={paidStatus}
                                onChange={changeStutes}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未交完' },
                                    { value: 2, label: '已交完' },
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
                                审核状态:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={orderStatus}
                                onChange={changeOrderStatus}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },

                                ]}
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
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
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
            <Modal open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOK} loading={spinning}>
                <div>是否要删除？</div>
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
const mapStateToProps = (state: any) => {
    return {
        count: state.NewFinancialData.count,
        SupplierList: state.Supplier.list,

    }
};
export default connect(mapStateToProps) (NewFinancialData)