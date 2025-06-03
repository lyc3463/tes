import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import * as PaymentLogService from '@/services/paymentLog';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";

const PaymentLog=()=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 订单编号
    const [orderNum,setorderNum]=useState(checkSessionStorage('/financeSum/paymentLog/','orderNum')||'');
    // 充值开始时间
    const [startDate,setstartDate]=useState(checkSessionStorage('/financeSum/paymentLog/','startDate')||'2000-01-01');
    // 充值结束时间
    const [endDate,setendDate]=useState(checkSessionStorage('/financeSum/paymentLog/','endDate')||'2099-01-01');
    // 订单查询列表
    const [dataSource,setdataSource]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    // 支付类型
    const [type,setType]=useState(checkSessionStorage('/financeSum/paymentLog/','type')||0);
    // 支付状态
    const [stutes,setStutes]=useState(checkSessionStorage('/financeSum/paymentLog/','stutes')||-1);
    const [moneySum,setmoneySum]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 订单列表
    const getPaymentLogList=()=>{
        PaymentLogService.fetch({page,orderNum,startDate,endDate,type,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 订单列表分页信息
    const getPaymentLogListfenye=()=>{
        PaymentLogService.fenye({orderNum,startDate,endDate,type,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getPaymentLogList();
        getPaymentLogListfenye();
    }, []);
    // 监听下一页页码
    const onChange=(e,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                )
            }
        },
        {
            title: '订单编号',
            dataIndex: 'orderNum',
            key: 'orderNum',
        },
        {
            title: '充值金额(元)',
            dataIndex: 'orderAmount',
            key: 'orderAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {(record.orderAmount/100).toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '支付状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render:(text:any,record:any)=>{
                let textStutes;
                if (record.orderStatus==1){
                    textStutes=<Tag color='green'>充值成功</Tag>
                }else if (record.orderStatus==0){
                    textStutes=<Tag color='blue'>用户未支付</Tag>
                }else if (record.orderStatus==2){
                    textStutes=<Tag color='red'>充值失败</Tag>
                }else if (record.orderStatus==3){
                    textStutes=<Tag color='red'>支付错误</Tag>
                }else {
                    textStutes=<Tag color='red'>付款失败</Tag>
                }
                return(
                    <div>
                        {textStutes}
                    </div>
                )
            }
        },
        {
            title: '订单类型',
            dataIndex: 'orderType',
            key: 'orderType',
            render:(text:any,record:any)=>{
                let textStutes;
                if (record.orderType==1){
                    textStutes=<Tag color='green'>短信充值</Tag>
                }else if (record.orderType==2){
                    textStutes=<Tag color='blue'>微信充值</Tag>
                }else if (record.orderType==3){
                    textStutes=<Tag color='red'>代充值</Tag>
                }else if (record.orderType==4){
                    textStutes=<Tag color='red'>园区续费</Tag>
                }else {
                    textStutes=<Tag color='red'>未知类型</Tag>
                }
                return(
                    <div>
                        {textStutes}
                    </div>
                )
            }
        },
        {
            title: '到账人',
            dataIndex: 'user_name',
            key: 'user_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.user_name}>
                            {record.user_name}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '充值人',
            dataIndex: 'appUserPhone',
            key: 'appUserPhone',

        },
    ];
    const sousuo=()=>{
        setPage(1);
        getPaymentLogListfenye();
        getPaymentLogList();
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setstartDate('2000-01-01');
            setendDate('2099-01-01');
            updateSessionStorage('/financeSum/paymentLog/','startDate','2000-01-01');
            updateSessionStorage('/financeSum/paymentLog/','endDate','2099-01-01');
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
            updateSessionStorage('/financeSum/paymentLog/','startDate',data[0]);
            updateSessionStorage('/financeSum/paymentLog/','endDate',data[1]);
        }
    };
    useEffect(() => {
        getPaymentLogList();
    }, [page,pageSize]);
    // 监听支付状态
    const changeStute=(e)=>{
        setStutes(e);
        updateSessionStorage('/financeSum/paymentLog/','stutes',e);
    };
    // 监听支付类型
    const changeType=(e)=>{
        setType(e);
        updateSessionStorage('/financeSum/paymentLog/','type',e);
    };
    const changeOrderNum=(e)=>{
        setorderNum(e.target.value);
        updateSessionStorage('/financeSum/paymentLog/','orderNum',e.target.value);
    };
    const exportToExcel=()=>{
        setspinning(true);
        PaymentLogService.fetch({page:1,orderNum,startDate,endDate,type,stutes,pageSize:10000}).then((res:any)=>{
            if (res.ErrorCode==0){
                let headers=['日期','订单编号','充值金额','支付状态','订单类型','订单描述'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        (dayjs(item.created).format('YYYY-MM-DD HH:mm:ss')), // 提取日期部分
                        item.orderNum,
                        (item.orderAmount/100).toFixed(2),
                        (() => {
                            switch (item.orderStatus) {
                                case 1:
                                    return '充值成功';
                                case 2:
                                    return '充值失败';
                                case 3:
                                    return '支付错误';
                                case 0:
                                    return '用户未支付';
                                default:
                                    return '付款失败'; // 处理未知类型的情况
                            }
                        })(),
                        (() => {
                            switch (item.orderType) {
                                case 1:
                                    return '短信充值';
                                case 2:
                                    return '微信充值';
                                case 3:
                                    return '代充值';
                                case 4:
                                    return '园区续费';
                                default:
                                    return '未知类型'; // 处理未知类型的情况
                            }
                        })(),
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
                ];
                exportDataToExcel(ws_data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeOrderNum}
                            addonBefore="订单编号:"
                            value={orderNum}
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
                                支付状态:
                            </div>
                            <Select
                                onChange={changeStute}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:-1, label: '全部' },
                                    { value:0, label: '未支付' },
                                    { value:1, label: '充值成功' },
                                    { value:2, label: '充值失败' },
                                    { value:3, label: '支付错误' },

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
                                订单类型:
                            </div>
                            <Select
                                onChange={changeType}
                                defaultValue={type}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '短信充值' },
                                    { value:2, label: '微信充值' },
                                    { value:3, label: '代充值' },
                                    { value:4, label: '园区续费' },

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
                        <Button type="primary" onClick={exportToExcel}>
                            导出
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={(columns) => columns.id}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                scroll={{y:"60vh"}}
                pagination={false}
                size='small'
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={1}
                            >
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {(moneySum/100).toFixed(2)}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}

            />
            <Pagination total={count}showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default PaymentLog