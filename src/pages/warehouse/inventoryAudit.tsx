import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";
import * as InventoryRequest from '@/services/inventoryRequest';

const InventoryAudit=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/inventory','inventoryAuditOrderCode') || '');// 单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/inventory','inventoryAuditWarehouseName') || '');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/inventory','inventoryAuditStartDate') || '2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/inventory','inventoryAuditEndDate') || '2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(0);// 订单状态
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [dOpen,setDOpen]=useState(false);// 删除弹窗是否打开
    const [dId,setDId]=useState(0);// 删除的id
    const [auditStatus,setAuditStatus]=useState(2);
    const [rejectReason,setRejectReason]=useState('');
    const columns=[
        {
            title:'申请日期',
            dataIndex:'stockTime',
            key:'stockTime',
            ellipsis:true,
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title:'盘点单号',
            dataIndex:'stockCode',
            key:'stockCode',
            ellipsis:true,
            render:(text,record)=>{
                return <Button type='link' onClick={()=>{history.push(`/warehouse/inventoryRequestDetail?id=${record.id}&stockStutes=${3}`)}}>{text}</Button>
            }
        },
        {
            title:'所属仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            ellipsis:true,
        },
        {
            title:'状态',
            dataIndex:'stockStatus',
            key:'stockStatus',
            ellipsis:true,
            render:(text)=>{
                const statusMap: Record<number, {color: string; text: string}> = {
                    1: {color: 'blue', text: '未审核'},
                    2: {color: 'green', text: '已审核'},
                    3: {color: 'orange', text: '已送审'},
                    4: {color: 'red', text: '已驳回'},
                };
                const status = statusMap[Number(text)] || {color: 'default', text: '未知状态'};
                return <Tag color={status.color}>{status.text}</Tag>
            }
        },
        {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            ellipsis:true,
        },
        {
            title:'操作',
            dataIndex:'status',
            key:'status',
            render:(text,record)=>{
                return(
                    <>
                        {record.stockStatus==3?<Space>
                            {/* <Button onClick={()=>isCheckOpen(record.id, 2)} type='primary'>通过</Button> */}
                            {/* <Button onClick={()=>isCheckOpen(record.id, 4)} danger>驳回</Button> */}
                            <Button type='primary' onClick={()=>isCheckOpen(record.id)} >审核</Button>
                        </Space> :null}
                    </>
                )
            }
        },
    ];
    const isCheckOpen=(e:any)=>{
        setDId(e);
        // setAuditStatus(status);
        setRejectReason('');
        setDOpen(true);
        getOne(e);
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const getList=()=>{
        props.dispatch({
            type:'InventoryAudit/fetch',
            payload:{page, orderCode, warehouseName, startDate, endDate, orderStatus, pageSize}
        })
    };

    useEffect(() => {
        getList();
    }, [page,pageSize]);

    const sousuo=()=>{
        setPage(1);
        getList();
    };
    const onOK=(auditStatus:number)=>{
        if (auditStatus === 4 && !rejectReason.trim()) {
            message.warning('请填写驳回原因');
            return;
        }
        setSpinning(true);
        props.dispatch({
            type:'InventoryAudit/check',
            payload:{id:dId, status:auditStatus, rejectReason:rejectReason.trim()}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success(auditStatus === 2 ? '审核通过' : '驳回成功')
                setSpinning(false);
                setDOpen(false);
                getList();
            }else {
                message.error(res.Data);
                setSpinning(false);
                setDOpen(false);
            }
        })
    };
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/inventory','inventoryAuditStartDate','2000-01-01');
            updateSessionStorage('/warehouse/inventory','inventoryAuditEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/inventory','inventoryAuditStartDate',data[0]);
            updateSessionStorage('/warehouse/inventory','inventoryAuditEndDate',data[1]);
        }
    };
    const changeWarehouseName=(e:any)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/inventory','inventoryAuditWarehouseName',e.target.value);
    };
    const changeOrderCode=(e:any)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/inventory','inventoryAuditOrderCode',e.target.value);
    };
    const [displayData, setDisplayData] = useState([]);
    const columnsz = [
        {
            title: '物品名称',
            dataIndex: 'productsName',
            key:'productsName',
        },
        {
            title: '物品编号',
            dataIndex: 'productsCode',
            key:'productsCode',
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key:'unitsName',
        },
        {
            title:'盘点数量',
            dataIndex:'quantity',
            key:'quantity',
            ellipsis:true,
        },
        {
            title: '库存数量',
            dataIndex: 'qq',
            key: 'qq',
            ellipsis: true,
            render: (text, record) => (
                <div>{record.quantityKc2}</div>
            )
        },
        {
            title: '差异',
            dataIndex: 'diffQuantity',
            key: 'diffQuantity',
            ellipsis: true,
            render: (text, record) => {
                return record.quantity - record.quantityKc2;
            }
        }
    ];
    const getOne=async (id:string)=>{
            setSpinning(true);
            let res:any=await  InventoryRequest.one(id);
            if (res.ErrorCode==0){
                let data=res.Data;
                console.log('详情',data);
                setSpinning(false);
                setDisplayData(data.spList)
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
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
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/* <Modal title={auditStatus === 2 ? '审核通过' : '驳回盘点'} onOk={onOK} loading={spinning} open={dOpen} onCancel={()=>{setDOpen(false)}}>
                {auditStatus === 2 ? <p>确定通过该盘点申请吗？</p> : <Input.TextArea
                    value={rejectReason}
                    onChange={event => setRejectReason(event.target.value)}
                    placeholder="请填写驳回原因"
                    maxLength={8000}
                    showCount
                    rows={4}
                />}
            </Modal> */}
            <Modal
                title='审核'
                width={900}
                open={dOpen}
                confirmLoading={spinning}
                onCancel={()=>setDOpen(false)}
                footer={[
                    <Button key='pass' type='primary' onClick={()=>onOK(2)}>通过</Button>,
                    <Button key='reject' danger onClick={()=>onOK(4)}>驳回</Button>,
                    <Button key='close' onClick={()=>setDOpen(false)}>关闭</Button>,
                ]}
            >
                <Table
                    size='small'
                    pagination={false}
                    dataSource={displayData}
                    rowKey={(record:any)=>record.ppId || record.id}
                    columns={columnsz}
                />
                <Input.TextArea rows={4} placeholder='请输入审核意见或驳回原因' value={rejectReason} onChange={e=>setRejectReason(e.target.value)} style={{marginTop:16}} />
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.InventoryAudit.list,
    count: state.InventoryAudit.count,
});
export default connect(mapStateToProps)(InventoryAudit);
