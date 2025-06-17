import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import {StaticInfo} from "@/StaticInfo";

const ServerKoufei=()=>{
    const [spinning,setspinning]=useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/financeSum/serverKoufei/','name')||'');
    const [phone,setCid]=useState(checkSessionStorage('/financeSum/serverKoufei/','cid')||'');
    const [startDate,setStartDate]=useState(checkSessionStorage('/financeSum/serverKoufei/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/financeSum/serverKoufei/','endDate')||'2099-01-01');
    const [tenandId,settenandId]=useState(0);
    const [count,setcount]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [moneySum,setmoneySum]=useState(0);
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '交租日期',
            dataIndex: 'payrentDate',
            key: 'payrentDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.payrentDate).format('YYYY-MM-DD HH:mm:ss')}
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
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            {record.tenant_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span >{record.tenant_name}</span>}
                        </Tooltip>
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
            title: '扣费金额(元)',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.payAmount.toFixed(2)}
                    </div>
                )
            }
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
        RechargeRateService.sunhaoList({page,name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
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
        RechargeRateService.sunhaoListFenye({name,phone,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
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
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getAllRate()
    }, [page,pageSize]);
    useEffect(() => {
        getAllRatefenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/financeSum/serverKoufei/','startDate','2000-01-01');
            updateSessionStorage('/financeSum/serverKoufei/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/financeSum/serverKoufei/','startDate',data[0]);
            updateSessionStorage('/financeSum/serverKoufei/','endDate',data[1]);
        }
    };
    const exportToExcel=()=>{
        setspinning(true);
        RechargeRateService.sunhaoList({page:1,name,phone,startDate,endDate,tenandId,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                let headers=['日期','租户名称','电表地址','类型','扣费金额(元)','状态'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.payrentDate.split('T')[0], // 提取日期部分
                        item.tenant_name,
                        item.address,
                        item.consumptionType='损耗',
                        item.payAmount,
                        item.billStatus==1?'未交':'已交',
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
                ];
                exportDataToExcel(ws_data);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const changeName=(e:any)=>{
        setName(e.target.value);
        updateSessionStorage('/financeSum/serverKoufei/','name',e.target.value);
    };
    const changeCid=(e:any)=>{
        setCid(e.target.value);
        updateSessionStorage('/financeSum/serverKoufei/','cid',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            // onChange={(e)=>setName(e.target.value)}
                            addonBefore="姓名:"
                            value={name}
                            onChange={changeName}
                        />
                        <Input
                            // onChange={(e)=>setCid(e.target.value)}
                            addonBefore="电表地址:"
                            value={phone}
                            onChange={changeCid}
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
                        {uqx[393]=='1'?
                            <Button type="primary" onClick={exportToExcel}>
                                导出
                            </Button>:''}
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
                                {moneySum.toFixed(2)}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default ServerKoufei