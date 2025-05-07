import {connect} from "umi";
import {Button, Input, List, Modal, Table, Empty, Select, Space, DatePicker, Pagination, message, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import  MyTable from '@/components/MyTable';
import * as StatisticsService from "@/services/statistics";
import {fenyeday, fetchday} from "@/services/statistics";
const HourStatistics=(props:any)=>{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, -1);
    const [startDate,setStartDate]=useState(dayjs(startOfDay).format("YYYY-MM-DD HH:mm:ss"));
    const [endDate,setEndDate]=useState(dayjs(endOfDay).format("YYYY-MM-DD HH:mm:ss"));
    // 详情的时间
    const [infoDate,setInfoDate]=useState('');
    const [open,setOpen]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setpageSize]=useState(50);
    const [startDatez,setStartDatez]=useState('');
    const [endDatez,setEndDatez]=useState('');
    const [list,setList]=useState([]);
    const [cid,setCid]=useState('');
    const [name,setName]=useState('');
    const [remake,setRemake]=useState('');
    const [count,setcount]=useState(0);
    const [energyUsage,setenergyUsage]=useState(0);
    const columns=[
        {
            title: '日期',
            dataIndex: 'recordTimes',
            render: (_: any, record: any) => (
                <div>
                    {record.recordTimes}时
                </div>

            ),
        },
        {
            title: '用电',
            dataIndex: 'energyUsages',
            render: (_: any, record: any) => (
                <div>
                    {record.energyUsages}kWh
                </div>

            ),
        },
        {
            title: '积累用电',
            dataIndex: 'eleNumSum',
            render: (_: any, record: any) => (
                <div>
                    {record.eleNumSum}kWh
                </div>

            ),
        },
        {
            title: '总数量',
            dataIndex: 'hourCount',
        },
        {
            title: '操作',
            dataIndex: 'complaint_content',
            render: (_: any, record: any) => (
                <Button onClick={()=>toInfo(record.recordTimes)} type='primary'>详情</Button>
            ),
        },
    ];
    const getList=()=>{
        props.dispatch({
            type:'Statistics/hourfetch',
            payload:{startDate,endDate}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const toInfo=(e:string)=>{
        setInfoDate(e);
        setOpen(true);
        let start=dayjs(e).format('YYYY-MM-DD HH:mm:ss');
        let parsedTime = dayjs(start);
        const parsedEndTime = parsedTime.clone().minute(59).second(59);
        let endTime=dayjs(parsedEndTime).format('YYYY-MM-DD HH:mm:ss');
        setStartDatez(start);
        setEndDatez(endTime);
        getListsum(start,endTime,page);
        getListconSum(start,endTime);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate(dayjs(startOfDay).format("YYYY-MM-DD HH:mm:ss"));
            setEndDate(dayjs(endOfDay).format("YYYY-MM-DD HH:mm:ss"));
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const sousuo=()=>{
        setPage(1);
        getListsum(startDatez,endDatez,1);
        getListconSum(startDatez,endDatez);
    };
    const getListsum=(vals:string,vals2:string,pagenum:number)=>{
        StatisticsService.fetchday(pagenum,cid,name,vals,vals2,'扣费成功',0,remake,pageSize).then((res:any)=>{
            if (res.ErrorCode==0){
                setList(res.Data)
            }else {
                message.error(res.Data)
            }
        })
    };
    const getListconSum=(vals:string,vals2:string)=>{
        StatisticsService.fenyeday(cid,name,vals,vals2,'扣费成功',0,remake,pageSize).then((res:any)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setenergyUsage(res.Data.energyUsage);
            }else {
                message.error(res.Data)
            }
        })
    };
    const daycolumns=[
        {
            title: '采集器编号',
            dataIndex: 'collector_id',
        },
        {
            title: '表地址',
            dataIndex: 'address',
        },
        {
            title: '表描述',
            dataIndex: 'remark',
        },
        {
            title: '日期',
            dataIndex: 'recordTime',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(record.recordTime).format("YYYY-MM-DD HH:mm:ss")}
                </div>

            ),
        },
        {
            title: '开始',
            dataIndex: 'energyOld',
            render: (_: any, record: any) => (
                <div>
                    {record.energyOld}kWh
                </div>

            ),
        },
        {
            title: '结束',
            dataIndex: 'energyNew',
            render: (_: any, record: any) => (
                <div>
                    {record.energyNew}kWh
                </div>

            ),
        },
        {
            title: '统计值',
            dataIndex: 'energyUsage',
            render: (_: any, record: any) => (
                <div>
                    {record.energyUsage}kWh
                </div>
            ),
        },
        {
            title: '用户',
            dataIndex: 'tenant_name',
            render: (_: any, record: any) => (
                <div>
                    {record.tenant_name?record.tenant_name:<Tag color='red'>未绑定租户</Tag>}
                </div>
            ),
        },
    ];
    const changePage=(e)=>{
      setPage(e);
      getListsum(startDatez,endDatez,e);
    };
    const sousuoList=()=>{
        getList();
    };
    return(
        <div>
            <List>
                <List.Item>
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
                        <DatePicker.RangePicker showTime onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>
                    </Space.Compact>
                    <Button type="primary" onClick={sousuoList}>
                        搜索
                    </Button>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                scroll={{x:1500}}
                pagination={false}
                size='small'
                rowKey={(columns) => columns.recordTimes}
                dataSource={props.StatisticsList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                summary={(columns) => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={1}
                      >
                          统计
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={2}
                      >
                          {props.count}kWh
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
            />
            <Modal open={open} title={'详情'} onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)} width={'70vw'}>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="租户姓名:"
                                onChange={(e)=>setName(e.target.value)}
                            />
                            <Input
                                addonBefore="采集器:"
                                onChange={(e)=>setCid(e.target.value)}
                            />
                            <Input
                                addonBefore="电表备注:"
                                onChange={(e)=>setRemake(e.target.value)}
                            />
                            <Button type="primary" onClick={sousuo}>
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Table
                    columns={daycolumns}
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    pagination={false}
                    size='small'
                    rowKey={(columns) => columns.id}
                    dataSource={list}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                    summary={(columns) => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell
                                    index={1}
                                >
                                    统计
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={0}>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={0}>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={0}>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={0}>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={0}>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell
                                    index={2}
                                >
                                    {energyUsage}kWh
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
                <Pagination total={count}  showSizeChanger pageSize={pageSize} current={page}  onChange={changePage} pageSizeOptions={[50,100,500,1000,10000]}/>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        StatisticsList: state.Statistics.hourlist,
        count: state.Statistics.hourcount,
    }
};
export default connect(mapStateToProps) (HourStatistics)