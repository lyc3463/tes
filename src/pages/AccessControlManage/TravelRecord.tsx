import {Button, DatePicker, Input, List, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";

const TravelRecord=(props:any)=>{
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [page,setPage]=useState(1);
    // 闸机编号
    const [deviceSn,setDeviceSn]=useState('');
    const columns = [
        {
            title: '闸机编号',
            dataIndex: 'position',
        },
        {
            title: '通行闸机',
            dataIndex: 'name',
        },
        {
            title: '人脸',
            dataIndex: 'house_name',
        },
        {
            title: '通行时间',
            dataIndex: 'date',
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (text: any, record: any) => (
                <Space>
                    <Button type='primary' danger>删除</Button>
                </Space>
            ),
        },
    ];
    // 监听时间
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 搜索
    const sousuo=()=>{
      setPage(1);
      props.display({
          type:'TravelRecord/fenye',
          dispatch:{deviceSn,startDate,endDate}
      })
        logFenye()
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"TravelRecord/fetch",
            payload:{page,deviceSn,startDate,endDate}
        })
    };
    useEffect(() => {
        logFenye()
    }, [page]);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="闸机编号:"
                            onChange={(e)=>{setDeviceSn(e.target.value)}}
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
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" onChange={sousuo}>
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