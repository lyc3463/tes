import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {exportDataToExcel} from "@/utils/OpenTool";
import * as DayCableRateService from "@/services/dayCableRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const CableRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [energyUsage,setenergyUsage]=useState(0);
    const [dataSource,setdataSource]=useState([]);
    const [moneySum,setmoneySum]=useState(0);
    const [count,setcount]=useState(0);
    const [pageSize,setPageSize]=useState(50);
    // 租户名字
    const [name,setName]=useState(localStorage.getItem('daycableRateName')||'');
    // 电表地址
    const [cid,setCId]=useState(localStorage.getItem('daycableRateCId')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(localStorage.getItem('dayfinanceSumCableRateStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(localStorage.getItem('dayfinanceSumCableRateEndDate')||'2099-01-01');
    // 租户id
    const [tenantId,settenantId]=useState(0);
    // 电表备注
    const [remark,setremark]=useState(localStorage.getItem('daycableRateRemark')||'');
    const [spinning,setspinning]=useState(false);
    const [uqx,setUqx]=useState([]);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getLogFenyeInfo();
        logFenye();
    };
    // 分页信息
    const getLogFenyeInfo=()=>{
        DayCableRateService.fenye({name,cid,startDate,endDate,tenantId,remark,pageSize}).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setspinning(false);
                console.log('天收费详情',res);
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 列表
    const logFenye=()=>{
        DayCableRateService.fetch({page,name,cid,startDate,endDate,tenantId,remark,pageSize}).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setdataSource(res.Data);
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
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getLogFenyeInfo();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const columns =[
        {
            title: '日期',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.beginTime).format('YYYY-MM-DD')}
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
            title: '电表描述',
            dataIndex: 'remark',
            key: 'remark',
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
            title: '新度数',
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
        // {
        //     title: '旧度数',
        //     dataIndex: 'energyOld',
        //     key: 'energyOld',
        //     render:(text:any,record:any)=>{
        //         return(
        //             <div>
        //                 <Tag  color='warning'>{record.energyOld}kwh</Tag>
        //             </div>
        //         )
        //     }
        // },
        {
            title: '扣费金额',
            dataIndex: 'eleMoney',
            key: 'eleMoney',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tag color='blue'>{record.eleMoney}元</Tag>
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
            localStorage.setItem('dayfinanceSumCableRateStartDate','2000-01-01');
            localStorage.setItem('dayfinanceSumCableRateEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            localStorage.setItem('dayfinanceSumCableRateStartDate',data[0]);
            localStorage.setItem('dayfinanceSumCableRateEndDate',data[1]);
        }
    };
    const exportToExcel=()=>{
        setspinning(true);
        DayCableRateService.fetch({page:1,name,cid,startDate,endDate,tenantId,remark,pageSize:1000000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','租户名称','电表地址','电表描述','类型','度数kwh','扣费金额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        (dayjs(item.beginTime).format('YYYY-MM-DD')), // 提取日期部分
                        item.tenant_name,
                        item.address,
                        item.remark,
                        item.consumptionType='电费',
                        item.energyNew,
                        item.eleMoney,
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' })))
                ];
                exportDataToExcel(ws_data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
        localStorage.setItem('daycableRateName',e.target.value);
    };
    const changeCId=(e:any)=>{
        setCId(e.target.value);
        localStorage.setItem('daycableRateCId',e.target.value);
    };
    const changeremark=(e:any)=>{
        setremark(e.target.value);
        localStorage.setItem('daycableRateRemark',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            // onChange={(e)=>setName(e.target.value)}
                            addonBefore="租户姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            // onChange={(e)=>setCId(e.target.value)}
                            addonBefore="电表地址:"
                            onChange={changeCId}
                            value={cid}
                        />
                        <Input
                            // onChange={(e)=>setremark(e.target.value)}
                            addonBefore="电表备注:"
                            onChange={changeremark}
                            value={remark}
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
                        {uqx[386]=='1'?   <Button type="primary" onClick={exportToExcel}>
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
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>

                            <Table.Summary.Cell index={5}>
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

export default connect() (CableRate)