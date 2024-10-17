import {Button, Form, Input, Table, DatePicker, Space, List, Pagination} from "antd";
import {connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";

const SendingLog=(props:any)=>{
    const [current, setCurrent] = useState(1);
    const [phone,setPhone]=useState('');
    const [starTime,setStarTime]=useState('2000-01-01');
    const [endTime,setEndTime]=useState('2099-01-01');
    const columns =[
        {
            title: '接受者手机号',
            dataIndex: 'receiverPhone',
            key: 'receiverPhone',
        },
        {
            title: '发送时间',
            dataIndex: 'SendTime',
            key: 'SendTime',
            render: (_: any, record: any) => (
              <span>{dayjs(record.SendTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            ),
        },
        {
            title: '短信内容',
            dataIndex: 'smsContent',
            key: 'smsContent',
        },
        {
            title: '发送人',
            dataIndex: 'userName',
            key: 'userName',
        }
    ];
    const logFenye=()=>{
        props.dispatch({
            type:"SendingLog/fetch",
            payload:{current,phone,starTime,endTime}
        })
    };
    const onChange=(page)=>{
        setCurrent(page);
    };
    const changeDate = (item, data) => {
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStarTime('2000-01-01');
            setEndTime('2099-01-01');
        } else {
            setStarTime(data[0]);
            setEndTime(data[1]);
        }
    };
    const changePhone=(e)=>{
        setPhone(e.target.value)
    };
    const sousuo=()=>{
        setCurrent(1);
        props.dispatch({
           type:'SendingLog/fenye',
            payload:{phone,starTime,endTime}
        })
        logFenye();
    };
    useEffect(() => {
        logFenye();
    }, [current]);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <DatePicker.RangePicker onChange={changeDate}/>
                        <Input addonBefore="手机号:" onChange={changePhone}/>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.smsId}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                size='small'
                scroll={{y:'70vh'}}
                dataSource={props.SendingLogList}
                pagination={false}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={current}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        SendingLogList: state.SendingLog.list,
        count: state.SendingLog.count
    }
};
export default connect(mapStateToProps) (SendingLog)