import {connect} from "umi";
import {useEffect, useState} from "react";
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

const ProcurementOrder=(props:any)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState('');// 采购单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [supplierName,setSupplierName]=useState('');// 供应商
    const [startDate,setStartDate]=useState('2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState('2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(2);// 订单状态 已审核/未审核
    const [billStatus,setBillStatus]=useState(0);// 是否交完钱状态
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [orderType,setOrderType]=useState(0);// 订单类型
    const [dUid,setDUid]=useState(0);// 缴费的ID
    const [dOpen,setDOpen]=useState(false);// 缴费确认弹窗
    const [paymentAmount,setPaymentAmount]=useState(0);// 缴费金额
    const [paymentType,setPaymentType]=useState(0);// 缴费类型
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
            render:(text,record)=>{
                return(
                    <Button type='link' onClick={()=>{history.push(`/warehouse/infpApplication?id=${record.id}`);}}>{text}</Button>
                )
            }
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
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            ellipsis:true,
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
            title:'订单类型',
            dataIndex:'orderType',
            key:'orderType',
            align:'center',
            render:(text)=>{
                return text==1?'采购订单':'直接入库单'
            }
        },
        {
            title:'缴费状态',
            dataIndex:'billStatus',
            key:'billStatus',
            align:'center',
            render:(text)=>{
                return <Tag color={text==2?'green':'red'}>{text==2?'已交':'未交完'}</Tag>
            }
        }, {
            title:'操作',
            dataIndex:'billStatus',
            key:'billStatus',
            align:'center',
            render:(text,record)=>{
                return(
                    <Space>
                        <Button type='primary' onClick={()=>isPayment(record.id)}>缴费</Button>
                    </Space>
                )
            }
        },
    ];
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'ProcurementOrder/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'ProcurementOrder/fenye',
            payload:{pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getFenye();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const isPayment=(e)=>{
        setDUid(e);
        setDOpen(true);
    };
    // 确定缴费
    const onOk=()=>{
        setSpinning(false);
        props.dispatch({
            type:'ProcurementOrder/payment',
            payload:{uid:dUid,paymentAmount,paymentType}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('缴费成功');
                setDOpen(false);
                setSpinning(false);
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                        />
                        <Input
                            addonBefore="单号:"
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
                                日期:
                            </div>
                            <DatePicker.RangePicker/>
                        </Space.Compact>
                        <Button type="primary" >
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
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={dOpen} onCancel={()=>setDOpen(false)} onOk={onOk} loading={spinning} title='缴费确认'>
               <Space>
                   <Select
                       onChange={changePaymentType}
                       style={{width:'120px'}}
                       options={[{
                           label:'现金',
                           value:'1',
                       },{
                           label:'支付宝',
                           value:'2',
                       },{
                           label:'微信',
                           value:'3',
                       }]
                       }
                       placeholder="请选择支付类型"
                   />
                   <InputNumber
                       addonBefore="缴费金额(元):"
                       value={paymentAmount}
                       min={0}
                       onChange={changePaymentAmount}
                   />
               </Space>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.ProcurementOrder.list,
    count: state.ProcurementOrder.count,
});
export default connect(mapStateToProps)(ProcurementOrder);
