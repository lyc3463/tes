import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {userQx} from "@/utils/OpenTool";

const InventoryAudit=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState('');// 单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [startDate,setStartDate]=useState('2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState('2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(0);// 订单状态
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [dOpen,setDOpen]=useState(false);// 删除弹窗是否打开
    const [dId,setDId]=useState(0);// 删除的id
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
                return <Button type='link' onClick={()=>{history.push(`/warehouse/inventoryRequestDetail?id=${record.id}`)}}>{text}</Button>
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
                return <Tag color={text==2?'green':'red'}>{text==2?'已审核':'未审核'}</Tag>
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
                        {record.stockStatus==1?
                            userQx()[524]=='1'?
                            <Button onClick={()=>isCheckOpen(record.id)} type='primary'>审核</Button>:''
                            :null}
                    </>
                )
            }
        },
    ];
    const isCheckOpen=(e:any)=>{
        setDId(e);
        setDOpen(true);
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
    const getFenye=()=>{
        props.dispatch({
            type:'InventoryAudit/fenye',
            payload:{orderCode, warehouseName, startDate, endDate, orderStatus, pageSize}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'InventoryAudit/check',
            payload:dId
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功')
                setSpinning(false);
                setDOpen(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
                setDOpen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={(e)=>{setWarehouseName(e.target.value)}}
                        />
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={(e)=>{setOrderCode(e.target.value)}}
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
            <Modal title='审核' onOk={onOK} loading={spinning} open={dOpen} onCancel={()=>{setDOpen(false)}}>
                <p>确定审核吗？</p>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.InventoryAudit.list,
    count: state.InventoryAudit.count,
});
export default connect(mapStateToProps)(InventoryAudit);
