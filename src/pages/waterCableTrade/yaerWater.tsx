import {connect} from "umi";
import {Button, Input, List, Modal, Table, Empty, Select, Space, DatePicker} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import MyTable from "@/components/MyTable";

const YaerWater=(props:any)=>{
    // 获取当前日期
    const today = dayjs();
    // 获取当前日期往前一个月的日期（仅年月日）
    const oneMonthAgo = today.subtract(30, 'day').format("YYYY-MM-DD HH:mm:ss");
    const oneMonthAgoEndDate = today.startOf('day').subtract(1, 'second').format("YYYY-MM-DD HH:mm:ss");
    // 设置状态，使用年月日格式
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-12-01');
    // 详情的时间
    const [infoDate,setInfoDate]=useState('');
    const [open,setOpen]=useState(false);
    const columns=[
        {
            title: '日期',
            dataIndex: 'recordTimes',
            render: (_: any, record: any) => (
                <div>
                    {record.recordTimes}年
                </div>

            ),
        },
        {
            title: '用水',
            dataIndex: 'energyUsages',
            render: (_: any, record: any) => (
                <div>
                    {record.energyUsages}t
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
                <Button onClick={()=>toInfo(record.recordTimes)}>详情</Button>
            ),
        },
    ];
    const getList=()=>{
        props.dispatch({
            type:'DateWater/yearfetch',
            payload:{startDate,endDate}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    useEffect(() => {
        console.log(startDate)
        console.log(endDate)
    }, []);
    const toInfo=(e:string)=>{
        setInfoDate(e);
        setOpen(true);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate(oneMonthAgo);
            setEndDate(oneMonthAgoEndDate);
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
                        <DatePicker.RangePicker showTime onChange={changeDate}/>
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
                                {props.count}t
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}

            />
            <Modal open={open} title={'详情'} onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)} width={'70vw'}>
                <MyTable startTime={infoDate} value={4}/>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        StatisticsList: state.DateWater.yearlist,
        count: state.DateWater.yearcount,
    }
};
export default connect(mapStateToProps) (YaerWater)