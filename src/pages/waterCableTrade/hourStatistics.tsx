import {connect} from "umi";
import {Button, Input, List, Modal, Table, Empty, Select, Space, DatePicker} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import  MyTable from '@/components/MyTable';
const HourStatistics=(props:any)=>{
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, -1);
    const [startDate,setStartDate]=useState(dayjs(startOfDay).format("YYYY-MM-DD HH:mm:ss"));
    const [endDate,setEndDate]=useState(dayjs(endOfDay).format("YYYY-MM-DD HH:mm:ss"));
    // 详情的时间
    const [infoDate,setInfoDate]=useState('');
    const [open,setOpen]=useState(false);
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
        console.log('props',props);
    }, []);
    const toInfo=(e:string)=>{
        setInfoDate(e);
        setOpen(true);
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
                    <Button type="primary" onClick={sousuo}>
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
                rowKey={(columns) => columns.id}
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
                <MyTable startTime={infoDate} value={1}/>
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