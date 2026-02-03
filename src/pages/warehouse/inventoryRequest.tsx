import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {userQx} from "@/utils/OpenTool";

const InventoryRequest=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState('');// 单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [startDate,setStartDate]=useState('2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState('2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(1);// 订单状态
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
            title:'提交人',
            dataIndex:'user_name',
            key:'user_name',
            ellipsis:true,
        },
        {
            title:'盘点单号',
            dataIndex:'stockCode',
            key:'stockCode',
            ellipsis:true,
            render:(text,record)=>{
                return <Button type='link' onClick={()=>{history.push(`/warehouse/noInventoryRequestDetail?id=${record.id}`)}}>{text}</Button>
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
            ellipsis:true,
            render:(text,record)=>{
                return <Space>
                    {
                        record.stockStatus==1?<>
                            {userQx()[517]=='1'?<Button type='primary' onClick={()=>{history.push(`/warehouse/editInventoryRequest?id=${record.id}`)}}>编辑</Button>:''}
                            {userQx()[518]=='1'?<Button type='primary' danger onClick={()=>isDelOpen(record.id)}>删除</Button>:''}
                        </>:''
                    }
                </Space>
            }
        },
    ];
    const isDelOpen=(e)=>{
       setDId(e);
       setDOpen(true);
    };
    const toAdd=()=>{
        history.push('/warehouse/addInventoryRequest');
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'InventoryRequest/remove',
            payload:dId
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功')
                setSpinning(false);
                setDOpen(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
                setDOpen(false);
            }
        })
    };
    const getList=()=>{
        props.dispatch({
            type:'InventoryRequest/fetch',
            payload:{page, orderCode, warehouseName, startDate, endDate, orderStatus, pageSize}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'InventoryRequest/fenye',
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
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        {userQx()[516]=='1'?<Button type="primary" onClick={toAdd}>
                            申请盘点
                        </Button>:''}
                    </Space>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={(e)=>{setWarehouseName(e.target.value)}}
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
            <Modal title='删除' onOk={onOK} loading={spinning} open={dOpen} onCancel={()=>{setDOpen(false)}}>
                <p>确定删除吗？</p>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.InventoryRequest.list,
    count: state.InventoryRequest.count,
});
export default connect(mapStateToProps)(InventoryRequest);
