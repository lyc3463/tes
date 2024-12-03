import {Button, DatePicker, Input, List, Pagination, Space, Table} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

const WaterJournaling=(props)=>{
    const [page,setpage]=useState(1);
    const [collector_id,setcollector_id]=useState('');
    const [tenantName,settenantName]=useState('');
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Journaling/fetch",
            payload:{page,collector_id,tenantName,startDate,endDate}
        })
    };
    const columns =[
        {
            title: '抄表时间',
            dataIndex: 'recordTime',
            key: 'recordTime',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
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
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setstartDate('2000-01-01');
            setendDate('2099-01-01');
        } else {
            setstartDate(data[0]);
            setendDate(data[1]);
        }
    };
    const sousuo=()=>{
        setpage(1);
        props.dispatch({
            type:"Journaling/fenye",
            payload:{collector_id,tenantName,startDate,endDate}
        })
        logFenye();
    };
    const onChange=(e)=>{
      setpage(e);
    };
    useEffect(() => {
        logFenye();
        console.log(props)
    }, [page]);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="采集器编号:"
                            onChange={(e)=>setcollector_id(e.target.value)}
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
                            <DatePicker.RangePicker showTime onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                dataSource={props.JournalingList}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}

        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        JournalingList: state.Journaling.list,
        count: state.Journaling.count,
    }
};
export default connect(mapStateToProps) (WaterJournaling)