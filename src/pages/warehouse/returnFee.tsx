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
import {useEffect, useState} from "react";
import {connect, history} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";

const ReturnFee=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeOrderCode')||'');// 单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeWarehouseName')||'');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeStartDate')||'2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(2);// 订单状态
    const [billStatus,setBillStatus]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeBillStatus')||0);// 账单状态·
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [orderType,setOrderType]=useState(2);// 订单类型
    const [dOpen,setDOpen]=useState(false);// 缴费弹窗是否打开
    const [dId,setDId]=useState(0);// 缴费的id
    const [paymentAmount,setPaymentAmount]=useState(0);// 缴费金额
    const [paymentType,setPaymentType]=useState(0);// 缴费支付类型
    const [payCrderCode,setPayCrderCode]=useState('');// 缴费订单号
    const [payOrderType,setPayOrderType]=useState(0);// 缴费订单类型
    const [uName,setUName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeUName')||'');// 申请人
    const columns = [
        {
            title: '申请时间',
            dataIndex: 'orderTime',
            ellipsis: true,
            align:'center',
            render: (text: any) => {
                return dayjs(text).format('YYYY-MM-DD');
            },
        },
        {
            title: '所属仓库',
            dataIndex: 'warehouseName',
            ellipsis: true,
            align:'center',
        },
        {
            title: '退货单',
            dataIndex: 'orderCode',
            ellipsis: true,
            align:'center',

        },
        {
            title: '缴费状态',
            dataIndex: 'billStatus',
            ellipsis: true,
            align:'center',
            render: (text: any) => {
                return <Tag color={text==2?'green':'red'}>{text==2?'已缴费':'未交完'}</Tag>
            },
        },
        {
            title: '申请人',
            dataIndex: 'user_name',
            ellipsis: true,
            align:'center',
        },
        {
            title: '已付金额(元)',
            dataIndex: 'paidAmount',
            ellipsis: true,
            align:'center',
        },
        {
            title: '总金额(元)',
            dataIndex: 'totalAmount',
            ellipsis: true,
            align:'center',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            ellipsis: true,
            align:'center',
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
    const isPayment=(e)=>{
        setDId(e.id);
        setPayCrderCode(e.orderCode);
        setPayOrderType(e.orderType);
        setDOpen(true);
    };
    const getList=()=>{
        props.dispatch({
            type:'ReturnFee/fetch',
            payload:{page, orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType,uName}
        })
    };

    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getPayList();
    }, []);
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
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
        setSpinning(true);
        props.dispatch({
            type:'ReturnFee/payment',
            payload:{uid:dId,paymentAmount,paymentType,payCrderCode,payOrderType}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('缴费成功');
                setDOpen(false);
                setSpinning(false);
                setPaymentType(0);
                setPaymentAmount(0);
            }else{
                setDOpen(false);
                setSpinning(false);
                message.error(res.ErrorCode + res.Data);
            }
        })
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeStartDate','2000-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeStartDate',data[0]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeEndDate',data[1]);
        }
    };
    const changeWarehouseName=(e)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeWarehouseName',e.target.value);

    };
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeOrderCode',e.target.value);
    };
    const changeBillStatus=(e)=>{
        setBillStatus(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeBillStatus',e);
    };
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReturnFeeUName',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="申请人:"
                            value={uName}
                            onChange={changeUName}
                        />
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
    list: state.ReturnFee.list,
    count: state.ReturnFee.count,
    payTypeList: state.PayType.list

});

export default connect(mapStateToProps)(ReturnFee);
