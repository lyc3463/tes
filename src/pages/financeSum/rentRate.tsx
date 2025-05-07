import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as RechargeRateService from '@/services/rechargeRate';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {alljiaofeifenye} from "@/services/ArrearsBill";
import {zujinList} from "@/services/rechargeRate";
import {exportDataToExcel} from "@/utils/OpenTool";

const RentRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [tenandId,settenandId]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    // 总页码
    const [count,setcount]=useState(0);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租金管理费统计
    const [moneySum,setmoneySum]=useState(0);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看租金缴费列表
    const getzujinList=()=>{
        setspinning(true);
        RechargeRateService.zujinList({page,name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        RechargeRateService.zujinListFenye({name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        })
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
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const columns =[
        {
            title: '交租日期',
            dataIndex: 'payrentDate',
            key: 'payrentDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.payrentDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '租金周期',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.billBeginDate).format("YYYY-MM-DD")}至{dayjs(record.billEndDate).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '租金/管理费',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag color='green'>{record.payAmount}元</Tag>
                    </div>
                )
            }
        },
        {
            title: '优惠金额',
            dataIndex: 'preRen',
            key: 'preRen',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag color='green'>{record.preRen}元</Tag>
                    </div>
                )
            }
        },
        {
            title: '优惠前租金',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.preRen+record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '违约金',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag color='red'>{record.defaultAmount}元</Tag>
                    </div>
                )
            }
        },
        {
            title: '缴费状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.billStatus==1?<Tag color='red'>未交</Tag>:<Tag color='green'>已交</Tag>}
                    </div>
                )
            }
        },
    ];
    const exportToExcel=()=>{
        setspinning(true);
        RechargeRateService.zujinList({page:1,name,phone,startDate,endDate,tenandId,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','租户名称','手机号','类型','租金/管理费(元)','优惠金额','优惠前租金','违约金(元)','状态'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.payrentDate.split('T')[0], // 提取日期部分
                        item.tenant_name,
                        item.tenant_phone,
                        item.consumptionType='租金',
                        item.payAmount,
                        item.preRen,
                        item.preRen+item.payAmount,
                        item.defaultAmount,
                        item.billStatus==1?'未交':'已交',
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
                            onChange={(e)=>setName(e.target.value)}
                            addonBefore="姓名:"
                        />
                        <Input
                            onChange={(e)=>setPhone(e.target.value)}
                            addonBefore="手机号:"
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
                            <DatePicker.RangePicker onChange={changeDate}/>
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
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={dataSource}
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
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
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {moneySum}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}

export default connect() (RentRate)