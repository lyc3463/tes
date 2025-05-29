import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as ArrearsBillService from '@/services/ArrearsBill';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {alljiaofei, alljiaofeifenye} from "@/services/ArrearsBill";


const AllList=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(localStorage.getItem('billLogMonthlyBillAllListName')||'');
    const [phone,setPhone]=useState(localStorage.getItem('billLogMonthlyBillAllListPhone')||'');
    const [tenandId,settenandId]=useState(0);
    const [startDate,setStartDate]=useState(localStorage.getItem('billLogMonthlyBillAllListStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(localStorage.getItem('billLogMonthlyBillAllListEndDate')||'2099-01-01');
    const [stutes,setstutes]=useState(1);
    // 总页码
    const [count,setcount]=useState(0);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 公共缴费管理费统计
    const [moneySum,setmoneySum]=useState(0);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看租金缴费列表
    const getzujinList=()=>{
        ArrearsBillService.alljiaofei({page,name,phone,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.alljiaofeifenye({name,phone,startDate,endDate,tenandId,stutes,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
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
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '账单类型',
            dataIndex: 'billType',
            key: 'billType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        公共缴费
                    </div>
                )
            }
        },
        {
            title: '缴费名称',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: '缴费金额(元)',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '已交金额(元)',
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
            title: '缴费状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.billStatus==1?<Tag color='red'>未交</Tag>:<Tag>已交</Tag>}
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
            localStorage.setItem('billLogMonthlyBillAllListStartDate','2000-01-01');
            localStorage.setItem('billLogMonthlyBillAllListEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            localStorage.setItem('billLogMonthlyBillAllListStartDate',data[0]);
            localStorage.setItem('billLogMonthlyBillAllListEndDate',data[1]);
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
    const changePhone=(e)=>{
        setPhone(e.target.value);
        localStorage.setItem('billLogMonthlyBillAllListPhone',e.target.value);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        localStorage.setItem('billLogMonthlyBillAllListName',e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="姓名:"
                            value={name}
                        />
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
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
                            <DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>
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
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}> 统计 </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{moneySum}元</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </div>
    )
}
export default connect() (AllList)