import {Button, DatePicker, Input, InputNumber, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import {connect,history} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import * as Application from '@/services/application';
import { InStatus, IN_STATUS } from "@/utils/commonEnum";

function mergeByWoCode(data) {
    const map = new Map();
    data.forEach(item => {
        const { woCode, id, productsName, productsCode, unitsName, price, quantity, ...rest } = item;
        if (map.has(woCode)) {
            // 已存在，追加到 productsList
            map.get(woCode).productsList.push({
                id,
                productsName,
                productsCode,
                unitsName,
                price,
                quantity
            });
        } else {
            // 不存在，创建新条目
            map.set(woCode, {
                ...rest,
                woCode,
                productsList: [{
                    id,
                    productsName,
                    productsCode,
                    unitsName,
                    price,
                    quantity
                }]
            });
        }
    });

    return Array.from(map.values());
}

const PurchaseReceiving=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingOrderCode')||'');// 采购单号
    const [warehouseId,setWarehouseId]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingWarehouseId')||0);// 仓库ID
    const [unitsId,setUnitsId]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingUnitsId')||0);// 单位ID
    const [supplierName,setSupplierName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingSupplierName')||0);// 供应商
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingStartDate')||'2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(Number(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingOrderStatus')||0));// 订单状态
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [woCode,setWoCode]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingWoCode')||'');// 订单号
    const [productsName,setProductsName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingProductsName')||'');// 物品名称
    const [dUid,setDUid]=useState(0);// 审核的ID
    const [dOpne,setDOpen]=useState(false);// 审核确认弹窗
    const [dOpneNew,setDOpenNew]=useState(false);// 新审核确认弹窗
    const [list,setList]=useState([]);// 列表
    const [count,setCount]=useState(0);// 总条数
    const [quantitySum,setQuantitySum]=useState(0);// 物品数量总和
    const [checkWoCode,setCheckWoCode]=useState('');// 审核的入库单号
    const [checkStutes,setCheckStutes]=useState(0);// 审核的状态
    const [openOrderList,setOpenOrderList]=useState([]);// 打开订单列表
    const [editOpen,setEditOpen]=useState(false);// 修改弹窗
    const [editOrderList,setEditOrderList]=useState<any[]>([]);// 修改中的订单列表
    const [editRemark,setEditRemark]=useState('');// 修改中的备注
    const [uName,setUName]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingUName')||'');// 提交人
    const [delOpen,setDelOpen]=useState(false);// 删除确认弹窗
    const [delOrderList,setDelOrderList]=useState<any[]>([]);// 删除中的订单列表
    const [delRecord,setDelRecord]=useState<any>(null);// 删除的记录
    const [rejectReason,setRejectReason]=useState('');// 驳回原因
    const [userId,setUserId]=useState(checkSessionStorage('/warehouse/checkPurchaseRequest','ReceivingUserId')||0);// 用户ID
    const columns=[
        {
            title:'生成日期',
            dataIndex:'created',
            key:'created',
            align:'center',
            width:120,
            render:(text)=>{
                return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
            }
        },
        {
            title:'采购单号',
            dataIndex:'orderCode',
            key:'orderCode',
            align:'center',
            width:170,
        },
        {
            title:'入库单号',
            dataIndex:'woCode',
            key:'woCode',
            align:'center',
            width:170,
        },
        {
            title:'入库仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            width:150,
        },
         {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            render:(text:string)=>{
                return <span>{text || '-'}</span>
            }
        },
        {
            title:'物品信息',
            dataIndex:'productsList',
            key:'productsList',
            align:'left',
            width:520,
            render:(productsList=[]) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 360 }}>
                    {productsList.map((item:any, index:number) => (
                        <div
                            key={`${item.id || item.productsCode || index}-${index}`}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(120px, 2.2fr) minmax(100px, 1.6fr) 60px 80px 80px',
                                gap: 8,
                                padding: '8px 10px',
                                background: index % 2 === 0 ? '#f7f9fc' : '#ffffff',
                                border: '1px solid #eef2f7',
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>名称</div>
                                <div style={{ fontWeight: 600, wordBreak: 'break-word' }}>{item.productsName || '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>编号</div>
                                <div>{item.productsCode || '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>单位</div>
                                <div>{item.unitsName || '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>单价</div>
                                <div>{item.price != null ? Number(item.price).toFixed(2) : '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>数量</div>
                                <div>{item.quantity ?? '-'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title:'提交人',
            dataIndex:'user_name',
            key:'user_name',
            align:'center',
            width:120,
            ellipsis:true,
        },
        {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            align: 'center',
            width:120,
            render: (text, record) => {
                    // 定义状态颜色和文字
                    let statusInfo = {} as any;
                    switch (text) {
                        case 1:
                            statusInfo = { color: 'blue', text: '未入库' };
                            break;
                        case 2:
                            statusInfo = { color: 'green', text: '已提交' };
                            break;
                        case 3:
                            statusInfo = { color: 'orange', text: '已入库' };
                            break;
                        case 4:
                            statusInfo = { color: 'purple', text: '驳回' };
                            break;
                        default:
                            statusInfo = { color: 'default', text: '未知状态' };
                    }
                    const reason = record && (record.rejectReason || record.reject_reason || record.reject || record.rejectedReason || '');
                    return (
                        <Space>
                            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                            {text === 4 && reason ? (
                                <Tooltip title={reason} placement="topLeft">
                                    <QuestionCircleOutlined style={{ color: '#999', marginLeft: 4 }} />
                                </Tooltip>
                            ) : null}
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
            width:180,
            render:(text,record)=>{
                return(
                    <Space>
                        {
                            record.orderStatus === 2 && (
                                <Space>
                                    {/* <Button type='primary' onClick={()=>isCheckOpen(record, 3)}>审核入库</Button>
                                    <Button type='primary' onClick={()=>isCheckOpen(record, 4)}>驳回</Button> */}
                                    <Button type="primary" onClick={() => isCheckOpenNew(record.id)}>审核</Button>
                                </Space>
                            )
                        }
                        {
                            record.orderStatus === 3 && null
                        }
                    </Space>
                )
            }
        },
    ];
    const detailColumns = [
        {
            title: '物品名称',
            dataIndex: 'productsName',
            key: 'productsName',
            align: 'center',
        },
        {
            title: '物品编号',
            dataIndex: 'productsCode',
            key: 'productsCode',
            align: 'center',
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key: 'unitsName',
            align: 'center',
        },
        {
            title: '入库单价',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            render: (text) => <span>{text != null ? Number(text).toFixed(2) : '-'}</span>,
        },
        {
            title: '入库数量',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
    ];
    const isCheckOpen=(record, status = 2)=>{
        setCheckWoCode(record.woCode);
        setOpenOrderList(record.productsList || []);
        setCheckStutes(status);
        setDOpen(true);
    };
    const isEditOpen=(record)=>{
        const list = Array.isArray(record.productsList) ? record.productsList.map(item => ({ ...item })) : [];
        setCheckWoCode(record.woCode);
        setOpenOrderList(list);
        setEditOrderList(list);
        setEditOpen(true);
    };
    const handleEditOrderList=(index:number, field:'price'|'quantity', value:any)=>{
        setEditOrderList(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };
    const checkOk=()=>{
        setSpinning(true);
        Application.warehousingInspection({checkWoCode, checkStutes,rejectReason}).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                const successText = checkStutes === 3 ? '审核成功，已入库' : checkStutes === 4 ? '驳回成功' : '提交成功，待审核';
                message.success(successText);
                setDOpen(false);
                setSpinning(false);
                getList();
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const [reason, setReason] = useState('');
    const { TextArea } = Input;
    const checkOkNew = () => {
        setSpinning(true);
        let status = InStatus.APPROVED; // 默认状态为通过
        Application.warehousingInspection({checkWoCode, status, rejectReason}).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success('审核成功');
                setReason('');
                setDOpenNew(false);
                setSpinning(false);
                getList();
            } else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const checkReturn = () => {
        setSpinning(true);
        let status = InStatus.REJECTED; // 设置状态为驳回
        Application.warehousingInspection({checkWoCode, status, rejectReason}).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                message.success('驳回成功');
                setReason('');
                setDOpenNew(false);
                setSpinning(false);
                getList();
            } else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
      // 单位列表
    const getUnitSettingList=()=>{
        props.dispatch({
            type:'UnitSetting/fetch',
        })
    };
    // 管理员列表
    const getUserList=()=>{
        props.dispatch({
            type:'Users/fetch',
        })
    };
    // 仓库列表
    const getWarehouseList=()=>{
        props.dispatch({
            type:'WarehouseList/fetch',
        })
    };
    // 列表信息
    const getList=()=>{
        Application.orderList({page, pageSize, orderCode, unitsId,warehouseId, supplierName, startDate, endDate, orderStatus,woCode,productsName,userId}).then((res:TypeErrorCode)=>{
            console.log(res.Data);
            if(res.ErrorCode===0){
                console.log('入库列表',res.Data);
                // setList(res.Data.data);
                setCount(res.Data.count);
                setList(mergeByWoCode(res.Data.data));
                console.log('合并后的列表',list);
                // setPaidAmountSum(res.Data.paidAmountSum);
                setQuantitySum(res.Data.quantitySum);
            }else{
                message.error(res.Data);
            }
        })
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const getSupplierList=()=>{
        props.dispatch({
            type:"Supplier/fetch",
        })
    };
    // 单位id
    const changeUnitId=(e)=>{
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingUnitsId',e);
        setUnitsId(e);
    };
    // 仓库id
    const changeWarehouse=(e)=>{
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingWarehouseId',e);
        setWarehouseId(e);
    };
    const changeUserID=(e)=>{
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingUserId',e);
        setUserId(e);
    };
    useEffect(() => {
        getSupplierList();
        getWarehouseList();
        getUnitSettingList();
        getUserList();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingOrderCode',e.target.value);
    };
    const changeSupplierId=(e)=>{
        setSupplierName(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingSupplierName',e);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingStartDate','2000-01-01');
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingStartDate',data[0]);
            updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingEndDate',data[1]);
        }
    };
    const changeOrderStatus=(e)=>{
        setOrderStatus(e);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingOrderStatus',e);
    };
    const changeUName=(e)=>{
        setUName(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingUName',e.target.value);
    };
    const changeWoCode=(e)=>{
        setWoCode(e.target.value);
        updateSessionStorage('/warehouse/checkPurchaseRequest','ReceivingWoCode',e.target.value);
    };
    const editOk=()=>{
        setSpinning(true);
        let newArr = editOrderList.map(item => ({   
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            remark: editRemark || ''
        }));
        Application.editOrder(JSON.stringify(newArr)).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success('提交成功，待审核');
                setDOpen(false);
                setSpinning(false);
                getList();
                setEditOpen(false);
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const isDelOpen=(record)=>{
        setDelRecord(record);
        setDelOrderList(Array.isArray(record.productsList) ? record.productsList.map(item => ({ ...item })) : []);
        setDelOpen(true);
    };
    const delOk=()=>{
        setSpinning(true);
        if (!delRecord) {
            setSpinning(false);
            return;
        }
        Application.deleteOrder({ woCode: delRecord.woCode }).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success('删除成功');
                setDelOpen(false);
                setSpinning(false);
                getList();
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        }).catch(()=>{
            setSpinning(false);
            message.error('删除失败');
        });
    };
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
                                单位:
                            </div>
                            <Select
                                style={{width:120}}
                                placeholder='请选择单位'
                                value={unitsId}
                                onChange={changeUnitId}
                                // 添加"全部"选项并保留原有仓库列表
                                options={[
                                    { label: '全部', value: 0 }, // 新增"全部"选项
                                    ...(Array.isArray(props.UnitSettingList) && props.UnitSettingList.length > 0
                                        ? props.UnitSettingList.map((item: any) => ({
                                            label: item.unitsName,
                                            value: item.id,
                                        }))
                                        : [])
                                ]}
                            />
                        </Space.Compact>
                        <Input
                            addonBefore="采购单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
                        <Input
                            addonBefore="入库单号:"
                            value={woCode}
                            onChange={changeWoCode}
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
                                所属仓库:
                            </div>
                            <Select
                                style={{width:120}}
                                placeholder='请选择入库仓库'
                                value={warehouseId}
                                onChange={changeWarehouse}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = props.WarehouseList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.warehouseName?.toLowerCase().includes(input.toLowerCase());
                                }}
                                // 添加"全部"选项并保留原有仓库列表
                                options={[
                                    { label: '全部', value: 0 }, // 新增"全部"选项
                                    ...(Array.isArray(props.WarehouseList) && props.WarehouseList.length > 0
                                        ? props.WarehouseList.map((item: any) => ({
                                            label: item.warehouseName,
                                            value: item.id,
                                        }))
                                        : [])
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
                                提交人:
                            </div>
                            <Select
                                style={{width:120}}
                                placeholder='请选择'
                                value={userId}
                                onChange={changeUserID}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = props.UsersList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                                }}
                                // 添加"全部"选项并保留原有仓库列表
                                options={[
                                    { label: '全部', value: 0 }, // 新增"全部"选项
                                    ...(Array.isArray(props.UsersList) && props.UsersList.length > 0
                                        ? props.UsersList.map((item: any) => ({
                                            label: item.user_name,
                                            value: item.id,
                                        }))
                                        : [])
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
                                    {label:'全部',value:0},
                                    {label:'待提交',value:1},
                                    {label:'待审核',value:2},
                                    {label:'已入库',value:3},
                                    {label:'驳回',value:4},
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
                style={{border:'1px solid #ddd',borderRadius:'4px'} }
                pagination={false}
                scroll={{y:'60vh',x:1650}}
                dataSource={list}
                rowKey={(record,index) => `${record.woCode || record.id || 'row'}-${index}`}
                size='small'
                expandable={{
                    expandedRowRender: (record:any) => (
                        <div style={{ padding: '12px 16px', background: '#fafafa' }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>物品明细</div>
                            <Table
                                columns={detailColumns}
                                dataSource={record.productsList || []}
                                pagination={false}
                                size='small'
                                bordered
                                rowKey={(item:any, index:number) => `${record.woCode || record.id || 'detail'}-${item.id || item.productsCode || index}`}
                            />
                        </div>
                    ),
                    rowExpandable: (record:any) => Array.isArray(record.productsList) && record.productsList.length > 0,
                }}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
            <Modal
                title={checkStutes === 4 ? '驳回弹窗' : '提交弹窗'}
                open={dOpne}
                onOk={()=>checkOk()}
                onCancel={()=>setDOpen(false)}
                loading={spinning}
                width={760}
            >
                <GoodsInfoTable list={openOrderList} title={checkStutes === 4 ? '待驳回入库商品' : '待提交入库商品'}/>
                {checkStutes === 4 && (
                    <div style={{ marginTop: 16 }}>
                        <div style={{ marginBottom: 8, fontWeight: 600 }}>驳回原因:</div>
                        <Input.TextArea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="请输入驳回原因"
                            rows={4}
                        />
                    </div>
                )}
            </Modal>
            <Modal
                title="修改入库商品"
                open={editOpen}
                onOk={editOk}
                onCancel={() => setEditOpen(false)}
                width={860}
            >
                <GoodsEditTable list={editOrderList} onChange={handleEditOrderList} />
                <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>备注:</div>
                    <Input.TextArea
                        value={editRemark}
                        onChange={(e) => setEditRemark(e.target.value)}
                        placeholder="请输入备注"
                        rows={4}
                    />
                </div>
            </Modal>
            <Modal
                title="删除入库商品"
                open={delOpen}
                onOk={delOk}
                onCancel={() => setDelOpen(false)}
                width={760}
            >
                <GoodsInfoTable list={delOrderList} title="待删除入库商品"/>
            </Modal>
            <Modal
                width={1000}
                open={dOpneNew}
                title="审核"
                onCancel={() => setDOpenNew(false)}
                loading={spinning}
                footer={[
                    <Button key="submit" type="primary" onClick={() => checkOkNew()}>
                        通过
                    </Button>,
                    <Button key="return" type="primary" danger onClick={() => checkReturn()}>
                        驳回
                    </Button>,
                    <Button key="cancel" onClick={() => setDOpenNew(false)}>
                        关闭
                    </Button>
                ]}
            >
                <Table
                    columns={columns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'} }
                    pagination={false}
                    scroll={{y:'60vh',x:1650}}
                    dataSource={list}
                    rowKey={(record,index) => `${record.woCode || record.id || 'row'}-${index}`}
                    size='small'
                    expandable={{
                        expandedRowRender: (record:any) => (
                            <div style={{ padding: '12px 16px', background: '#fafafa' }}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>物品明细</div>
                                <Table
                                    columns={detailColumns}
                                    dataSource={record.productsList || []}
                                    pagination={false}
                                    size='small'
                                    bordered
                                    rowKey={(item:any, index:number) => `${record.woCode || record.id || 'detail'}-${item.id || item.productsCode || index}`}
                                />
                            </div>
                        ),
                        rowExpandable: (record:any) => Array.isArray(record.productsList) && record.productsList.length > 0,
                    }}
                />
                <br />
                <br />
                审核意见
                <TextArea rows={4} placeholder="请输入审核意见" value={reason} onChange={(e) => setReason(e.target.value)} />
            </Modal>
        </Spin>
    )
};
const mapStateToProps = (state: any) => ({
    SupplierList: state.Supplier.list,
    WarehouseList: state.WarehouseList.list,
    UnitSettingList: state.UnitSetting.list,
    UsersList: state.Users.list,

});
export default connect(mapStateToProps)(PurchaseReceiving)

function GoodsInfoTable({
    list,
    title = '待提交入库商品',
}: {
    list: Array<{
        productsName?: string;
        productsCode?: string;
        unitsName?: string;
        price?: number | string;
        quantity?: number | string;
    }>;
    title?: string;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>{title}</div>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#fafafa' }}>
                            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>物品名称</th>
                            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>物品编号</th>
                            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>单位</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>入库单价</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>入库数量</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item:any,index:number)=>(
                            <tr key={index} style={{ background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', verticalAlign: 'top' }}>{item.productsName || '-'}</td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', verticalAlign: 'top' }}>{item.productsCode || '-'}</td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', verticalAlign: 'top' }}>{item.unitsName || '-'}</td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', textAlign: 'right', verticalAlign: 'top' }}>{item.price != null ? Number(item.price).toFixed(2) : '-'}</td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', textAlign: 'right', verticalAlign: 'top' }}>{item.quantity ?? '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function GoodsEditTable({
    list,
    onChange,
}: {
    list: Array<{
        productsName?: string;
        productsCode?: string;
        unitsName?: string;
        price?: number | string;
        quantity?: number | string;
    }>;
    onChange: (index: number, field: 'price' | 'quantity', value: any) => void;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>可修改的入库商品</div>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#fafafa' }}>
                            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>物品名称</th>
                            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>物品编号</th>
                            <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>单位</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>入库单价</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>入库数量</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item:any,index:number)=>(
                            <tr key={index} style={{ background: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', verticalAlign: 'top' }}>{item.productsName || '-'}</td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', verticalAlign: 'top' }}>{item.productsCode || '-'}</td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', verticalAlign: 'top' }}>{item.unitsName || '-'}</td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', textAlign: 'right', verticalAlign: 'top' }}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        value={item.price ?? 0}
                                        min={0}
                                        precision={2}
                                        onChange={(value) => onChange(index, 'price', value ?? 0)}
                                    />
                                </td>
                                <td style={{ padding: '10px 12px', borderBottom: index === list.length - 1 ? 'none' : '1px solid #f0f0f0', textAlign: 'right', verticalAlign: 'top' }}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        value={item.quantity ?? 0}
                                        min={0}
                                        precision={0}
                                        onChange={(value) => onChange(index, 'quantity', value ?? 0)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
