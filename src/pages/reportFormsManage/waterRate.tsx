import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, Input, List, Pagination, Space, Table} from "antd";

const WaterRate=(props:any)=>{
    const [page,setPage]=useState(1);
    const [collectorID,setCollectorID]=useState('');
    const [name,setName]=useState('');
    const columns =[
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
            title: '抄表前水量',
            dataIndex: 'energyOld',
            key: 'energyOld',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text}t
                    </div>
                )
            },
        },
        {
            title: '抄表后水量',
            dataIndex: 'energyNew',
            key: 'energyNew',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text}t
                    </div>
                )
            },
        }
    ];
    useEffect(() => {
        logFenye();
    }, []);
    useEffect(() => {
    }, [page]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"ElectricCharge/fetch",
            payload:{page,name,collectorID}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'ElectricCharge/fenye',
            payload:{page,name,collectorID}
        });
        logFenye()
    };
    const onChange=(val:number)=>{
        setPage(val)
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
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        WaterRateList: state.WaterRate.list,
        count: state.WaterRate.count,
    }
};
export default  connect(mapStateToProps) (WaterRate)