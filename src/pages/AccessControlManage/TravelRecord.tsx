import {Button, DatePicker, Image, Input, List, Pagination, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const TravelRecord=(props:any)=>{
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/AccessControlManage/TravelRecord/','startDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/AccessControlManage/TravelRecord/','endDate')||'2099-01-01');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 闸机编号
    const [deviceSn,setDeviceSn]=useState(checkSessionStorage('/AccessControlManage/TravelRecord/','deviceSn')||'');
    const columns = [
        {
            title: '闸机编号',
            dataIndex: 'device_sn',
        },
        {
            title: '闸机地点',
            dataIndex: 'gateName',
        },
        {
            title: '姓名',
            dataIndex: 'travel_name',
        },
        {
            title: '人脸',
            dataIndex: 'reg_image',
            render: (text: any, record:any) => (
                <div>
                    <Image src={`data:image/jpeg;base64,${record.reg_image}`} style={{height:'50px',width:'50px'}}/>
                </div>
            ),
        },
        {
            title: '通行时间',
            dataIndex: 'travelTime',
            render: (text: any, record:any) => (
                <div>
                    {dayjs(record.travelTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            ),
        },
    ];
    // 监听时间
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/AccessControlManage/TravelRecord/','startDate','2000-01-01');
            updateSessionStorage('/AccessControlManage/TravelRecord/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/AccessControlManage/TravelRecord/','startDate',data[0]);
            updateSessionStorage('/AccessControlManage/TravelRecord/','endDate',data[1]);
        }
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"TravelRecord/fetch",
            payload:{page,deviceSn,startDate,endDate,pageSize}
        });
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenyeInfo();
    }, []);
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 搜索
    const  sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'TravelRecord/fenye',
            dispatch:{deviceSn,startDate,endDate,pageSize}
        });
    };
    const changeDeviceSn=(e)=>{
        setDeviceSn(e.target.value);
        updateSessionStorage('/AccessControlManage/TravelRecord/','deviceSn',e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="闸机编号:"
                            onChange={changeDeviceSn}
                            value={deviceSn}
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
                                时间:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
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
                dataSource={props.TravelRecordList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TravelRecordList: state.TravelRecord.list,
        count: state.TravelRecord.count,
    }
};
export default connect(mapStateToProps) (TravelRecord)