import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";

const PurchaseRequestCheck=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckOrderCode')||'');// 采购单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckWarehouseName')||'');// 仓库名称
    const [supplierName,setSupplierName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckSupplierName')||'');// 供应商
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckStartDate')||'2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(Number(checkSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckOrderStatus')||0));// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 是否交完钱状态
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [orderType,setOrderType]=useState(1);// 订单类型
    const [dUid,setDUid]=useState(0);// 审核的ID
    const [dOpne,setDOpen]=useState(false);// 审核确认弹窗
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
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            ellipsis:true,
        },
        {
            title:'状态',
            dataIndex:'orderStatus',
            key:'orderStatus',
            align:'center',
            render:(text)=>{
                return(
                    <Space>
                        <Tag color={text==1?'blue':'green'}>{text==1?'未审核':'已审核'}</Tag>
                    </Space>
                )
            }
        },
        {
            title:'操作',
            dataIndex:'status',
            key:'status',
            align:'center',
            fixed:'right',
            render:(text,record)=>{
                return(
                    <Space>
                        {record.orderStatus==1&&<>
                            {userQx()[484]=='1'?<Button type="primary" onClick={()=>isCheckOpen(record.id)}>审核</Button>:''}
                        </>}
                    </Space>
                )
            }

        },
    ];
    const isCheckOpen=(id)=>{
        setDUid(id);
        setDOpen(true);
    };
    const checkOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:'PurchaseRequestCheck/check',
            payload:dUid,
        }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success('审核成功');
                setDOpen(false);
                setSpinning(false);
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'PurchaseRequestCheck/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'PurchaseRequestCheck/fenye',
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
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    const changeWarehouseName=(e)=>{
        updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckWarehouseName',e.target.value);
        setWarehouseName(e.target.value);
    };
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckOrderCode',e.target.value);
    };
    const changeSupplierName=(e)=>{
        setSupplierName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckSupplierName',e.target.value);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckStartDate','2000-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckStartDate',data[0]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckEndDate',data[1]);
        }
    };
    const changeOrderStatus=(e)=>{
        setOrderStatus(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','PurchaseRequestCheckOrderStatus',e);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="供应商:"
                            value={supplierName}
                            onChange={changeSupplierName}
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
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
                                    {label:'全部',value:0},
                                    {label:'待审核',value:1},
                                    {label:'已审核',value:2},
                                ]}
                            />
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
                scroll={{y:'60vh',x:1500}}
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
                            <Table.Summary.Cell index={6}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.paidAmountSum:0}</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.totalAmountSum:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title="审核弹窗" open={dOpne} onOk={()=>checkOk()} onCancel={()=>setDOpen(false)} loading={spinning}>
                是否要审核?
            </Modal>

        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.PurchaseRequestCheck.list,
    count: state.PurchaseRequestCheck.count,
});
export default connect(mapStateToProps)(PurchaseRequestCheck)
