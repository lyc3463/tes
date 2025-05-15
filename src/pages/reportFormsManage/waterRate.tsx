import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, List, Pagination, Space, Table, Tag} from "antd";
import dayjs from "dayjs";

const WaterRate=(props:any)=>{
    const [address,setaddress]=useState('');
    const [remark,setremark]=useState('');
    const [name,setName]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
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
            title: '租户',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.tenant_name?record.tenant_name:'未绑定'}
                    </div>
                )
            },
        },
        {
            title: '采集器编号',
            dataIndex: 'collectorid',
            key: 'collectorid',
        },
        {
            title: '通讯地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '水表数据开始',
            children: [
                {
                    title: '开始时间',
                    dataIndex: 'beginTime',
                    key: 'beginTime',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {dayjs(record.beginTime).format('YYYY-MM-DD HH:mm:ss')}
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
                                {record.energyNew}t
                            </div>
                        )
                    },
                },
            ],
        },
        {
            title: '水表数据结束',
            children: [
                {
                    title: '开始时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                        )
                    },
                },
                {
                    title: '度数',
                    dataIndex: 'energyNew2',
                    key: 'energyNew2',
                    render: (text:any, record:any) => {
                        return(
                            <div>
                                {record.energyNew2}t
                            </div>
                        )
                    },
                },
            ]
        },
        {
            title: '金额',
            dataIndex: 'waterMoneySum',
            key: 'waterMoneySum',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.waterMoneySum}元
                    </div>
                )
            },
        },
    ];

    useEffect(() => {
        logFenye();
    }, []);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"WaterRate/fetch",
            payload:{name,address,remark,startDate,endDate}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        logFenye()
    };
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
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="租户姓名:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Input
                            addonBefore="水表地址:"
                            onChange={(e)=>setaddress(e.target.value)}
                        />
                        <Input
                            addonBefore="水表描述:"
                            onChange={(e)=>setremark(e.target.value)}
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
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.WaterRateList}
                scroll={{x:1500}}
                pagination={false}
            >

            </Table>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        WaterRateList: state.WaterRate.list,
    }
};
export default  connect(mapStateToProps) (WaterRate)