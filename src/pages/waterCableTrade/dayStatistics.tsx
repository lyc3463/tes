import {connect} from "umi";
import {Button, Input, List, Modal, Table, Empty, Select, Space, DatePicker} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import MyTable from "@/components/MyTable";

const DayStatistics=(props:any)=>{
    // 获取当前日期
    const today = dayjs();
    // 获取当前日期往前一个月的日期（仅年月日）
    const oneMonthAgo = today.subtract(30, 'day').format("YYYY-MM-DD");
    const oneMonthAgoEndDate = today.startOf('day').subtract(1, 'second').format("YYYY-MM-DD");
    // 设置状态，使用年月日格式
    const [startDate, setStartDate] = useState(oneMonthAgo);
    const [endDate, setEndDate] = useState(oneMonthAgoEndDate);
    // 详情的时间
    const [infoDate,setInfoDate]=useState('');
    const [open,setOpen]=useState(false);
    const isoDateString = (text:string)=>{
        let date=text.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
        let dateString= new Date(date);
        return dateString
    };
    const columns=[
        {
            title: '日期',
            dataIndex: 'recordTimes',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(isoDateString(record.recordTimes)).format("YYYY-MM-DD")}
                </div>

            ),
        },
        {
            title: '总用电',
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
            type:'Statistics/dayfetch',
            payload:{startDate,endDate}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const toInfo=(e:string)=>{
        let date=dayjs(isoDateString(e)).format("YYYY-MM-DD")
        setInfoDate(date);
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
                        <DatePicker.RangePicker onChange={changeDate}  defaultValue={[dayjs(startDate), dayjs(endDate)]}/>
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
                <MyTable startTime={infoDate} value={2}/>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        StatisticsList: state.Statistics.daylist,
        count: state.Statistics.daycount,
    }
};
export default connect(mapStateToProps) (DayStatistics)