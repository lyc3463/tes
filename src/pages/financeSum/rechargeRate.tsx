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
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const RechargeRate=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [name,setName]=useState(checkSessionStorage('/financeSum/rechargeRate/','name')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/financeSum/rechargeRate/','phone')||'');
    const [type,setType]=useState(1);
    const [startDate,setStartDate]=useState(checkSessionStorage('/financeSum/rechargeRate/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/financeSum/rechargeRate/','endDate')||'2099-01-01');
    const [userID,setuserID]=useState(0);
    const [pageSize,setpageSize]=useState(50);
    const [uqx,setUqx]=useState([]);

    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye();
        getFenyeInfo();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"RechargeRate/fetch",
            payload:{page,name,phone,type,startDate,endDate,userID,pageSize}
        })
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'RechargeRate/fenye',
            payload:{name,phone,type,startDate,endDate,userID,pageSize}
        });
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setpageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenyeInfo();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
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
                            {record.user_name==null?<span style={{color:'red'}} >未绑定租户</span>:<span >{record.user_name}</span>}
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
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>损耗</Tag>;
                        break;
                    case 8:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>违约金</Tag>;
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
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney.toFixed(2)}
                    </div>
                )
            }
        },
        {
            title: '原余额(元)',
            dataIndex: 'oldMoney',
            key: 'oldMoney',
            render:(text:any,record:any)=>{
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
            render:(text:any,record:any)=>{
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
            updateSessionStorage('/financeSum/rechargeRate/','startDate','2000-01-01');
            updateSessionStorage('/financeSum/rechargeRate/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/financeSum/rechargeRate/','startDate',data[0]);
            updateSessionStorage('/financeSum/rechargeRate/','endDate',data[1]);
        }
    };
    const exportToExcel=()=>{
        RechargeRateService.fetch({page:1,name,phone,type,startDate,endDate,userID,pageSize:100000}).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                let headers=['日期','租户名称','手机号','类型','金额(元)','原余额(元)','余额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })),
                    ...res.Data.map(item => [
                        item.consumptionDate.split('T')[0],
                        item.user_name,
                        item.phone,
                        (() => {
                            switch (item.consumptionType) {
                                case 1:
                                    return '微信充值';
                                case 2:
                                    return '租金';
                                case 3:
                                    return '电费';
                                case 4:
                                    return '水费';
                                case 5:
                                    return '公共缴费';
                                case 6:
                                    return '手动充值';
                                case 7:
                                    return '损耗';
                                case 8:
                                    return '违约金';
                                default:
                                    return '未知类型'; // 处理未知类型的情况
                            }
                        })(),
                        item.consumptionMoney,
                        item.oldMoney,
                        item.newMoney,
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
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/financeSum/rechargeRate/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/financeSum/rechargeRate/','phone',e.target.value);
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
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        {uqx[394]=='1'?
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
                dataSource={props.RechargeRateList}
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
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.moneySum.toFixed(2):''}元
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
        RechargeRateList: state.RechargeRate.list,
        count: state.RechargeRate.count,
    }
};
export default connect(mapStateToProps) (RechargeRate)