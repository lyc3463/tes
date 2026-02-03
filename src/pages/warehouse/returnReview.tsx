import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect, history} from "umi";
import {getData} from "@/network/http";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage, userQx} from "@/utils/OpenTool";

const ReturnReview=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/outbound','returnReviewFormOrderCode') || '');// 单号
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/outbound','returnReviewFormWarehouseName') || '');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/outbound','returnReviewFormStartDate') || '2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/outbound','returnReviewFormEndDate') || '2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(checkSessionStorage('/warehouse/outbound','returnReviewFormOrderStatus') || 0);// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 账单状态
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [orderType,setOrderType]=useState(2);// 订单类型
    const [dOpen,setDOpen]=useState(false);// 审核弹窗是否打开
    const [dId,setDId]=useState(0);// 审核的id
    const columns = [
        {
            title: '申请时间',
            dataIndex: 'orderTime',
            ellipsis: true,
            render: (text: any) => {
                return dayjs(text).format('YYYY-MM-DD');
            },
        },
        {
            title: '所属仓库',
            dataIndex: 'warehouseName',
            ellipsis: true,
        },
        {
            title: '退货单',
            dataIndex: 'orderCode',
            ellipsis: true,
            render:(text,record)=>{
                return <Button type='link' onClick={()=>history.push(`/warehouse/infoReturnForm?id=${record.id}`)}> {text}</Button>
            }
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            ellipsis: true,
            render: (text: any) => {
                return <Tag color={text==2?'green':'red'}>{text==2?'已审核':'未审核'}</Tag>
            },
        },
        {
            title: '账单状态',
            dataIndex: 'billStatus',
            ellipsis: true,
            render: (text: any) => {
                return <Tag color={text==2?'green':'red'}>{text==2?'已交完':'未交完'}</Tag>
            },
        },
        {
            title: '申请人',
            dataIndex: 'user_name',
            ellipsis: true,
        },
        {
            title: '已付金额(元)',
            dataIndex: 'paidAmount',
            ellipsis: true,
        },
        {
            title: '总金额(元)',
            dataIndex: 'totalAmount',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space size="small">
                    {record.orderStatus==1?
                        <>
                            {userQx()[508]=='1'?<Button type="primary" onClick={()=>isCheckOpen(record.id)}>审核</Button>:''}
                        </>
                        :
                        null
                    }
                </Space>
            ),
        },
    ];
    // 删除的弹窗
    const isCheckOpen=(e:number)=>{
        setDId(e);
        setDOpen(true);
    };
    const getList=()=>{
        props.dispatch({
            type:'ReturnReview/fetch',
            payload:{page, orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'ReturnReview/fenye',
            payload:{orderCode, warehouseName, startDate, endDate, orderStatus, billStatus, pageSize, orderType}
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
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'ReturnReview/check',
            payload:dId
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setSpinning(false);
                setDOpen(false);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
                setDOpen(false);
            }
        })
    };
    // 仓库名称改变
    const changeWarehouseName=(e)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/outbound','returnReviewFormWarehouseName',e.target.value);
    };
    // 单号改变
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/outbound','returnReviewFormOrderCode',e.target.value);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/outbound','returnReviewFormStartDate','2000-01-01');
            updateSessionStorage('/warehouse/outbound','returnReviewFormEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/outbound','returnReviewFormStartDate',data[0]);
            updateSessionStorage('/warehouse/outbound','returnReviewFormEndDate',data[1]);
        }
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    const changeOrderStatus=(e)=>{
        setOrderStatus(e);
        updateSessionStorage('/warehouse/outbound','returnReviewFormOrderStatus',e);
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
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{props.count?props.count.paidAmountSum:0}</Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>{props.count?props.count.totalAmountSum:0}</Table.Summary.Cell>

                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title='审核' onOk={onOK} loading={spinning} open={dOpen} onCancel={()=>{setDOpen(false)}}>
                <p>确定审核吗？</p>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.ReturnReview.list,
    count: state.ReturnReview.count,
});

export default connect(mapStateToProps)(ReturnReview);
