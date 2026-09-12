import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import {history} from "@@/core/history";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {updateSessionStorage, userQx} from "@/utils/OpenTool";
import * as ApplicationService from "@/services/application";
import * as Application from "@/services/application";
import { QuestionCircleOutlined } from '@ant-design/icons';

const DirectPurchase=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState('');// 采购单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [supplierName,setSupplierName]=useState(0);// 供应商
    const [startDate,setStartDate]=useState('2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState('2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(0);// 订单状态 已审核/未审核
    const [billStatus,setBillStatus]=useState(0);// 是否交完钱状态
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [orderType,setOrderType]=useState(2);// 订单类型
    const [dUid,setDUid]=useState(0);// 审核的ID
    const [dOpne,setDOpen]=useState(false);// 审核确认弹窗
    const [productsName,setProductsName]=useState('');// 物品名称
    const [uName,setUName]=useState('');// 采购人
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
            title:'审核人',
            dataIndex:'user_name',
            key:'user_name',
            align:'center',
            ellipsis:true,
        },
        {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            render: (text, record) => {
                // 定义状态颜色和文字
                let statusInfo = {};
                switch (text) {
                    case 1:
                        statusInfo = { color: 'blue', text: '待送审' };
                        break;
                    case 2:
                        statusInfo = { color: 'green', text: '已审核' };
                        break;
                    case 3:
                        statusInfo = { color: 'orange', text: '已提交报销' };
                        break;
                    case 4:
                        statusInfo = { color: 'purple', text: '已报销' };
                        break;
                    case 7:
                        statusInfo = { color: 'red', text: '已驳回' };
                        break;
                    case 8:
                        statusInfo = { color: 'orange', text: '已送审' };
                        break;
                    default:
                        statusInfo = { color: 'default', text: '未知状态' };
                }
                const reason = record && (record.rejectReason || record.reject_reason || record.reject || record.rejectedReason || '');
                return (
                    <Space>
                        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                        {text === 7 && reason ? (
                            <Tooltip title={reason} placement="topLeft">
                                <QuestionCircleOutlined style={{ color: '#999', marginLeft: 4 }} />
                            </Tooltip>
                        ) : null}
                    </Space>
                )
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
            dataIndex:'status',
            key:'status',
            align:'center',
            fixed:'right',
            width:200,
            render:(text,record)=>{
                return(
                    <Space>
                        {(record.orderStatus==1 || record.orderStatus==7)&&<>
                            <Button type="primary" size="small" onClick={()=>isDelOpen(record.id)}>删除</Button>
                            <Button type="primary" size="small" onClick={()=>{history.push(`/warehouse/editApplication?id=${record.id}`)}}>编辑</Button>
                             <Button type="primary" danger size="small" onClick={()=>sendCheck(record.id)}>直接送审</Button>
                        </>}
                    </Space>
                )
            }

        },
    ];
    // 直接送审
    const sendCheck=(e)=>{
        setSpinning(true);
        ApplicationService.sendCheck({uid:e}).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('送审成功');
                getList();
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const isDelOpen=(id)=>{
        setDUid(id);
        setDOpen(true);
    };
    // 前往入库
    const toAdd=()=>{
        history.push(`/warehouse/addDirectPurchase`);
    };
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'DirectPurchase/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType,uName}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'DirectPurchase/fenye',
            payload:{pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType,uName}
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
    const changeOrderStatus=(e)=>{
        setOrderStatus(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseOrderStatus',e);
    };
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseUName',e.target.value);
    };
    const changeSupplierId=(e)=>{
        setSupplierName(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','DirectPurchaseSupplierName',e);
    };
    const checkOk=()=>{
        setSpinning(true);
        ApplicationService.check(dUid).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success('审核成功');
                setDOpen(false);
                setSpinning(false);
                getList();
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const delOk=()=>{
        setSpinning(true);
        Application.remove(dUid).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('删除成功');
                setDOpen(false);
                getList();
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                       <Button type="primary" onClick={toAdd}>
                            新增直接入库
                        </Button>
                    </Space>
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
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                    <Space>
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
                                状态:
                            </div>
                            <Select
                                style={{ width: 120 }}
                                value={orderStatus}
                                onChange={changeOrderStatus}
                                options={[
                                    {label:'全部',value:0},
                                    {label:'待送审',value:1},
                                    {label:'已送审',value:8},
                                    {label:'已审核',value:2},
                                    {label:'已驳回',value:7},
                                    {label:'已提交报销',value:3},
                                    {label:'已报销',value:4},
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
                            <Table.Summary.Cell index={5}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.paidAmountSum:0}</div></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.totalAmountSum:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title="删除确认" open={dOpne} onOk={()=>delOk()} onCancel={()=>setDOpen(false)} loading={spinning}>
                是否要删除?
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.DirectPurchase.list,
    count: state.DirectPurchase.count,
    SupplierList: state.Supplier.list,
});
export default connect(mapStateToProps)(DirectPurchase)
