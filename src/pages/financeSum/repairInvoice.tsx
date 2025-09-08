import {useEffect, useState} from "react";
import * as ArrearsBillService from "@/services/ArrearsBill";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const RepairInvoice=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [pageSize,setPageSize]=useState(50);
    // 租户姓名
    const [name,setName]=useState(checkSessionStorage('/financeSum/repairInvoice/','name')||'');
    // 租户id
    const [tenandId,settenandId]=useState(0);
    // 账单开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/financeSum/repairInvoice/','startDate')||'2000-01-01');
    // 账单结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/financeSum/repairInvoice/','endDate')||'2099-01-01');
    // 总页码
    const [count,setcount]=useState(0);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 报修账单统计
    const [moneySum,setmoneySum]=useState(0);
    // 报修账单已交费用统计
    const [NotBillSum,setNotBillSum]=useState(0);
    const [stutes,setstutes]=useState(2);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 报修账单
    const getzujinList=()=>{
        ArrearsBillService.repairInvoiceList({page,name,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.repairInvoiceFenye({name,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setNotBillSum(res.Data.NotBillSum);
            }else {
                message.error(res.Data);
            }
        })
    };
    const columns =[
        {
            title: '日期',
            dataIndex: 'payrentDate',
            key: 'payrentDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.payrentDate).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            key: 'user_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.user_name}>
                            {record.user_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span >{record.user_name}</span>}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '账单类型',
            dataIndex: 'billType',
            key: 'billType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        报修
                    </div>
                )
            }
        },
        {
            title: '报修物品',
            dataIndex: 'goodName',
            key: 'goodName',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.goodName}
                    </div>
                )
            }
        },
        {
            title: '账单金额(元)',
            dataIndex: 'payAmount',
            key: 'payAmount',
        },
        {
            title: '已交金额',
            dataIndex: 'stopAmount',
            key: 'stopAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.stopAmount}元
                    </div>
                )
            }
        },
        {
            title: '未交',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {(record.payAmount-record.stopAmount).toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(text:any,record:any)=>{
                let consumptionTypeText;
                switch (record.billStatus) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>未交</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>已交</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return(
                    <div>
                        {consumptionTypeText}
                    </div>
                )
            }
        },

    ];
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/financeSum/repairInvoice/','startDate','2000-01-01');
            updateSessionStorage('/financeSum/repairInvoice/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/financeSum/repairInvoice/','startDate',data[0]);
            updateSessionStorage('/financeSum/repairInvoice/','endDate',data[1]);
        }
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, []);
    useEffect(() => {
        getzujinList();
    }, [page,pageSize]);
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/financeSum/repairInvoice/','name',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
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
                dataSource={dataSource}
                scroll={{y:'60vh',x:1500}}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}> 统计 </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{moneySum}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default RepairInvoice