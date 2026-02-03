import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import {history} from "@@/core/history";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {updateSessionStorage, userQx} from "@/utils/OpenTool";

const DirectPurchase=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState('');// 采购单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [supplierName,setSupplierName]=useState('');// 供应商
    const [startDate,setStartDate]=useState('2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState('2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(0);// 订单状态 已审核/未审核
    const [billStatus,setBillStatus]=useState(0);// 是否交完钱状态
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [orderType,setOrderType]=useState(2);// 订单类型
    const [dUid,setDUid]=useState(0);// 审核的ID
    const [dOpne,setDOpen]=useState(false);// 审核确认弹窗
    const [productsName,setProductsName]=useState('');// 物品名称
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
    ];
    // 前往入库
    const toAdd=(id:number)=>{
        history.push(`/warehouse/addDirectPurchase`);
    };
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'DirectPurchase/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'DirectPurchase/fenye',
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
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseOrderCode',e.target.value);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseStartDate','2000-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseStartDate',data[0]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseEndDate',data[1]);
        }
    };
    const changeWarehouseName=(e)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseWarehouseName',e.target.value);
    };
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
                        {userQx()[490]=='1'?<Button type="primary" onClick={toAdd}>
                            新增直接入库
                        </Button>:''}
                    </Space>
                    <Space>
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
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
                            <Table.Summary.Cell index={5}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.paidAmountSum:0}</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.totalAmountSum:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.DirectPurchase.list,
    count: state.DirectPurchase.count,
});
export default connect(mapStateToProps)(DirectPurchase)
