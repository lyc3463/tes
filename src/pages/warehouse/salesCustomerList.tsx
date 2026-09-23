import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect, history} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";
import {getData} from "@/network/http";

const SalesCustomerList=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/sales','SalesCustomerListOrderCode')||'');// 单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/sales','SalesCustomerListWarehouseName')||'');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/sales','SalesCustomerListStartDate')||'2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/sales','SalesCustomerListEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(Number(checkSessionStorage('/warehouse/sales','SalesCustomerListOrderStatus'))||0);// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 账单状态
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [orderType,setOrderType]=useState(5);// 订单类型
    const [dOpen,setDOpen]=useState(false);// 审核弹窗
    const [dId,setDId]=useState(0);// 审核id
    const [goods,setGoods]=useState<any[]>([]);
    const [reason,setReason]=useState('');
    const [uName,setUName]=useState(checkSessionStorage('/warehouse/sales','SalesCustomerListUName')||'');// 审核人
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
            title: '销售单',
            dataIndex: 'orderCode',
            ellipsis: true,
            align:'center',
            render:(text,record)=>{
                return <Button type='link' onClick={()=>history.push(`/warehouse/infoSalesList?id=${record.id}`)}>{text}</Button>
            }
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            ellipsis: true,
            render: (text: any) => {
                const statusMap = {1: ['blue', '待送审'], 2: ['green', '已审核'], 5: ['orange', '已送审'], 6: ['red', '已驳回']};
                const status = statusMap[text] || ['default', '未知状态'];
                return <Tag color={status[0]}>{status[1]}</Tag>
            },
        },
        {
            title: '申请人',
            dataIndex: 'user_name',
            ellipsis: true,
            align:'center',
        },
        {
            title: '销售人',
            dataIndex: 'xsName',
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
            title: '操作',
            align:'center',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space size="small">
                    {record.orderStatus==5?
                        <>
                            <Button
                                type="primary"
                                onClick={()=>{isDleOpen(record.id)}}
                            >审核</Button>
                        </>
                        :
                        null
                    }
                </Space>
            ),
        },
    ];
    // 删除的弹窗
    const isDleOpen=(e:number)=>{
        setDId(e);
        setDOpen(true);
        setReason('');
        getOne(e);
    };
    const getOne=async (id:number)=>{
        const res:any=await getData(1749,[id]);
        if(res.ErrorCode===0){
            setGoods(res.Data?.ppList || []);
        }else{
            message.error(res.Data);
        }
    };
    const getList=()=>{
        props.dispatch({
            type:'SalesCustomerList/fetch',
            payload:{page, orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType,uName}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'SalesCustomerList/fenye',
            payload:{orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType,uName}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const check= (orderStatus:number)=>{
        if(orderStatus===6 && !reason.trim()){
            message.warning('请输入驳回原因');
            return;
        }
        setSpinning(true);
        props.dispatch({
            type:'SalesCustomerList/check',
            payload:{uid:dId, orderStatus, Reason:reason}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success(orderStatus===2?'审核通过':'驳回成功');
                setSpinning(false);
                setDOpen(false);
                setReason('');
                getList();
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
                setDOpen(false);
            }
        })
    };
    const changeWarehouseName=(e)=>{
        updateSessionStorage('/warehouse/sales','SalesCustomerListWarehouseName',e.target.value);
        setWarehouseName(e.target.value);
    };
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/sales','SalesCustomerListOrderCode',e.target.value);
    }
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/sales','SalesCustomerListStartDate','2000-01-01');
            updateSessionStorage('/warehouse/sales','SalesCustomerListEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/sales','SalesCustomerListStartDate',data[0]);
            updateSessionStorage('/warehouse/sales','SalesCustomerListEndDate',data[1]);
        }
    };
    const changeOrderStatus=(e)=>{
        setOrderStatus(e);
        updateSessionStorage('/warehouse/sales','SalesCustomerListOrderStatus',e);
    }
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/warehouse/sales','SalesCustomerListUName',e.target.value);
    }
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
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
                            addonBefore="申请人:"
                            value={uName}
                            onChange={changeUName}
                        />
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
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
                                    {label:'全部',value:0},
                                    {label:'待送审',value:1},
                                    {label:'已审核',value:2},
                                    {label:'已送审',value:5},
                                    {label:'已驳回',value:6},
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
                    <Table.Summary>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.paidAmountSum:0}</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={8}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.totalAmountSum:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal
                title='审核'
                width={900}
                open={dOpen}
                confirmLoading={spinning}
                onCancel={()=>setDOpen(false)}
                footer={[
                    <Button key='pass' type='primary' onClick={()=>check(2)}>通过</Button>,
                    <Button key='reject' danger onClick={()=>check(6)}>驳回</Button>,
                    <Button key='close' onClick={()=>setDOpen(false)}>关闭</Button>,
                ]}
            >
                <Table
                    size='small'
                    pagination={false}
                    dataSource={goods}
                    rowKey={(record:any)=>record.ppId || record.id}
                    columns={[
                        {title:'物料名称',dataIndex:'productsName'},
                        {title:'物料编号',dataIndex:'productsCode'},
                        {title:'单位',dataIndex:'unitsName'},
                        {title:'数量',dataIndex:'quantity'},
                    ]}
                />
                <Input.TextArea rows={4} placeholder='请输入审核意见或驳回原因' value={reason} onChange={e=>setReason(e.target.value)} style={{marginTop:16}} />
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.SalesCustomerList.list,
    count: state.SalesCustomerList.count,
});

export default connect(mapStateToProps)(SalesCustomerList);
