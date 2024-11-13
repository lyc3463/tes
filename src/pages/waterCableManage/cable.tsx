import {Button, Form, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {getRandomNumber} from "@/utils/OpenTool";

const Cable=(props:any)=>{
    const [page,setPage]=useState(1);
    const [collectorId,setCollectorId]=useState('');
    const toedit=(e)=>{
        history.push(`/waterCableManage/editCable?id=${e}`)
    }
    const columns =[
        {
            title: '采集器',
            dataIndex: 'collectorid',
            key: 'collectorid',
        },

        {
            title: '通讯质量',
            dataIndex: 'communicate_quality',
            key: 'communicate_quality',
            render:(_:any,record:any)=>{
                let quality;
                if (getRandomNumber(1,10) <= 1) {
                    quality =<Tag color='red'>差</Tag>;
                } else if (getRandomNumber(1,10) <= 2) {
                    quality = <Tag color='gold'>良</Tag>;
                } else {
                    quality = <Tag color='green'>好</Tag>;
                }
                return(
                    <>
                        {quality}
                    </>
                )
            }
        },
        {
            title: '通讯地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '电表类型',
            dataIndex: 'electricity_type',
            key: 'electricity_type',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <div>
                            {record.electricity_type=='16625'?<Tag color='cyan'>单相单费率</Tag>:<Tag color='blue'>三相单费率</Tag>}
                        </div>
                    </>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '状态',
            dataIndex: 'presence',
            key: 'presence',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <div>
                            {record.electricity_type==1?<Tag color='#87d068'>已开户</Tag>:<Tag color='red'>未开户</Tag>}
                        </div>
                    </>
                )
            }
        },
        {
            title: '积累用电量',
            dataIndex: 'submitted',
            key: 'submitted',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <span>{record.submitted}kwh</span>
                    </>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            fixed: 'right',
            width: 200,
            render:(_:any,record:any)=>{
                return(
                    <>
                       <Space>
                           <Button type='link' onClick={()=>tojiben(record)}>基本业务</Button>
                           <Button type='link' onClick={(e)=>toedit(record.id)}>编辑</Button>
                       </Space>
                    </>
                )
            }
        }
    ];
    useEffect(() => {
        logFenye();
        console.log(props)
    }, [page]);
    const  toAdd=()=>{
        history.push('/waterCableManage/addCable')
    }
    const tojiben=(e)=>{
        history.push(`/waterCableManage/ElectricityBasicBusiness?id=${e.id}`)
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Cable/fetch",
            payload:{page,collectorId}
        })
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
        logFenye();
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:"Cable/fenye",
            payload:{collectorId}
        })
        logFenye();
    };
    // 监听采集器输入框
    const changeName=(e)=>{
      setCollectorId(e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toAdd}>
                            添加电表
                        </Button>
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="采集器:"
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                scroll={{x:1500}}
                pagination={false}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.CableList}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableList: state.Cable.list,
        count: state.Cable.count
    }
};
export default connect(mapStateToProps) (Cable)