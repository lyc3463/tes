import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tabs, Tag} from "antd";
import {connect, history} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const OutboundDetail=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState('');// 采购单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [supplierName,setSupplierName]=useState('');// 供应商
    const [startDate,setStartDate]=useState('2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState('2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(1);// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 是否交完钱状态
    const [orderType,setOrderType]=useState(1);// 订单类型
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [dUid,setDUid]=useState(0);// 删除的ID
    const [dOpne,setDOpen]=useState(false);// 删除确认弹窗
    const columns=[
        {
            title:'出库日期',
            dataIndex:'orderTime',
            key:'orderTime',
            align:'center',
            render:(text)=>{
                return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
            }
        },
        {
            title:'物品图片',
            dataIndex:'itemImage',
            key:'itemImage',
            align:'center',
        },
        {
            title:'物品名称',
            dataIndex:'itemName',
            key:'itemName',
            align:'center',
        },
        {
            title:'物品编码',
            dataIndex:'itemCode',
            key:'itemCode',
            align:'center',
        },
        {
            title:'采购单号',
            dataIndex:'orderCode',
            key:'orderCode',
            align:'center',
        },
        {
            title:'出库仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            ellipsis:true,
        },
        {
            title:'数量',
            dataIndex:'quantity',
            key:'quantity',
            align:'center',
        },
        {
            title:'物品单价',
            dataIndex:'unitPrice',
            key:'unitPrice',
            align:'center',
        },
        {
            title:'物品总价',
            dataIndex:'totalAmount',
            key:'totalAmount',
            align:'center',
        },
    ];
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'Application/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'Application/fenye',
            payload:{pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                        />
                        <Input
                            addonBefore="单号:"
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
                        <Button type="primary" >
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
    // list: state.Application.list,
    // count: state.Application.count,
});
export default connect(mapStateToProps)(OutboundDetail);
