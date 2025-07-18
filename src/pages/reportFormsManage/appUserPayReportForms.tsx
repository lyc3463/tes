import {connect} from "umi";
import {useState,useEffect} from "react";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space, Spin,
    Table,
    Tag, Tooltip
} from "antd";
import dayjs from "dayjs";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import * as WaterRateService from "@/services/payReportForms";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const AppUserPayReportForms=(props)=>{
    const[page,setPage]=useState(1);
    const[pageSize,setPageSize]=useState(50);
    const [spinning,setspinning]=useState(false);
    const [phone,setPhone]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','appphone')||'');
    const [name,setName]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','appname')||'');
    const [startDate,setStartDate]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','appstartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','appendDate')||'2099-01-01');
    const [consumptionMoney,setconsumptionMoney]=useState(0);
    const [consumptionMoney2,setconsumptionMoney2]=useState(0);
    const [consumptionMoney3,setconsumptionMoney3]=useState(0);
    const [consumptionMoney4,setconsumptionMoney4]=useState(0);
    const [consumptionMoney5,setconsumptionMoney5]=useState(0);
    const [consumptionMoney6,setconsumptionMoney6]=useState(0);
    const [consumptionMoney7,setconsumptionMoney7]=useState(0);
    const [consumptionMoney8,setconsumptionMoney8]=useState(0);
    const [consumptionMoney9,setconsumptionMoney9]=useState(0);
    const [beginMoney,setbeginMoney]=useState(0);
    const [endMoney,setendMoney]=useState(0);
    const columns =[
        {
            title: '房屋',
            dataIndex: 'house_name',
            key: 'house_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.house_name}>
                            {record.house_name}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '单元',
            dataIndex: 'house_name',
            key: 'house_name',
            render: (text:any, record:any) => {
                if (!record.unitList) {
                    return '';
                }else {
                    const limitedUnitList = record.unitList.slice(0, 2);
                    return(
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px' }}>
                            {limitedUnitList.map((item, index) => (
                                <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                            ))}
                            {record.unitList.length > 2 && <span>...</span>}
                        </div>
                    )
                }
            }
        },
        {
            title: '用户名',
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
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '充值(元)',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        <Tooltip title={`微信充值:${record.consumptionMoney}元,手动充值:${record.consumptionMoney6}元`}>
                            {(record.consumptionMoney+record.consumptionMoney6).toFixed(2)}元
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '租金/管理费(元)',
            dataIndex: 'consumptionMoney2',
            key: 'consumptionMoney2',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney2.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '电费(元)',
            dataIndex: 'consumptionMoney3',
            key: 'consumptionMoney3',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney3.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '水费(元)',
            dataIndex: 'consumptionMoney4',
            key: 'consumptionMoney4',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney4.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '服务费(元)',
            dataIndex: 'consumptionMoney7',
            key: 'consumptionMoney7',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney7.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '公共缴费(元)',
            dataIndex: 'consumptionMoney5',
            key: 'consumptionMoney5',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney5.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '违约金(元)',
            dataIndex: 'consumptionMoney8',
            key: 'consumptionMoney8',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney8.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '月保(元)',
            dataIndex: 'consumptionMoney9',
            key: 'consumptionMoney9',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.consumptionMoney9.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '开始数据',
            children: [
                {
                    title: '开始时间',
                    dataIndex: 'beginTime',
                    key: 'beginTime',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {dayjs(record.beginDate).format('YYYY-MM-DD')}
                            </div>
                        )
                    },
                },
                {
                    title: '金额(元)',
                    dataIndex: 'beginMoney',
                    key: 'beginMoney',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {record.beginMoney.toFixed(2)}
                            </div>
                        )
                    },
                },
            ]
        },
        {
            title: '结束数据',
            children: [
                {
                    title: '结束时间',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {dayjs(record.endDate).format('YYYY-MM-DD')}
                            </div>
                        )
                    },
                },
                {
                    title: '金额(元)',
                    dataIndex: 'endMoney',
                    key: 'endMoney',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {record.endMoney.toFixed(2)}
                            </div>
                        )
                    },
                },
            ]
        },
    ];
    // 分页
    const logFenye=()=>{
        setspinning(true);
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        props.dispatch({
            type:"AppUserPayReportForms/fetch",
            payload:{name,phone,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),page,pageSize},
            callback:(data,res)=>{
                if (data==0){
                    setspinning(false);
                }else {
                    setspinning(false);
                }
            }
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                const sum=calculateSums(res.Data);
                setconsumptionMoney(sum.consumptionMoney);
                setconsumptionMoney2(sum.consumptionMoney2);
                setconsumptionMoney3(sum.consumptionMoney3);
                setconsumptionMoney4(sum.consumptionMoney4);
                setconsumptionMoney5(sum.consumptionMoney5);
                setconsumptionMoney6(sum.consumptionMoney6);
                setconsumptionMoney7(sum.consumptionMoney7);
                setconsumptionMoney8(sum.consumptionMoney8);
                setconsumptionMoney9(sum.consumptionMoney9);
                setbeginMoney(sum.beginMoney);
                setendMoney(sum.endMoney);
            }else {
                message.error(res.Data);
            }
        })
    };
    const calculateSums=(sumDate)=>{
        // 初始化四个求和变量
        let consumptionMoney = 0;
        let consumptionMoney2 = 0;
        let consumptionMoney3 = 0;
        let consumptionMoney4 = 0;
        let consumptionMoney5 = 0;
        let consumptionMoney6 = 0;
        let consumptionMoney7 = 0;
        let consumptionMoney8 = 0;
        let consumptionMoney9 = 0;
        let beginMoney = 0;
        let endMoney = 0;
        // 遍历数组，累加每个属性的值
        sumDate.map(transaction => {
            consumptionMoney += transaction.consumptionMoney|| 0; // 使用||0确保未定义或null值不会破坏计算
            consumptionMoney2 += transaction.consumptionMoney2 || 0;
            consumptionMoney3 += transaction.consumptionMoney3 || 0;
            consumptionMoney4 += transaction.consumptionMoney4 || 0;
            consumptionMoney5 += transaction.consumptionMoney5 || 0;
            consumptionMoney7 += transaction.consumptionMoney7 || 0;
            consumptionMoney8 += transaction.consumptionMoney8 || 0;
            consumptionMoney9 += transaction.consumptionMoney9 || 0;
            consumptionMoney6 += transaction.consumptionMoney6 || 0;
            beginMoney += transaction.beginMoney || 0;
            endMoney += transaction.endMoney || 0;
        });
        // 返回一个对象，包含四个求和结果
        return {
            consumptionMoney: consumptionMoney.toFixed(2)*1,
            consumptionMoney2: consumptionMoney2.toFixed(2)*1,
            consumptionMoney3: consumptionMoney3.toFixed(2)*1,
            consumptionMoney4: consumptionMoney4.toFixed(2)*1,
            consumptionMoney5: consumptionMoney5.toFixed(2)*1,
            consumptionMoney6: consumptionMoney6.toFixed(2)*1,
            consumptionMoney7: consumptionMoney7.toFixed(2)*1,
            consumptionMoney8: consumptionMoney8.toFixed(2)*1,
            consumptionMoney9: consumptionMoney9.toFixed(2)*1,
            beginMoney: beginMoney.toFixed(2)*1,
            endMoney: endMoney.toFixed(2)*1,
        };
    };

    const sousuo=()=>{
        logFenye();
    };
    // useEffect(() => {
    //     logFenye();
    // }, [page,pageSize]);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/reportFormsManage/payReportForms/','appstartDate','2000-01-01');
            updateSessionStorage('/reportFormsManage/payReportForms/','appendDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/reportFormsManage/payReportForms/','appstartDate',data[0]);
            updateSessionStorage('/reportFormsManage/payReportForms/','appendDate',data[1]);
        }
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/reportFormsManage/payReportForms/','appname',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/reportFormsManage/payReportForms/','appphone',e.target.value);
    };
    const exportToExcel=()=>{
        setspinning(true);
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        WaterRateService.fetch1598({name,phone,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),page:1,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['房屋','单元','用户名','手机号','手动充值(元)','微信充值(元)','租金/管理费(元)','电费(元)','水费(元)','服务费(元)','公共缴费(元)','违约金(元)','月保(元)','开始时间','开始时间余额(元)','结束时间','结束时间余额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.house_name?item.house_name:'',
                        (() => {
                            // 提取单元名称，如果unitList为空则返回空字符串
                            return item.unitList && item.unitList.length > 0
                                ? item.unitList.map(val => val.unit_name).join(', ')
                                : '';
                        })(),
                        item.tenant_name,
                        item.tenant_phone,
                        item.consumptionMoney6.toFixed(2),
                        item.consumptionMoney.toFixed(2),
                        item.consumptionMoney2.toFixed(2),
                        item.consumptionMoney3.toFixed(2),
                        item.consumptionMoney4.toFixed(2),
                        item.consumptionMoney7.toFixed(2),
                        item.consumptionMoney5.toFixed(2),
                        item.consumptionMoney8.toFixed(2),
                        item.consumptionMoney9.toFixed(2),
                        (dayjs(item.beginDate).format('YYYY-MM-DD')),
                        item.beginMoney,
                        (dayjs(item.endDate).format('YYYY-MM-DD')),
                        item.endMoney,
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="用户姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="联系方式:"
                            onChange={changePhone}
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
                                    flexWrap:'wrap',
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
                        <Button type="primary" onClick={exportToExcel}>
                            导出
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.userId}
                pagination={false}
                size='small'
                scroll={{y:'55vh',x:1800}}
                dataSource={props.PayReportFormsList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
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
                            <Table.Summary.Cell index={1}>
                                <Tooltip title={`微信充值:${consumptionMoney}元,手动充值:${consumptionMoney6}元`}>
                                    {(consumptionMoney+consumptionMoney6).toFixed(2)}元
                                </Tooltip>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                {consumptionMoney2}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                {consumptionMoney3}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>
                                {consumptionMoney4}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {consumptionMoney7}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {consumptionMoney5}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                                {consumptionMoney8}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>
                                {consumptionMoney9}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={9}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={10}>
                                {beginMoney}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={11}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={12}>
                                {endMoney}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PayReportFormsList: state.AppUserPayReportForms.list,
    }
};
export default connect(mapStateToProps) (AppUserPayReportForms)