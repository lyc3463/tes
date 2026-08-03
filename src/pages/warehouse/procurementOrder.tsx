import {connect} from "umi";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {history} from "@@/core/history";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";

const ProcurementOrder=(props:any)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderOrderCode')||'');// 采购单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderWarehouseName')||'');// 仓库名称
    const [supplierName,setSupplierName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderSupplierName')||0);// 供应商
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderStartDate')||'2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(2);
    const [billStatus,setBillStatus]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderBillStatus')||0);// 是否交完钱状态
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [orderType,setOrderType]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderOrderType')||0);// 0 全部类型，1直接入库单,2 采购入库
    const [dUid,setDUid]=useState(0);// 缴费的ID
    const [dOpen,setDOpen]=useState(false);// 缴费确认弹窗
    const [paymentAmount,setPaymentAmount]=useState(0);// 缴费金额
    const [paymentType,setPaymentType]=useState(0);// 缴费支付类型
    const [payCrderCode,setPayCrderCode]=useState('');// 缴费订单号
    const [payOrderType,setPayOrderType]=useState(0);// 缴费订单类型
    const [uName,setUName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderUName')||'');// 采购人

    const columns=[
        {
            title:'申请日期',
            dataIndex:'orderTime',
            key:'orderTime',
            align:'center',
            render:(text)=>{
                return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
            }
        },
        {
            title:'采购单号',
            dataIndex:'orderCode',
            key:'orderCode',
            align:'center',
            ellipsis: true,
        },
        {
            title:'入库仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            ellipsis:true,

        },
        {
            title:'供应商',
            dataIndex:'supplierName',
            key:'supplierName',
            align:'center',
            ellipsis:true,
        },
        {
            title:'订单类型',
            dataIndex:'orderType',
            key:'orderType',
            align:'center',
            render:(text)=>{
                return text==1?'采购订单':'直接入库单'
            }
        },
        {
            title:'已交金额',
            dataIndex:'paidAmount',
            key:'paidAmount',
            align:'center',
        },
        {
            title:'物品总价',
            dataIndex:'totalAmount',
            key:'totalAmount',
            align:'center',
        },
        {
            title:'采购人',
            dataIndex:'user_name',
            key:'user_name',
            align:'center',
        },
        {
            title:'缴费状态',
            dataIndex:'billStatus',
            key:'billStatus',
            align:'center',
            render:(text)=>{
                return <Tag color={text==2?'green':'red'}>{text==2?'已交':'未交完'}</Tag>
            }
        },
        {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            ellipsis:true,
        },
        {
            title:'操作',
            dataIndex:'billStatus',
            key:'billStatus',
            align:'center',
            render:(text,record)=>{
                return(
                    <Space>
                        {record.billStatus==2?'':
                                <Button type='primary' onClick={()=>isPayment(record)}>缴费</Button>
                        }
                    </Space>
                )
            }
        },
    ];
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'ProcurementOrder/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType,uName}
        })
    };

    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getPayList();
        getSupplierList();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const isPayment=(e)=>{
        setDUid(e.id);
        setPayCrderCode(e.orderCode);
        setPayOrderType(e.orderType);
        setDOpen(true);
    };
    // 确定缴费
    const onOk=()=>{
        if (!paymentAmount){
            message.error('请输入缴费金额');
            return;
        }
        if (paymentType==0){
            message.error('请选择支付类型');
            return;
        }
        setSpinning(false);
        props.dispatch({
            type:'ProcurementOrder/payment',
            payload:{uid:dUid,paymentAmount,paymentType,payCrderCode,payOrderType}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('缴费成功');
                setDOpen(false);
                setSpinning(false);
                setPaymentType(0);
                setPaymentAmount(0);
                getList();
            }else{
                setDOpen(false);
                setSpinning(false);
                message.error(res.ErrorCode + res.Data);
            }
        })
    };
    // 缴费金额
    const changePaymentAmount=(e)=>{
        setPaymentAmount(e);
    };
    // 支付类型
    const changePaymentType=(e)=>{
        setPaymentType(e);
    };
    const getPayList=()=>{
        props.dispatch({
            type:'PayType/fetch',
        })
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderStartDate','2000-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderStartDate',data[0]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderEndDate',data[1]);
        }
    };
    const changeWarehouseName=(e)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderWarehouseName',e.target.value);

    };
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderOrderCode',e.target.value);
    };
    const changeBillStatus=(e)=>{
        setBillStatus(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderBillStatus',e);
    };
    const changeOrderType=(e)=>{
        setOrderType(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderOrderType',e);
    };
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderUName',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    const changeSupplierId=(e)=>{
        setSupplierName(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ProcurementOrderSupplierName',e);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
                        <Input
                            addonBefore="采购人:"
                            value={uName}
                            onChange={changeUName}
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
                                value={supplierName}
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
                                style={{
                                    width: 120,
                                }}
                                value={billStatus}
                                onChange={changeBillStatus}
                                options={[
                                    {
                                        label: '全部',
                                        value: 0,
                                    },
                                    {
                                        label: '已缴费',
                                        value: 2,
                                    },
                                    {
                                        label: '未缴费',
                                        value: 1,
                                    },
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
                                订单类型:
                            </div>
                            <Select
                                style={{
                                    width: 120,
                                }}
                                value={orderType}
                                onChange={changeOrderType}
                                options={[
                                    {
                                        label: '全部',
                                        value: 0,
                                    },
                                    {
                                        label: '采购订单',
                                        value: 1,
                                    },
                                    {
                                        label: '直接入库',
                                        value: 2,
                                    },
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
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
                scroll={{y:'60vh'}}
                dataSource={props.list}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary >
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.paidAmountSum:0}</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.totalAmountSum:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={dOpen} onCancel={()=>setDOpen(false)} onOk={onOk} loading={spinning} title='缴费确认'>
                <div style={{display:'flex',alignItems:'center',flexDirection: 'column',}}>
                    <Select
                        showSearch // 启用搜索
                        optionFilterProp="children" // 搜索选项的哪个属性
                        placeholder="选择支付类型"
                        style={{ width: 200 }}
                        onChange={changePaymentType}
                        filterOption={(input, option) => {
                            // 边界处理：选项不存在或无支付类型数据时不显示
                            if (!option || !Array.isArray(props.payTypeList)) return false;
                            // 根据选项value（支付类型ID）查找对应的支付类型对象
                            const payTypeItem = props.payTypeList.find(item => item.id === option.value);
                            // 不区分大小写匹配支付类型名称
                            return payTypeItem?.pmName.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.payTypeList)
                            ? props.payTypeList.map(item => ({
                                label: item.pmName, // 显示名称
                                value: item.id // 选项值（物品ID）
                            }))
                            : []}
                    />
                    <InputNumber
                        style={{ width: 200,marginTop:'10px' }}
                        addonBefore="缴费金额(元):"
                        value={paymentAmount}
                        min={0}
                        onChange={changePaymentAmount}
                    />
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.ProcurementOrder.list,
    count: state.ProcurementOrder.count,
    payTypeList: state.PayType.list,
    SupplierList: state.Supplier.list,
});
export default connect(mapStateToProps)(ProcurementOrder);
