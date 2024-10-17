import {connect} from "umi";
import {useEffect, useState} from "react";
import {Button, Image, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import dayjs from "dayjs";

const ConsumptionLog=(props:any)=>{
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    // 消费类型 0全部 1充值、2租金、3电费、4水费、5公共缴费、6违约金、7物业管理费、8积分
    const [type,setType]=useState(0);

    // 监听类型
    const changeType=(e)=>{
      setType(e)
    };
    const columns=[
        {
            title: '日期',
            dataIndex: 'estarttime',
            key: 'estarttime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.estarttime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'eendtime',
            key: 'eendtime',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.eendtime).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '手机号',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '消费金额/积分',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '消费类型',
            dataIndex: 'emp_status',
            key: 'emp_status',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.emp_status==0?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}
                    </div>
                )
            }
        },

    ];
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'ConsumptionLog/fenye',
            payload:{name,phone,type}
        });
        logFenye();
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"ConsumptionLog/fetch",
            payload:{page,name,phone,type}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    // 监听页数
    const onChange=(e:number)=>{
        setPage(e);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={(e)=>setName(e.target.value)}
                            addonBefore="姓名:"
                        />
                        <Input
                            onChange={(e)=>setPhone(e.target.value)}
                            addonBefore="手机号:"
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
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                defaultValue={type}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '充值' },
                                    { value:2, label: '租金' },
                                    { value:3, label: '电费' },
                                    { value:4, label: '水费' },
                                    { value:5, label: '公共缴费' },
                                    { value:6, label: '违约金' },
                                    { value:7, label: '物业管理费' },
                                    { value:8, label: '积分' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <div style={{maxHeight:'60vh',overflow:'auto',border:'1px solid #ddd'}}>
                <Table
                    columns={columns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    dataSource={props.ConsumptionLogList}
                    rowKey={(columns) => columns.id}
                    size='small'
                />
            </div>
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ConsumptionLogList: state.ConsumptionLog.list,
        count: state.ConsumptionLog.count,
    }
};
export default connect(mapStateToProps) (ConsumptionLog)