import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, downloadFile, updateSessionStorage} from "@/utils/OpenTool";
import * as ConsumptionLogService from "@/services/consumptionLog";
import MyTypeTag from "@/components/MyTypeTag";
import ConsumptionTypeSelect from "@/components/MyConsumptionTypeSelect";

const OldConsumptionLog=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/billLog/consumptionLog/','oldName')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/billLog/consumptionLog/','oldPhone')||'');
    // 消费类型 0全部 1充值、2租金、3电费、4水费、5公共缴费、6手动充值、7物业管理费、8违约金、9月保
    const [type,setType]=useState(checkSessionStorage('/billLog/consumptionLog/','oldType')||0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/billLog/consumptionLog/','oldStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/billLog/consumptionLog/','oldEndDate')||'2099-01-01');
    const [userID,setuserID]=useState(0);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        fenye(pageSize);
        logFenye(page,pageSize);
    };
    // 列表
    const logFenye=(pagz,pageSizez)=>{
        props.dispatch({
            type:"OldConsumptionLog/fetch",
            payload:{page:pagz,name,phone,type,startDate,endDate,userID,pageSize:pageSizez}
        })
    };
    // 分页信息
    const fenye=(pageSizez)=>{
        props.dispatch({
            type:'OldConsumptionLog/fenye',
            payload:{name,phone,type,startDate,endDate,userID,pageSize:pageSizez}
        });
    };
    // 监听页数
    const onChange=(e:number,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
        logFenye(e,pageSize);
        fenye(pageSize);
    };
    const columns =[
        {
            title: '日期',
            dataIndex: 'consumptionDate',
            key: 'consumptionDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.consumptionDate).format('YYYY-MM-DD HH:mm:ss')}
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
                        <Tooltip title={record.user_name}>
                            {record.tenant_name}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.consumptionType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>微信充值</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>租金</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>电费</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag style={{ color: '#FFC107' }}>水费</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag style={{ color: '#9C27B0' }}>公共缴费</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag style={{ color: '#E91E63' }}>手动充值</Tag>;
                        break;
                    case 7:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>服务费</Tag>;
                        break;
                    case 8:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>违约金</Tag>;
                        break;
                    case 9:
                        consumptionTypeText = <Tag style={{ color: '#795588' }}>月保</Tag>;
                        break;
                    case 10:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>大额转账</Tag>;
                        break;
                    case 11:
                        consumptionTypeText = <Tag style={{ color: '#795588' }}>报修</Tag>;
                        break;
                    case 12:
                        consumptionTypeText = <Tag style={{ color: '#795588' }}>装修押金</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '金额(元)',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(_:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionType==1||record.consumptionType==6?<span style={{color:'#58bc58'}}>+{record.consumptionMoney.toFixed(2)}</span>:<span style={{color:'red'}}>-{record.consumptionMoney.toFixed(2)}</span>}
                    </div>
                )
            }
        },
        {
            title: '原余额(元)',
            dataIndex: 'oldMoney',
            key: 'oldMoney',
            render:(_:any,record:any)=>{
                return(
                    <div>
                        {record.oldMoney.toFixed(2)}
                    </div>
                )
            }
        },
        {
            title: '余额(元)',
            dataIndex: 'newMoney',
            key: 'newMoney',
            render:(_:any,record:any)=>{
                return(
                    <div>
                        {record.newMoney.toFixed(2)}
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
            updateSessionStorage('/billLog/consumptionLog/','oldStartDate','2000-01-01');
            updateSessionStorage('/billLog/consumptionLog/','oldEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/billLog/consumptionLog/','oldStartDate',data[0]);
            updateSessionStorage('/billLog/consumptionLog/','oldEndDate',data[1]);
        }
    };
    // 监听类型
    const changeType=(e)=>{
        setType(e);
        updateSessionStorage('/billLog/consumptionLog/','oldType',e);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/billLog/consumptionLog/','oldName',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/billLog/consumptionLog/','oldPhone',e.target.value);
    };
    const upDload=()=>{
        ConsumptionLogService.upDload({page:1,name,phone,type,startDate,endDate,userID,pageSize:1000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                downloadFile(res.Data.ContentType,res.Data.FileContents,res.Data.FileDownloadName);
            }else {
                message.error(res.Data);
            }
        })
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
                                类型:
                            </div>
                            <ConsumptionTypeSelect
                                value={type}
                                onChange={changeType}
                            />
                        </Space.Compact>
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
                        <Button type="primary" onClick={upDload}>
                            下载
                        </Button>
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
                dataSource={props.RechargeRateList}
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
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.moneySum.toFixed(2):''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.OldConsumptionLog.list,
        count: state.OldConsumptionLog.count,
    }
};
export default connect(mapStateToProps) (OldConsumptionLog)
