import {connect} from "umi";
import {useState,useEffect} from "react";
import {Button, DatePicker, Form, Input, InputNumber, List, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import dayjs from "dayjs";

const PayReportForms=(props)=>{
    const [phone,setPhone]=useState('');
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
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '租户',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.tenant_name==null?<Tag color='red'>未绑定租户</Tag>:<Tag>{record.tenant_name}</Tag>}
                    </div>
                )
            }
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '充值',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {(record.consumptionMoney+record.consumptionMoney6).toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '租金/管理费',
            dataIndex: 'consumptionMoney2',
            key: 'consumptionMoney2',
        },
        {
            title: '电费',
            dataIndex: 'consumptionMoney3',
            key: 'consumptionMoney3',
        },
        {
            title: '水费',
            dataIndex: 'consumptionMoney4',
            key: 'consumptionMoney4',
        },
        {
            title: '服务费',
            dataIndex: 'consumptionMoney7',
            key: 'consumptionMoney7',
        },
        {
            title: '公共缴费',
            dataIndex: 'consumptionMoney5',
            key: 'consumptionMoney5',
        },
        {
            title: '违约金',
            dataIndex: 'consumptionMoney8',
            key: 'consumptionMoney8',
        },
        {
            title: '月保',
            dataIndex: 'consumptionMoney9',
            key: 'consumptionMoney9',
        },
        {
            title: '开始时间余额',
            dataIndex: 'beginMoney',
            key: 'beginMoney',
        },
        {
            title: '结束时间余额',
            dataIndex: 'endMoney',
            key: 'endMoney',
        },
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"PayReportForms/fetch",
            payload:{name,phone,startDate,endDate}
        })
    };
    const sousuo=()=>{
        // logFenye();
    };
    useEffect(() => {
        // logFenye();
    }, []);
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
                            addonBefore="联系方式:"
                            onChange={(e)=>setPhone(e.target.value)}
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
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.tenantId}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                dataSource={props.PayReportFormsList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PayReportFormsList: state.PayReportForms.list,
    }
};
export default connect(mapStateToProps) (PayReportForms)