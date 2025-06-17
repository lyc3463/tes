import {useEffect, useState} from "react";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import * as ArrearsBillService from "@/services/ArrearsBill";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {StaticInfo} from "@/StaticInfo";

const WyList=()=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/financeSum/wyList','name')||'');
    const [startDate,setStartDate]=useState(checkSessionStorage('/financeSum/wyList','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/financeSum/wyList','endDate')||'2099-01-01');
    const [tenandId,settenandId]=useState(0);
    const [count,setcount]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [moneySum,setmoneySum]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [weiyueListInfo,setweiyueListInfo]=useState([]);
    const [open,setOpen]=useState(false);
    const [sumweiyue,setsumweiyue]=useState(0);
    const [uqx,setUqx]=useState([]);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getAllRate();
        getAllRatefenye();
    };
    // 违约金缴费成功记录
    const getAllRate=()=>{
        setspinning(true);
        RechargeRateService.wyList({page,name,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 违约金缴费成功分页
    const getAllRatefenye=()=>{
        RechargeRateService.wyListfenye({name,startDate,endDate,tenandId,pageSize}).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
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
            title: '扣费金额',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {record.defaultAmount.toFixed(2)}元
                        <Button onClick={()=>toList(record.rentId)}><QuestionCircleOutlined/></Button>
                    </Space>
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
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/financeSum/wyList','startDate','2000-01-01');
            updateSessionStorage('/financeSum/wyList','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/financeSum/wyList','startDate',data[0]);
            updateSessionStorage('/financeSum/wyList','endDate',data[1]);
        }
    };
    const exportToExcel=()=>{
        RechargeRateService.wyList({page:1,name,startDate,endDate,tenandId,pageSize:100000}).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                let headers=['日期','姓名','扣费金额(元)','类型','状态'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })),
                    ...res.Data.map(item => [
                        (dayjs(item.created).format("YYYY-MM-DD HH:mm:ss")),
                        item.tenant_name,
                        item.defaultAmount,
                        '违约金',
                        (() => {
                            switch (item.billStatus) {
                                case 1:
                                    return '未交';
                                case 2:
                                    return '已交';
                                default:
                                    return '未知类型';
                            }
                        })()
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
    const columnsz=[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.created).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金(元)',
            dataIndex: 'rentAmount',
            key: 'rentAmount',
        },
        {
            title: '天数(天)',
            dataIndex: 'defaultNum',
            key: 'defaultNum',
        },
        {
            title: '金额(元)',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.defaultAmount.toFixed(2)}
                    </div>
                )
            }
        },
    ];
    const toList=(e)=>{
        setOpen(true);
        getweiyuejinInfo(e);
    };
    const getweiyuejinInfo=(e:number)=>{
        ArrearsBillService.weiyuejinInfoList(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setweiyueListInfo(res.Data);
                setsumweiyue(getTotalDefaultAmount(res.Data));
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/financeSum/wyList','name',e.target.value);
    };
    const getTotalDefaultAmount = (arr) => {
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((total, item) => {
            const amount = item && typeof item.defaultAmount === 'number'
                ? item.defaultAmount
                : 0;
            return total + amount;
        }, 0);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="姓名:"
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
                        {uqx[382]=='1'?
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

                            <Table.Summary.Cell
                                index={6}
                            >
                                {moneySum.toFixed(2)}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
            <Modal open={open} loading={spinning} onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)} title='违约金详情' width={1000}>
                <Table
                    columns={columnsz}
                    pagination={false}
                    dataSource={weiyueListInfo}
                    scroll={{y:'70vh'}}
                    rowKey={(columns) => columns.id}
                    size='small'
                    summary={(columns) => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0}> 统计 </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>{sumweiyue}元</Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </Modal>
        </Spin>
    )
}
export default WyList