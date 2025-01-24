import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Space, Table, Tag} from "antd";
import * as ArrearsBillService from '@/services/ArrearsBill';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {eleList} from "@/services/ArrearsBill";

const CableKoufeiList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    // 租户名字
    const [name,setName]=useState('');
    // 电表地址
    const [cid,setCId]=useState('');
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    // 租户id
    const [tenantId,settenantId]=useState(0);
    const [recordStatus,setrecordStatus]=useState('余额不足');
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 消耗度数总统计
    const [energyUsage,setenergyUsage]=useState(0);
    // 扣费金额总计
    const [moneySum,setmoneySum]=useState(0);
    // 电表备注
    const [remake,setRemake]=useState('');
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
    const sousuo=()=>{
        setPage(1);
        getzujinList();
        logFenye();
    };
    // 查看电费扣费失败记录
    const getzujinList=()=>{
        ArrearsBillService.eleList(page,name,cid,startDate,endDate,tenantId,recordStatus).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=()=>{
        ArrearsBillService.eleListFenye(name,cid,startDate,endDate,tenantId,recordStatus).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setenergyUsage(res.Data.energyUsage)
                setmoneySum(res.Data.moneySum)
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getzujinList();
        logFenye();

    }, []);
    const columns =[
        {
            title: '日期',
            dataIndex: 'recordTime',
            key: 'recordTime',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.recordTime).format('YYYY-MM-DD HH:mm:ss')}
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
            title: '类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='green'>电费</Tag>
                    </div>
                )
            }
        },
        {
            title: '度数',
            dataIndex: 'energyNew',
            key: 'energyNew',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='warning'>{record.energyNew}kwh</Tag>
                    </div>
                )
            }
        },
        {
            title: '消耗度数',
            dataIndex: 'energyUsage',
            key: 'energyUsage',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='warning'>{record.energyUsage}kwh</Tag>
                    </div>
                )
            }
        },
        {
            title: '倍率',
            dataIndex: 'rate',
            key: 'rate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='cyan'>{record.rate}倍</Tag>
                    </div>
                )
            }
        },
        {
            title: '扣费金额',
            dataIndex: 'eleMoney',
            key: 'eleMoney',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag  color='blue'>{record.eleMoney}元</Tag>
                    </div>
                )
            }
        },
    ];
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={(e)=>setName(e.target.value)}
                            addonBefore="租户姓名:"
                        />
                        <Input
                            onChange={(e)=>setCId(e.target.value)}
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
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {energyUsage}kwh
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
            {/*{props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}*/}
        </div>
    )
}
export default CableKoufeiList