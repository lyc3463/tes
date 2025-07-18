import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, List, message, Pagination, Space, Spin, Table, Tooltip} from "antd";
import dayjs from "dayjs";
import * as WaterRateService from "@/services/electricCharge";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";

const ElectricCharge=(props:any)=>{
    const [address,setaddress]=useState(checkSessionStorage('/reportFormsManage/electricCharge/','address')||'');
    const [remark,setremark]=useState(checkSessionStorage('/reportFormsManage/electricCharge/','remark')||'');
    const [name,setName]=useState(checkSessionStorage('/reportFormsManage/electricCharge/','name')||'');
    const [startDate,setStartDate]=useState(checkSessionStorage('/reportFormsManage/electricCharge/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/reportFormsManage/electricCharge/','endDate')||'2099-01-01');
    const [spinning,setspinning]=useState(false);
    const [tenantId,settenantId]=useState(0);
    const [energyNew,setenergyNew]=useState(0);// 开始数据总和
    const [energyNew2,setenergyNew2]=useState(0);// 结束数据总和
    const [eleMoneySum,seteleMoneySum]=useState(0);// 金额总和
    const columns =[
        {
            title: '房屋',
            dataIndex: 'house_name',
            key: 'house_name',
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
            title: '采集器id',
            dataIndex: 'collectorid',
            key: 'collectorid',
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
            title: '电表数据开始',
            children: [
                {
                    title: '开始时间',
                    dataIndex: 'beginTime',
                    key: 'beginTime',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {dayjs(record.beginTime).format('YYYY-MM-DD')}
                            </div>
                        )
                    },
                },
                {
                    title: '度数',
                    dataIndex: 'energyNew',
                    key: 'energyNew',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {record.energyNew.toFixed(2)}kWh
                            </div>
                        )
                    },
                },
            ]
        },
        {
            title: '电表数据结束',
            children: [
                {
                    title: '结束时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {dayjs(record.endTime).format('YYYY-MM-DD')}
                            </div>
                        )
                    },
                },
                {
                    title: '结束度数',
                    dataIndex: 'energyNew2',
                    key: 'energyNew2',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {record.energyNew2.toFixed(2)}kWh
                            </div>
                        )
                    },
                },
            ]
        },
        {
            title: '金额',
            dataIndex: 'eleMoneySum',
            key: 'eleMoneySum',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.eleMoneySum.toFixed(2)}元
                    </div>
                )
            },
        },
    ];
    // 累加
    const calculateSums=(sumDate)=>{
        // 初始化四个求和变量
        let energyNew = 0;
        let energyNew2 = 0;
        let eleMoneySum = 0;
        // 遍历数组，累加每个属性的值
        sumDate.map(transaction => {
            energyNew += transaction.energyNew || 0; // 使用||0确保未定义或null值不会破坏计算
            energyNew2 += transaction.energyNew2 || 0;
            eleMoneySum += transaction.eleMoneySum || 0;
        });
        // 返回一个对象，包含四个求和结果
        return {
            energyNew: energyNew.toFixed(2)*1,
            energyNew2: energyNew2.toFixed(2)*1,
            eleMoneySum: eleMoneySum.toFixed(2)*1,
        };
    };
    // 分页
    const logFenye=()=>{
        setspinning(true);
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        props.dispatch({
            type:"ElectricCharge/fetch",
            payload:{address,remark,name,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),tenantId},
            callback:(data,err)=>{
                if (data==0){
                    setspinning(false);
                }else {
                    setspinning(false);
                }
            }
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                const sum=calculateSums(res.Data);
                setenergyNew(sum.energyNew);
                setenergyNew2(sum.energyNew2);
                seteleMoneySum(sum.eleMoneySum);
            }
        })
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/reportFormsManage/electricCharge/','startDate','2000-01-01');
            updateSessionStorage('/reportFormsManage/electricCharge/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/reportFormsManage/electricCharge/','startDate',data[0]);
            updateSessionStorage('/reportFormsManage/electricCharge/','endDate',data[1]);
        }
    };
    const shousuo=()=>{
        logFenye();
    };
    const changName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/reportFormsManage/electricCharge/','name',e.target.value);
    };
    const changeAddress=(e)=>{
        setaddress(e.target.value);
        updateSessionStorage('/reportFormsManage/electricCharge/','address',e.target.value);
    };
    const changeRemark=(e)=>{
        setremark(e.target.value);
        updateSessionStorage('/reportFormsManage/electricCharge/','remark',e.target.value);
    };
    const exportToExcel=()=>{
        setspinning(true);
        const originalDate = dayjs(endDate);
        const newDate = originalDate.add(1, 'day');
        WaterRateService.fetch({address,remark,name,startDate,endDate:dayjs(newDate).format('YYYY-MM-DD'),tenantId}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['房屋','单元','租户','采集器编号','通讯地址','描述','电表数据开始时间','开始度数(kwh)','电表数据结束时间','结束度数(kwh)','金额(元)'];
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
                        item.collectorid,
                        item.address,
                        item.remark,
                        (dayjs(item.beginTime).format('YYYY-MM-DD')),
                        item.energyNew.toFixed(2),
                        (dayjs(item.endTime).format('YYYY-MM-DD')),
                        item.energyNew2.toFixed(2),
                        item.eleMoneySum.toFixed(2),
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
                            onChange={changName}
                            value={name}
                        />
                        <Input
                            addonBefore="电表地址:"
                            onChange={changeAddress}
                            value={address}
                        />
                        <Input
                            addonBefore="电表描述:"
                            onChange={changeRemark}
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
                                时间:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                        <Button type="primary" onClick={exportToExcel}>
                            导出
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.ElectricChargeList}
                scroll={{x:1500}}
                pagination={false}
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
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                {energyNew}kwh
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                {energyNew2}kwh
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                {eleMoneySum}元
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
        ElectricChargeList: state.ElectricCharge.list,
        // count: state.ElectricCharge.count,
    }
};
export default  connect(mapStateToProps) (ElectricCharge)