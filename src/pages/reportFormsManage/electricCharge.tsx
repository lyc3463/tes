import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, List, Pagination, Space, Table} from "antd";
import dayjs from "dayjs";

const ElectricCharge=(props:any)=>{
    const [page,setPage]=useState(1);
    const [collectorID,setCollectorID]=useState('');
    const [name,setName]=useState('');
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const columns =[
        {
            title: '日期',
            dataIndex: 'recordTime',
            key: 'recordTime',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.recordTime).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                )
            },
        },
        {
            title: '采集器编号',
            dataIndex: 'collector_id',
            key: 'collector_id',
        },
        {
            title: '通讯地址',
            dataIndex: 'address',
            key: 'address',
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
            title: '抄表前电量',
            dataIndex: 'energyOld',
            key: 'energyOld',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text}kWh
                    </div>
                )
            },
        },
        {
            title: '抄表后电量',
            dataIndex: 'energyNew',
            key: 'energyNew',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text}kWh
                    </div>
                )
            },
        }
    ];
    useEffect(() => {
        logFenye();
        console.log(props)
    }, [page]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"ElectricCharge/fetch",
            payload:{page,name,collectorID,startDate,endDate}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'ElectricCharge/fenye',
            payload:{page,name,collectorID,startDate,endDate}
        });
        logFenye()
    };
    const onChange=(val:number)=>{
        setPage(val)
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
                            addonBefore="采集器:"
                            onChange={(e)=>setCollectorID(e.target.value)}
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
                dataSource={props.ElectricChargeList}
                scroll={{x:1500}}
                pagination={false}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ElectricChargeList: state.ElectricCharge.list,
        count: state.ElectricCharge.count,
    }
};
export default  connect(mapStateToProps) (ElectricCharge)