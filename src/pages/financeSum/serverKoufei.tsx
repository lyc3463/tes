import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {sunhaoList, sunhaoListFenye} from "@/services/rechargeRate";
import {exportDataToExcel} from "@/utils/OpenTool";

const ServerKoufei=()=>{
    const [spinning,setspinning]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [tenandId,settenandId]=useState(0);
    const [count,setcount]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [moneySum,setmoneySum]=useState(0);
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
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.tenant_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span >{record.tenant_name}</span>}
                    </div>
                )
            },
        },
        {
            title: '电表地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '扣费金额',
            dataIndex: 'payAmount',
            key: 'payAmount',
        },
        {
            title: '状态',
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
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getAllRate();
        getAllRatefenye();
    };
    // 获取公共缴费记录
    const getAllRate=()=>{
        setspinning(true);
        RechargeRateService.sunhaoList({page,name,phone,startDate,endDate,tenandId}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setdataSource(res.Data);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 公共缴费记录分页
    const getAllRatefenye=()=>{
        setspinning(true);
        RechargeRateService.sunhaoListFenye({name,phone,startDate,endDate,tenandId}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number)=>{
        setPage(e);
    };
    useEffect(() => {
        getAllRate()
    }, [page]);
    useEffect(() => {
        getAllRatefenye();
    }, []);
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
    const exportToExcel=()=>{
        let headers=['日期','租户名称','电表地址','类型','扣费金额(元)','状态'];
        const ws_data = [
            headers.map(header => ({ v: header, t: 's' })), // 表头
            ...dataSource.map(item => [
                item.payrentDate.split('T')[0], // 提取日期部分
                item.tenant_name,
                item.address,
                item.consumptionType='损耗',
                item.payAmount,
                item.billStatus==1?'未交':'已交',
            ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
        ];
        exportDataToExcel(ws_data);
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
                            addonBefore="电表地址:"
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
            <Pagination total={count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>
        </Spin>
    )
}
export default ServerKoufei