import {Button, Input, List, message, Select, Space, Table} from "antd";
import {connect} from "umi";
import {useEffect} from "react";
import dayjs from "dayjs";

const MovementCable=(props:any)=>{
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
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            fixed: 'right',
            width: 200,
            render: (text:any, record:any) => {
                return(
                    <div>
                        {/*<a onClick={()=>{setDel(true)}}>删除</a>*/}
                        {/*<a onClick={()=>{setrz(true)}} style={{marginLeft:'5px'}}>抄表日志</a>*/}
                    </div>
                )
            },
        }
    ];

    useEffect(() => {
        console.log(props)
    }, []);
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
                            addonBefore="收费项目名称:"
                        />

                        <Button type="primary">
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
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        MovementCableList: state.MovementCable.list
    }
};
export default connect(mapStateToProps) (MovementCable)