import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Spin, Table, Tabs, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {
    calculateSums,
    checkSessionStorage,
    exportDataToExcel,
    fuzzySearch,
    updateSessionStorage
} from "@/utils/OpenTool";
import * as RechargeRateService from '@/services/alljiaoyi';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const NewAlljiaoyi=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','name')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','phone')||'');
    const [type,setType]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','type')||0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','endDate')||'2099-01-01');
    const [userID,setuserID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [dataSource,setdataSource]=useState([]);
    // 单元名称
    const [unitName,setunitName]=useState('');
    const [moneySum,setmoneySum]=useState(0);
    const [uqx,setUqx]=useState([]);
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
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenye();
    }, []);
    useEffect(() => {
        logFenye();
    }, [page]);
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
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px' }}>
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
                    case 9:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>月卡</Tag>;
                        break;
                    case 10:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>大额转账</Tag>;
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
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.consumptionMoney.toFixed(2)}
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
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','startDate','2000-01-01');
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','startDate',data[0]);
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','endDate',data[1]);
        }
    };
    // 导出
    const exportToExcel=()=>{
        setspinning(true);
        RechargeRateService.fetch({page:1,name,phone,type,startDate,endDate,userID,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','租户名称','手机号','类型','金额','房屋','单元'];
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
                                    return '月卡';
                                case 10:
                                    return '大额转账';
                                default:
                                    return '未知类型'; // 处理未知类型的情况
                            }
                        })(),
                        item.consumptionMoney.toFixed(2),
                        item.house_name?item.house_name:'无',
                        (() => {
                            // 提取单元名称，如果unitList为空则返回空字符串
                            return item.unitList && item.unitList.length > 0
                                ? item.unitList.map(val => val.unit_name).join(', ')
                                : '';
                        })()
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))),
                    [
                        { v: '总计', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: '', t: 's' },
                        { v: moneySum.toFixed(2), t: 'n' },
                        { v: '', t: 's' },
                    ]
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
        let b=calculateSums(a);
        setmoneySum(b.moneySum);
    };
    // 监听输入的姓名
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/qianbao/zonglan/alljiaoyi/','name',e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/qianbao/zonglan/alljiaoyi/','phone',e.target.value);
    };
    // 监听类型
    const changeType=(e)=>{
        setType(e);
        updateSessionStorage('/qianbao/zonglan/alljiaoyi/','type',e);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            // onChange={(e)=>setName(e.target.value)}
                            onChange={changeName}
                            addonBefore="姓名:"
                            value={name}
                        />
                        <Input
                            // onChange={(e)=>setPhone(e.target.value)}
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
                                    { value:1, label: '微信充值' },
                                    // { value:2, label: '租金' },
                                    // { value:3, label: '电费' },
                                    // { value:4, label: '水费' },
                                    // { value:5, label: '公共缴费' },
                                    // { value:6, label: '手动充值' },
                                    // { value:7, label: '服务费' },
                                    // { value:8, label: '违约金' },
                                    // { value:9, label: '月保' },
                                    { value:10, label: '大额转账' },
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
                        {uqx[373]=='1'?<Button type="primary" onClick={exportToExcel}>导出</Button>:''}
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
                            <Table.Summary.Cell
                                index={7}
                            >
                                {(moneySum).toFixed(2)}元
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
export default connect(mapStateToProps) (NewAlljiaoyi)