import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {calculateSums, exportDataToExcel, fuzzySearch} from "@/utils/OpenTool";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const Alljiaoyi=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [type,setType]=useState(1);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [userID,setuserID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [dataSource,setdataSource]=useState([]);
    // 单元名称
    const [unitName,setunitName]=useState('');
    const [moneySum,setmoneySum]=useState(0);
    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye();
        getFenye();
    };
    const getFenye=()=>{
        props.dispatch({
            type:'Alljiaoyi/fenye',
            payload:{name,phone,type,startDate,endDate,userID,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Alljiaoyi/fetch",
            payload:{page,name,phone,type,startDate,endDate,userID,pageSize}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setdataSource(res.Data);
            }else {
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
        logFenye();
    }, [page]);
    useEffect(() => {
        getFenye();
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
            title: '房屋',
            dataIndex: 'house_name',
            key: 'house_name',
        },
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'user_name',
            key: 'user_name',
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
        },
    ];
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
        setspinning(true);
        RechargeRateService.fetch({page:1,name,phone,type,startDate,endDate,userID,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','租户名称','手机号','类型','金额'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        (dayjs(item.consumptionDate).format("YYYY-MM-DD HH:mm:ss")),
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
                                    return '服务费';
                                case 8:
                                    return '违约金';
                                case 9:
                                    return '月保';
                                default:
                                    return '未知类型'; // 处理未知类型的情况
                            }
                        })(),
                        item.payAmount,
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
    const chaxundanyuan=()=>{
        let a=fuzzySearch(props.RechargeRateList,unitName);
        setdataSource(a);
        console.log('a',a);
        let b=calculateSums(a);
        console.log('b',b);
        setmoneySum(b.moneySum);
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
                            addonBefore="手机号:"
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
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="单元名称:"
                            onChange={(e)=>setunitName(e.target.value)}
                        />
                        <Button type="primary" onClick={chaxundanyuan}>
                            查询单元
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
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
};
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.Alljiaoyi.list,
        count: state.Alljiaoyi.count,
    }
};
export default connect(mapStateToProps) (Alljiaoyi)