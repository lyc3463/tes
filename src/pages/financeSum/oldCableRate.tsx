import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {checkSessionStorage, downloadFile, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import * as CableRateService from "@/services/cableRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const OldCableRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(10);
    // 租户名字
    const [name,setName]=useState(checkSessionStorage('/financeSum/CableRate/','oldHourCableRateName')||'');
    // 电表地址
    const [cid,setCId]=useState(checkSessionStorage('/financeSum/CableRate/','oldHourCableRateCId')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/financeSum/CableRate/','oldHourCableRateStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/financeSum/CableRate/','oldHourCableRateEndDate')||'2099-01-01');
    // 租户id
    const [tenantId,settenantId]=useState(0);
    // 电表备注
    const [remark,setremark]=useState(checkSessionStorage('/financeSum/CableRate/','oldHourCableRateRemark')||'');
    const [spinning,setspinning]=useState(false);
    const [recordStatus,setrecordStatus]=useState('扣费成功');
    const [uqx,setUqx]=useState([]);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getLogFenyeInfo(pageSize);
        logFenye(page,pageSize);
    };
    // 分页信息
    const getLogFenyeInfo=(pageSizez)=>{
        props.dispatch({
            type:'OldCableRate/fenye',
            payload:{name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize:pageSizez}
        });
    };
    // 列表
    const logFenye=(pagez,pageSizez)=>{
        props.dispatch({
            type:"OldCableRate/fetch",
            payload:{page:pagez,name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize:pageSizez}
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
        getLogFenyeInfo(pageSize);
        logFenye(e,pageSize);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
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
                        <Tag  color='warning'>{(record.energyNew).toFixed(2)}kwh</Tag>
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
                        <Tag  color='warning'>{(record.energyUsage).toFixed(2)}kwh</Tag>
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
                        <Tag color='blue'>{(record.eleMoney).toFixed(2)}元</Tag>
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
            updateSessionStorage('/financeSum/CableRate/','oldHourCableRateStartDate','2000-01-01');
            updateSessionStorage('/financeSum/CableRate/','oldHourCableRateEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/financeSum/CableRate/','oldHourCableRateStartDate',data[0]);
            updateSessionStorage('/financeSum/CableRate/','oldHourCableRateEndDate',data[1]);
        }
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/financeSum/CableRate/','oldHourCableRateName',e.target.value);
    };
    const changeCId=(e:any)=>{
        setCId(e.target.value);
        updateSessionStorage('/financeSum/CableRate/','oldHourCableRateCId',e.target.value);
    };
    const changeremark=(e:any)=>{
        setremark(e.target.value);
        updateSessionStorage('/financeSum/CableRate/','oldHourCableRateRemark',e.target.value);
    };
    const upDload=()=>{
        CableRateService.upDload({page:1,name,cid,startDate,endDate,tenantId,recordStatus,remark,pageSize:10000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                downloadFile(res.Data.ContentType,res.Data.FileContents,res.Data.FileDownloadName);
            }else {
                message.error(res.Data);
            }
        })
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
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <Button type="primary" onClick={upDload}>
                            下载
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.CableRateList}
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
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[10,50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableRateList: state.OldCableRate.list,
        count: state.OldCableRate.count,
    }
};
export default connect(mapStateToProps) (OldCableRate)
