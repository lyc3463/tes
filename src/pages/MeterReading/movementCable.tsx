import {Button, Input, List, message, Pagination, Select, Space, Table} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

const MovementCable=(props:any)=>{
    const [page,setPage]=useState(1);
    const [collector_id,setCollector_id]=useState('');
    const [name,setName]=useState('');
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
    // 手动抄表
    const shoudong=()=>{
        props.dispatch({
            type:'MovementCable/shoudong'
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('抄表成功')
            }else {
                message.error(res.Data)
            }
        })
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'MovementCable/fenye',
            payload:{collector_id,name}
        });
        logFenye()
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"MovementCable/fetch",
            payload:{page,collector_id,name}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    // 监听页数
    const onChange=(e:number)=>{
      setPage(e)
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={shoudong}>
                            手动抄表
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="采集器编号:"
                            onChange={(e)=>setCollector_id(e.target.value)}
                        />
                        <Input
                            addonBefore="租户姓名:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                dataSource={props.MovementCableList}
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
        MovementCableList: state.MovementCable.list,
        count: state.MovementCable.count,
    }
};
export default connect(mapStateToProps) (MovementCable)