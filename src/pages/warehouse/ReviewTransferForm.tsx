import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect, history} from "umi";
import {getData} from "@/network/http";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const ReviewTransferForm=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/thingStock','ReviewTransferFormOrderCode')||'');// 单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/thingStock','ReviewTransferFormWarehouseName')||'');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/thingStock','ReviewTransferFormStartDate')||'2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/thingStock','ReviewTransferFormEndDate')||'2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(0);// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 账单状态
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [orderType,setOrderType]=useState(4);// 订单类型
    const [dOpen,setDOpen]=useState(false);// 审核弹窗是否打开
    const [dId,setDId]=useState(0);// 审核的id
    const [goods,setGoods]=useState<any[]>([]);
    const [reason,setReason]=useState('');
    const [uName,setUName]=useState('');// 审核的用户名
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
            title: '调拨单',
            dataIndex: 'orderCode',
            ellipsis: true,
            align:'center',
            render:(text,record)=>{
                return <Button type='link' onClick={()=>history.push(`/warehouse/infoTransferForm?id=${record.id}`)}> {text}</Button>
            }
        },
        {
            title: '调离仓库',
            dataIndex: 'warehouseName',
            ellipsis: true,
            align:'center',
        },
        {
            title: '入库仓库',
            dataIndex: 'warehouseName2',
            ellipsis: true,
            align:'center',
        },
        {
            title: '申请人',
            dataIndex: 'user_name',
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
            title: '状态',
            dataIndex: 'orderStatus',
            ellipsis: true,
            align:'center',
            render: (text: any) => {
                const statusMap: Record<number, string[]> = {1: ['blue', '待送审'], 2: ['green', '已审核'], 5: ['orange', '已送审'], 6: ['red', '已驳回']};
                const status = statusMap[Number(text)] || ['default', '未知状态'];
                return <Tag color={status[0]}>{status[1]}</Tag>
            },
        },

        {
            title: '操作',
            align:'center',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space size="small">
                    {record.orderStatus==5?
                        <>
                           <Button type="primary" onClick={()=>{isDleOpen(record.id)}}>审核</Button>
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
            type:'ReviewTransferForm/fetch',
            payload:{page, orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType,uName}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'ReviewTransferForm/fenye',
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
    const check=(orderStatus:number)=>{
        if(orderStatus===6 && !reason.trim()){
            message.warning('请输入驳回原因');
            return;
        }
        setSpinning(true);
        props.dispatch({
            type:'ReviewTransferForm/check',
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
        updateSessionStorage('/warehouse/thingStock','ReviewTransferFormWarehouseName',e.target.value);
        setWarehouseName(e.target.value);
    };
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/thingStock','ReviewTransferFormOrderCode',e.target.value);
    }
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/thingStock','ReviewTransferFormStartDate','2000-01-01');
            updateSessionStorage('/warehouse/thingStock','ReviewTransferFormEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/thingStock','ReviewTransferFormStartDate',data[0]);
            updateSessionStorage('/warehouse/thingStock','ReviewTransferFormEndDate',data[1]);
        }
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
    list: state.ReviewTransferForm.list,
    count: state.ReviewTransferForm.count,
});

export default connect(mapStateToProps)(ReviewTransferForm);
