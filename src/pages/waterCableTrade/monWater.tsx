import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {Button, DatePicker, List, Modal, Space, Table} from "antd";
import MyTable from "@/components/MyTable";
import {connect} from "umi";
import MywaterTable from "@/components/MywaterTable";

const MonWater=(props)=>{
    // 获取当前日期
    const today = dayjs();
    // 获取当前日期往前一个月的日期（仅年月日）
    const oneMonthAgo = today.subtract(30, 'day').format("YYYY-MM-DD HH:mm:ss");
    const oneMonthAgoEndDate = today.startOf('day').subtract(1, 'second').format("YYYY-MM-DD HH:mm:ss");
    // 设置状态，使用年月日格式
    const [startDate, setStartDate] = useState(oneMonthAgo);
    const [endDate, setEndDate] = useState(oneMonthAgoEndDate);
    // 详情的时间
    const [infoDate,setInfoDate]=useState('');
    const [open,setOpen]=useState(false);
    const isoDateString = (text:string)=>{
        const formattedString = `${text.substring(0, 4)}-${text.substring(4, 6)}`;

        return formattedString
    };
    const getFirstDayOfMonth=(yearMonth:string)=> {
        const year = parseInt(yearMonth.slice(0, 4), 10);
        const month = parseInt(yearMonth.slice(4, 6), 10);
        const firstDay = new Date(year, month - 1, 1, 0, 0, 0);
        const formattedDate = firstDay.toISOString().split('T')[0].replace(/-/g, '-').padEnd(19, '0') + ' 00:00:00';
        const formattedDateSimpler = `${year}-${String(month).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')} 00:00:00`;

        // 返回格式化后的日期时间字符串
        return formattedDateSimpler;
    }
    const columns=[
        {
            title: '日期',
            dataIndex: 'recordTimes',
            render: (_: any, record: any) => (
                <div>
                    {isoDateString(record.recordTimes)}月
                </div>

            ),
        },
        {
            title: '消耗度数',
            dataIndex: 'energyUsages',
            render: (_: any, record: any) => (
                <div>
                    {record.energyUsages}t
                </div>
            ),
        },
        {
            title: '积累度数',
            dataIndex: 'energyNews',
            render: (_: any, record: any) => (
                <div>
                    {record.energyNews}t
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
            type:'DateWater/moonfetch',
            payload:{startDate,endDate}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const toInfo=(e:string)=>{
        let strtoDate=getFirstDayOfMonth(e);
        setInfoDate(strtoDate);
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
                        <DatePicker.RangePicker picker='month' onChange={changeDate} defaultValue={[dayjs(startDate), dayjs(endDate)]}/>
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
                                {props.count}t
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}

            />
            <Modal open={open} title={'详情'} onCancel={()=>setOpen(false)} onOk={()=>setOpen(false)} width={'70vw'}>
                <MywaterTable startTime={infoDate} value={3}/>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        StatisticsList: state.DateWater.moonlist,
        count: state.DateWater.mooncount,
    }
};
export default  connect(mapStateToProps)(MonWater)