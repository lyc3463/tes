import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {Button, DatePicker, Input, List, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";

const InventoryEntry=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/inventory','inventoryEntryOrderCode') || '');// 单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/inventory','inventoryEntryWarehouseName') || '');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/inventory','inventoryEntryStartDate') || '2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/inventory','inventoryEntryEndDate') || '2099-01-01');// 结束日期
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
            title:'盘点单号',
            dataIndex:'stockCode',
            key:'stockCode',
            ellipsis:true,
            render:(text,record)=>{
                return <Button type='link' onClick={()=>{history.push(`/warehouse/inventoryRequestDetail?id=${record.id}&stockStutes=${2}`)}}>{text}</Button>
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
                        {record.stockStatus==1? <Button onClick={()=>isCheckOpen(record.id)} type='primary'>盘点数据</Button>:null}
                    </>
                )
            }
        },
    ];
    const isCheckOpen=(e:any)=>{
        history.push(`/warehouse/editInventoryCheck?id=${e}`)
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const getList=()=>{
        props.dispatch({
            type:'InventoryEntry/fetch',
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
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/inventory','inventoryEntryStartDate','2000-01-01');
            updateSessionStorage('/warehouse/inventory','inventoryEntryEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/inventory','inventoryEntryStartDate',data[0]);
            updateSessionStorage('/warehouse/inventory','inventoryEntryEndDate',data[1]);
        }
    };
    const changeWarehouseName=(e:any)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/inventory','inventoryEntryWarehouseName',e.target.value);
    };
    const changeOrderCode=(e:any)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/inventory','inventoryEntryOrderCode',e.target.value);
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.InventoryEntry.list,
    count: state.InventoryEntry.count,
});
export default connect(mapStateToProps)(InventoryEntry);
