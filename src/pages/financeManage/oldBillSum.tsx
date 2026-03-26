import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination, Segmented,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import {checkSessionStorage, newprocessBills, processBills, updateSessionStorage, userQx} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as BillService from '@/services/bill';
import {StaticInfo} from "@/StaticInfo";

const OldBillSum=(props:any)=>{
    // 展示total
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 账单列表
    const [billList,setBillList]=useState([]);
    // 开始时间
    const [startDate,setBillBgeinTime]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumstartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setBillEndTime]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumendDate')||'2099-01-01');
    // 账单状态
    const [orderStatus,setBillStatus]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumbillStatus')||2);
    // 删除的id
    const [uid,setUid]=useState(0);
    // 账户卡号
    const [account_card,setaccount_card]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumaccount_card')||'');
    // 公司名称
    const [company_name,setCompany_name]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumcompany_name')||'');
    // 财务单号
    const [orderCode,setOrderCode]=useState('');
    const [expenseCode,setExpenseCode]=useState('');    // 收入支出类型
    const [moneyType,setMoneyType]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSummoneyType')||2);
    const [project_name,setProject_name]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumproject_name')||'');
    const [supplierId,setsupplierId]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumsupplierId')||0);
    const [foType,setFoType]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumfoType')||2);
    const [paidStatus,setPaidStatus]=useState(checkSessionStorage('/financeManage/billSum/','OldBillSumpaidStatus')||0);
    const [isOpen,setIsOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [handlePayOpen,setHandlePayOpen]=useState(false);
    const [accountId,setAccountId]=useState(0);// 缴费的账户id
    const [paidAccountCard,setPaidAccountCard]=useState('');// 缴费的账户卡号
    const [paidAccountName,setPaidAccountName]=useState('');// 缴费的账户名
    const [paymentRemarks,setPaymentRemarks]=useState('');// 缴费的备注
    const [paymentAmount,setPaymentAmount]=useState(0);// 缴费的金额


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
            render:(text: any, record: any)=>{
                // 判断：是否包含下划线
                const hasUnderline = record.number && record.number.includes('_');
                return (
                    <span
                        style={{
                            color: hasUnderline ? '#333' : '#1890FF', // 有下划线=黑色，无=蓝色
                            cursor: hasUnderline ? 'default' : 'pointer' // 有下划线=无手型
                        }}
                        onClick={() => {
                            // 有下划线 → 不跳转
                            if (hasUnderline) return;
                            // 没有下划线 → 跳转
                            history.push(`/enter/newFinancialDataInfo?id=${record.id}`);
                        }}
                    >
                {text}
            </span>
                )
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
            title: '缴费状态',
            dataIndex: 'paidStatus',
            key: 'paidStatus',
            render:(text:any,record:any)=>{
                return(
                    <Tag color={text==1?'red':'green'}>
                        {text==1?'未交完':'已交完'}
                    </Tag>
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
            render: (text: any, record: any) => {
                // 🔥 核心逻辑：
                // 1. 只要包含 _ → 不显示
                // 2. 不包含 _ 并且 状态=1 → 才显示
                const showPay =
                    !(record.number && record.number.includes('_'))
                    && record.paidStatus === 1;
                return (
                    <Space>
                        {showPay && (
                            <Button type="primary" onClick={() => handlePay(record)}>
                                缴费
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];
    const handlePay=(e)=>{
        setUid(e.id);
        setHandlePayOpen(true);
        console.log(e);
        setAccountId(e.accountId);
        setPaidAccountCard(e.account_card);
        setPaidAccountName(e.account_name);
    };
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setBillBgeinTime('2000-01-01');
            setBillEndTime('2099-01-01');
            updateSessionStorage('/financeManage/billSum/','OldBillSumstartDate','2000-01-01');
            updateSessionStorage('/financeManage/billSum/','OldBillSumendDate','2099-01-01');
        } else {
            setBillBgeinTime(data[0]);
            setBillEndTime(data[1]);
            updateSessionStorage('/financeManage/billSum/','OldBillSumstartDate',data[0]);
            updateSessionStorage('/financeManage/billSum/','OldBillSumendDate',data[1]);
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
                getList(paidStatus);
            }else {
                message.error(res.ErrorCode + res.Data);
                setspinning(false);
            }
        })
    };
    const getList=(e)=>{
        setspinning(true);
        props.dispatch({
            type:'NewFinancialData/fetch',
            payload:{page, pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus:e,expenseCode}
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
        updateSessionStorage('/financeManage/billSum/','OldBillSumorderCode',e.target.value);
    };
    const changeCompany_name = (e:any) => {
        setCompany_name(e.target.value);
        updateSessionStorage('/financeManage/billSum/','OldBillSumcompany_name',e.target.value);
    };
    const changeMoneyType = (e:any) => {
        setMoneyType(e);
        updateSessionStorage('/financeManage/billSum/','OldBillSummoneyType',e);
    };
    const changeAccount_card = (e:any) => {
        setaccount_card(e.target.value);
        updateSessionStorage('/financeManage/billSum/','OldBillSumaccount_card',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList(paidStatus);
        getFenye(paidStatus);
    };
    const getFenye=(e)=>{
        props.dispatch({
            type:'NewFinancialData/fenye',
            payload:{pageSize, orderCode, company_name, account_card, startDate, endDate, orderStatus, moneyType,project_name,supplierId,foType,paidStatus:e,expenseCode}
        })
    };
    useEffect(() => {
        getFenye(paidStatus);
        getSupplierList();
    }, []);
    useEffect(()=>{
        getList(paidStatus);
    },[page, pageSize]);
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    const changeSupplierId=(e:any)=>{
        setsupplierId(e);
        updateSessionStorage('/financeManage/billSum/','OldBillSumsupplierId',e);
    }
    const changeStutes=(e:any)=>{
        setPaidStatus(e);
        updateSessionStorage('/financeManage/billSum/','OldBillSumpaidStatus',e);
        getList(e);
        getFenye(e);
    }

    const changeProject_name=(e:any)=>{
        setProject_name(e.target.value);
        updateSessionStorage('/financeManage/billSum/','OldBillSumproject_name',e.target.value);
    }
    const handlePayOk=()=>{
        if (!paymentAmount) return message.error('请输入缴费金额');
        setspinning(true);
        BillService.payment({
            uid,
            accountName:paidAccountName,
            accountBalance:0,
            payAmount:paymentAmount,
            remark:paymentRemarks,
            accountId,
            createName:StaticInfo.username
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('缴费成功');
                setHandlePayOpen(false);
                getList(paidStatus);
                getFenye(paidStatus);
            }else {
                message.error(res.ErrorCode + res.Data);
            }
        })
        setspinning(false);
    };

    return(
        <Spin spinning={spinning}>
            <Space.Compact>
                <div
                    style={{
                        borderRadius: "6px",
                        borderStartEndRadius: 0,
                        borderEndEndRadius: 0,
                        padding: "0 11px",
                        border: "1px solid #d9d9d9",
                        display: "flex",
                        alignItems: "center",
                        borderInlineEnd: 0,
                        height: 32,
                    }}
                >
                    缴费状态:
                </div>

                {/* 👇 替换成这个手写的 */}
                <div
                    style={{
                        display: "flex",
                        height: 32,
                        border: "1px solid #d9d9d9",
                        borderLeft: 0,
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                        overflow: "hidden",
                    }}
                >
                    <div
                        onClick={() => changeStutes(0)}
                        style={{
                            padding: "0 12px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            backgroundColor: paidStatus === 0 ? "#ff4d4f" : "#f5f5f5",
                            color: paidStatus === 0 ? "#fff" : "#333",
                        }}
                    >
                        全部
                    </div>
                    <div
                        onClick={() => changeStutes(1)}
                        style={{
                            padding: "0 12px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            backgroundColor: paidStatus === 1 ? "#ff4d4f" : "#f5f5f5",
                            color: paidStatus === 1 ? "#fff" : "#333",
                            borderLeft: "1px solid #d9d9d9",
                        }}
                    >
                        未交完
                    </div>
                    <div
                        onClick={() => changeStutes(2)}
                        style={{
                            padding: "0 12px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            backgroundColor: paidStatus === 2 ? "#ff4d4f" : "#f5f5f5",
                            color: paidStatus === 2 ? "#fff" : "#333",
                            borderLeft: "1px solid #d9d9d9",
                        }}
                    >
                        已交完
                    </div>
                </div>
            </Space.Compact>
            <List>
                <List.Item>
                    <Space>
                        {/*<Button type="primary" onClick={toadd}>财务数据录入</Button>*/}
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
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        类型:*/}
                        {/*    </div>*/}
                        {/*    <Select*/}
                        {/*        style={{ width: 120 }}*/}
                        {/*        value={moneyType}*/}
                        {/*        onChange={changeMoneyType}*/}
                        {/*        options={[*/}
                        {/*            { value: 1, label: '收入' },*/}
                        {/*            { value: 2, label: '支出' },*/}
                        {/*            { value: 0, label: '全部' },*/}
                        {/*        ]}*/}
                        {/*    />*/}
                        {/*</Space.Compact>*/}

                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        审核状态:*/}
                        {/*    </div>*/}
                        {/*    <Select*/}
                        {/*        style={{ width: 120 }}*/}
                        {/*        value={orderStatus}*/}
                        {/*        onChange={changeOrderStatus}*/}
                        {/*        options={[*/}
                        {/*            { value: 0, label: '全部' },*/}
                        {/*            { value: 1, label: '未审核' },*/}
                        {/*            { value: 2, label: '已审核' },*/}

                        {/*        ]}*/}
                        {/*    />*/}
                        {/*</Space.Compact>*/}
                        {/*<Button type="primary" onClick={isPrintModalOpen}>打印</Button>*/}
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
                // rowSelection={rowSelection}  // 添加选择功能配置
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={handlePayOpen} title={'缴费}'} loading={spinning} onCancel={()=>setHandlePayOpen(false)} onOk={handlePayOk}>
                <Form>
                    <Form.Item label='缴费账户'>
                        <Input value={`${paidAccountName}(${paidAccountCard})`} disabled/>
                    </Form.Item>
                    <Form.Item label='缴费金额'>
                        <InputNumber value={paymentAmount} onChange={(e)=>setPaymentAmount(e)}/>
                    </Form.Item>
                    <Form.Item label='备注'>
                        <Input.TextArea value={paymentRemarks} onChange={(e)=>setPaymentRemarks(e.target.value)} />
                    </Form.Item>
                </Form>
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
export default connect(mapStateToProps) (OldBillSum)