import {Button, DatePicker, Input, List, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {history} from "@@/core/history";
import {connect} from "umi";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const PaymentDetails=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);// 当前页数
    const [orderCode,setOrderCode]=useState(checkSessionStorage('/warehouse/paymentManagement','paymentDetailsOrderCode') || '');// 单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/paymentManagement','paymentDetailsStartDate') || '2000-01-01');// 开始日期
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/paymentManagement','paymentDetailsEndDate') || '2099-01-01');// 结束日期
    const [pageSize,setPageSize]=useState(10);// 每页数量
    const [orderType,setOrderType]=useState(0);// 订单类型
    const [userName,setUserName]=useState(checkSessionStorage('/warehouse/paymentManagement','paymentDetailsUserName') || '');// 缴费用户
    const [ohType,setOhType]=useState(0);// 订单类型
    const columns = [
        {
            title: '缴费日期',
            dataIndex: 'created',
            ellipsis: true,
            align:'center',
            render: (text: any) => {
                return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '缴费单',
            dataIndex: 'orderCode',
            ellipsis: true,
            align:'center',
        },
        {
            title: '缴费单类型',
            dataIndex: 'ohType',
            ellipsis: true,
            align:'center',
            render: (text: any) => {
                return <Tag color={text==1?'green':'blue'}>{text==1?'入库订单':'出库订单'}</Tag>;
            },
        },
        {
            title: '订单类型',
            dataIndex: 'orderType',
            ellipsis: true,
            align:'center',
            render: (text, record: any) => {
                const { ohType, orderType } = record;
                // 根据 ohType 和 orderType 组合判断显示文本
                if (ohType === 1) {
                    switch (orderType) {
                        case 1: return '采购订单';
                        case 2: return '直接入库订单';
                        default: return ''; // 其他情况显示空
                    }
                } else if (ohType === 2) {
                    switch (orderType) {
                        case 1: return '申请';
                        case 2: return '退货';
                        case 3: return '报损';
                        case 4: return '调拨';
                        case 5: return '销售';
                        default: return ''; // 其他情况显示空
                    }
                }
                return ''; // ohType 非 1/2 时显示空
            }
        },
        {
            title: '缴费人',
            dataIndex: 'user_name',
            ellipsis: true,
            align:'center',
        },
        {
            title: '支付方式',
            dataIndex: 'pmName',
            ellipsis: true,
            align:'center',
        },
        {
            title: '缴费金额(元)',
            dataIndex: 'ohMoney',
            ellipsis: true,
            align:'center',
        },

    ];
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const getList=()=>{
        props.dispatch({
            type:'PaymentDetails/fetch',
            payload:{page, orderCode, warehouseName, startDate, endDate, pageSize, orderType, userName, ohType}
        })
    };
    const getFenye=()=>{
        props.dispatch({
            type:'PaymentDetails/fenye',
            payload:{orderCode, warehouseName, startDate, endDate, pageSize, orderType, userName, ohType}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    // 缴费类型
    const changeOhType=(e)=>{
        setOhType(e);
        setOrderType(0);
    };
    // 订单类型
    const changeOrderType=(e)=>{
        setOrderType(e);
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/paymentManagement','paymentDetailsStartDate','2000-01-01');
            updateSessionStorage('/warehouse/paymentManagement','paymentDetailsEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/paymentManagement','paymentDetailsStartDate',data[0]);
            updateSessionStorage('/warehouse/paymentManagement','paymentDetailsEndDate',data[1]);
        }
    };
    // 缴费人
    const changeName=(e)=>{
        setUserName(e.target.value);
        updateSessionStorage('/warehouse/paymentManagement','paymentDetailsUserName',e.target.value);
    };
    // 缴费单
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/paymentManagement','paymentDetailsOrderCode',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="缴费人:"
                            value={userName}
                            onChange={changeName}
                        />
                        <Input
                            addonBefore="缴费单:"
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
                                缴费类型:
                            </div>
                            <Select
                                style={{width: 120,}}
                                onChange={changeOhType}
                                value={ohType}
                                options={[
                                    {
                                        label: '全部',
                                        value: 0,
                                    },
                                    {
                                        label: '入库',
                                        value: 1,
                                    },
                                    {
                                        label: '出库',
                                        value: 2,
                                    },
                                ]}
                            />
                        </Space.Compact>
                        {
                            ohType==1?
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
                                        订单类型:
                                    </div>
                                    <Select
                                        style={{width: 120}}
                                        onChange={changeOrderType}
                                        value={orderType}
                                        options={[
                                            {
                                                label: '全部',
                                                value: 0,
                                            },
                                            {
                                                label: '采购订单',
                                                value: 1,
                                            },
                                            {
                                                label: '直接入库',
                                                value: 2,
                                            }
                                        ]}
                                    />
                                </Space.Compact>:''
                        }
                        {
                            ohType==2?
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
                                        订单类型:
                                    </div>
                                    <Select
                                        style={{width: 120}}
                                        onChange={changeOrderType}
                                        value={orderType}
                                        options={[
                                            {
                                                label: '全部',
                                                value: 0,
                                            },
                                            {
                                                label: '销售',
                                                value: 5,
                                            },
                                            {
                                                label: '退货',
                                                value: 2,
                                            }
                                        ]}
                                    />
                                </Space.Compact>:''
                        }
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
                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}><div style={{width:"100%",textAlign:'center'}}>{props.count?props.count.money:0}</div></Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.PaymentDetails.list,
    count: state.PaymentDetails.count,
});
export default connect(mapStateToProps)(PaymentDetails);
