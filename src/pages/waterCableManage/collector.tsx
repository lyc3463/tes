import {Button, Form, Input, List, Pagination, Select, Space, Table, Tag} from "antd";
import  {history,connect} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import * as CollectorService from '@/services/collector';
import {getRandomNumber, getTimeDifference} from "@/utils/OpenTool";
import {fenye} from "@/services/collector";
const Collector=(props:any)=>{
    const [page,setPage]=useState(1);
    const [collector_number,setCollector_number]=useState('');
    const [stutes,setStutes]=useState(2);
    const toedit=(e)=>{
        history.push(`/waterCableManage/editCollector?id=${e}`)
    };
    const columns =[
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render:(text:any,record:any)=>{
                return(
                    <Button type='link' onClick={()=>toedit(record.id)}>{text}</Button>
                )
            }
        },
        {
            title: '采集器ID',
            dataIndex: 'collectorid',
            key: 'collectorid',
            render:(text:any,record:any)=>{
                return(
                    <Button type='link' onClick={()=>toedit(record.id)}>{text}</Button>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'collector_status',
            key: 'collector_status',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.collector_status==1?<span style={{color:'green'}}>已连接</span>:<span style={{color:'red'}}>未连接</span>}
                    </div>
                )
            }
        },
        {
            title: '连接质量',
            dataIndex: 'linkQuality',
            key: 'linkQuality',
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
            title: '表数量',
            dataIndex: 'tableNum',
            key: 'tableNum',
            render: (text:any, record:any) => {
                return(
                    <span>{record.tableNum}(只)</span>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '上次连接/掉线',
            dataIndex: 'lastTime',
            key: 'lastTime',
            render: (_, record: any) => (
                <span>{getTimeDifference(dayjs(record.connect_time).format('YYYY-MM-DD HH:mm:ss'))}</span>
            ),
        },
        {
            title: '积累在线',
            dataIndex: 'createdTime',
            key: 'createdTime',
            render: (_, record: any) => (
                <span>{getTimeDifference(dayjs(record.createdTime).format('YYYY-MM-DD HH:mm:ss'))}</span>
            ),

        },
    ]
    const toadd=()=>{
        history.push('/waterCableManage/addCollector')
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Collector/fetch",
            payload:{page,collector_number,stutes}
        })
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
        logFenye();
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    const changeName=(e:any)=>{
        setCollector_number(e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:"Collector/fenye",
            payload:{collector_number,stutes}
        })
        logFenye();
    }
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            添加采集器
                        </Button>
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="采集器ID:"
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
                                连接状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 2, label: '全部' },
                                    { value: 0, label: '未连接' },
                                    { value: 1, label: '已连接' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                dataSource={props.CollectorList}
                rowKey={(columns) => columns.id}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CollectorList: state.Collector.list,
        count: state.Collector.count
    }
};
export default connect(mapStateToProps) (Collector)