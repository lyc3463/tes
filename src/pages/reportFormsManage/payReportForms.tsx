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

const PayReportForms=(props)=>{
    const[page,setPage]=useState(1);
    const[pageSize,setPageSize]=useState(50);
    const [spinning,setspinning]=useState(false);
    const [phone,setPhone]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','phone')||'');
    const [name,setName]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','name')||'');
    const [startDate,setStartDate]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/reportFormsManage/payReportForms/','endDate')||'2099-01-01');
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
            title: '租户',
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
        },
        {
            title: '电费(元)',
            dataIndex: 'consumptionMoney3',
            key: 'consumptionMoney3',
        },
        {
            title: '水费(元)',
            dataIndex: 'consumptionMoney4',
            key: 'consumptionMoney4',
        },
        {
            title: '服务费(元)',
            dataIndex: 'consumptionMoney7',
            key: 'consumptionMoney7',
        },
        {
            title: '公共缴费(元)',
            dataIndex: 'consumptionMoney5',
            key: 'consumptionMoney5',
        },
        {
            title: '违约金(元)',
            dataIndex: 'consumptionMoney8',
            key: 'consumptionMoney8',
        },
        {
            title: '月保(元)',
            dataIndex: 'consumptionMoney9',
            key: 'consumptionMoney9',
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
                                {record.beginMoney}
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
                                {record.endMoney}
                            </div>
                        )
                    },
                },
            ]
        },
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"PayReportForms/fetch",
            payload:{name,phone,startDate,endDate,page,pageSize},
        })
    };
    const sousuo=()=>{
        logFenye();
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/reportFormsManage/payReportForms/','startDate','2000-01-01');
            updateSessionStorage('/reportFormsManage/payReportForms/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/reportFormsManage/payReportForms/','startDate',data[0]);
            updateSessionStorage('/reportFormsManage/payReportForms/','endDate',data[1]);
        }
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/reportFormsManage/payReportForms/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/reportFormsManage/payReportForms/','phone',e.target.value);
    };
    const exportToExcel=()=>{
        setspinning(true);
        WaterRateService.fetch({name,phone,startDate,endDate,page:1,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['房屋','单元','租户','手机号','手动充值(元)','微信充值(元)','租金/管理费(元)','电费(元)','水费(元)','服务费(元)','公共缴费(元)','违约金(元)','月保(元)','开始时间','开始时间余额(元)','结束时间','结束时间余额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.house_name,
                        (() => {
                            // 提取单元名称，如果unitList为空则返回空字符串
                            return item.unitList && item.unitList.length > 0
                                ? item.unitList.map(val => val.unit_name).join(', ')
                                : '';
                        })(),
                        item.tenant_name,
                        item.tenant_phone,
                        item.consumptionMoney6,
                        item.consumptionMoney,
                        item.consumptionMoney2,
                        item.consumptionMoney3,
                        item.consumptionMoney4,
                        item.consumptionMoney7,
                        item.consumptionMoney5,
                        item.consumptionMoney8,
                        item.consumptionMoney9,
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
                            addonBefore="租户姓名:"
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
                rowKey={(columns) => columns.tenantId}
                pagination={false}
                size='small'
                scroll={{y:'60vh',x:1800}}
                dataSource={props.PayReportFormsList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PayReportFormsList: state.PayReportForms.list,
    }
};
export default connect(mapStateToProps) (PayReportForms)