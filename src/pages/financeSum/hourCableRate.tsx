import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {exportDataToExcel} from "@/utils/OpenTool";
import * as CableRateService from "@/services/cableRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const CableRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 租户名字
    const [name,setName]=useState(localStorage.getItem('cableRateName')||'');
    // 电表地址
    const [cid,setCId]=useState(localStorage.getItem('cableRateCId')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(localStorage.getItem('financeSumCableRateStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(localStorage.getItem('financeSumCableRateEndDate')||'2099-01-01');
    // 租户id
    const [tenantId,settenantId]=useState(0);
    // 电表备注
    const [remark,setremark]=useState(localStorage.getItem('cableRateRemark')||'');
    const [spinning,setspinning]=useState(false);
    const [recordStatus,setrecordStatus]=useState('扣费成功');
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getLogFenyeInfo();
        logFenye();
    };
    // 分页信息
    const getLogFenyeInfo=()=>{
        props.dispatch({
            type:'CableRate/fenye',
            payload:{name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize}
        });
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"CableRate/fetch",
            payload:{page,name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize}
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
            localStorage.setItem('financeSumCableRateStartDate','2000-01-01');
            localStorage.setItem('financeSumCableRateEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            localStorage.setItem('financeSumCableRateStartDate',data[0]);
            localStorage.setItem('financeSumCableRateEndDate',data[1]);
        }
    };
    const exportToExcel=()=>{
        setspinning(true);
        CableRateService.fetch({page:1,name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize:1000000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','租户名称','电表地址','电表描述','类型','度数kwh','消耗度数kwh','倍率','扣费金额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.recordTime.split('T')[0], // 提取日期部分
                        item.tenant_name,
                        item.address,
                        item.remark,
                        item.consumptionType='电费',
                        item.energyNew,
                        item.energyUsage,
                        item.rate,
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
        localStorage.setItem('cableRateName',e.target.value);
    };
    const changeCId=(e:any)=>{
        setCId(e.target.value);
        localStorage.setItem('cableRateCId',e.target.value);
    };
    const changeremark=(e:any)=>{
        setremark(e.target.value);
        localStorage.setItem('cableRateRemark',e.target.value);
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
                dataSource={props.CableRateList}
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
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {props.count?props.count.energyUsage:''}kwh
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.moneySum:''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableRateList: state.CableRate.list,
        count: state.CableRate.count,
    }
};
export default connect(mapStateToProps) (CableRate)