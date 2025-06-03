import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, Pagination, Select, Space, Table, Tag, Tooltip} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const ConsumptionLog=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/billLog/consumptionLog/','name')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/billLog/consumptionLog/','phone')||'');
    // 消费类型 0全部 1充值、2租金、3电费、4水费、5公共缴费、6手动充值、7物业管理费、8违约金、9月保
    const [type,setType]=useState(checkSessionStorage('/billLog/consumptionLog/','type')||0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/billLog/consumptionLog/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/billLog/consumptionLog/','endDate')||'2099-01-01');
    const [userID,setuserID]=useState(0);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        fenye();
        logFenye();
    };
    // 列表
    const logFenye=()=>{
        props.dispatch({
            type:"ConsumptionLog/fetch",
            payload:{page,name,phone,type,startDate,endDate,userID,pageSize}
        })
    };
    // 分页信息
    const fenye=()=>{
        props.dispatch({
            type:'ConsumptionLog/fenye',
            payload:{name,phone,type,startDate,endDate,userID,pageSize}
        });
    };
    // 监听页数
    const onChange=(e:number,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        fenye();
    }, []);
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
            dataIndex: 'user_name',
            key: 'user_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.user_name}>
                            {record.user_name}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
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
                        {record.consumptionType==1||record.consumptionType==6?<span style={{color:'#58bc58'}}>+{record.consumptionMoney}</span>:<span style={{color:'red'}}>-{record.consumptionMoney}</span>}
                    </div>
                )
            }
        },
        {
            title: '原余额(元)',
            dataIndex: 'oldMoney',
            key: 'oldMoney',
        },
        {
            title: '余额(元)',
            dataIndex: 'newMoney',
            key: 'newMoney',
        },
    ];
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/billLog/consumptionLog/','startDate','2000-01-01');
            updateSessionStorage('/billLog/consumptionLog/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/billLog/consumptionLog/','startDate',data[0]);
            updateSessionStorage('/billLog/consumptionLog/','endDate',data[1]);
        }
    };
    // 监听类型
    const changeType=(e)=>{
        setType(e);
        updateSessionStorage('/billLog/consumptionLog/','type',e);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/billLog/consumptionLog/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/billLog/consumptionLog/','phone',e.target.value);
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
                            <Select
                                onChange={changeType}
                                defaultValue={type}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    // { value:1, label: '微信充值' },
                                    { value:2, label: '租金' },
                                    { value:3, label: '电费' },
                                    { value:4, label: '水费' },
                                    { value:5, label: '公共缴费' },
                                    // { value:6, label: '手动充值' },
                                    { value:7, label: '损耗' },
                                    { value:8, label: '违约金' },
                                    { value:9, label: '月保' },
                                ]}
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
                                {props.count?props.count.moneySum:''}元
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
        RechargeRateList: state.ConsumptionLog.list,
        count: state.ConsumptionLog.count,
    }
};
export default connect(mapStateToProps) (ConsumptionLog)