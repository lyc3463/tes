import {Button, Form, Input, Table, DatePicker, Space, List, Pagination} from "antd";
import {connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as SendingLogServer from "@/services/sendingLog";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const SmsList=(props:any)=>{
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setpageSize] = useState(50);
    const [phone,setPhone]=useState(checkSessionStorage('/message/sendingLog/','phonesms')||'');
    const [name,setName]=useState(checkSessionStorage('/message/sendingLog/','namesms')||'');
    const [startDate,setStartDate]=useState(checkSessionStorage('/message/sendingLog/','startDatesms')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/message/sendingLog/','endDatesms')||'2099-01-01');
    const [dataSource,setDataSource]=useState([]);
    const columns =[
        {
            title: '发送时间',
            dataIndex: 'created',
            key: 'created',
            render: (_: any, record: any) => (
                <span>{dayjs(record.created).format('YYYY-MM-DD HH:mm:ss')}</span>
            ),
        },
        {
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '短信内容',
            dataIndex: 'smsContent',
            key: 'smsContent',
        },

    ];
    const logFenye=()=>{
        SendingLogServer.fetchsms({page,name, phone, startDate, endDate, pageSize}).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                setDataSource(res.Data);
            }
        })
    };
    const onChange=(page,pageSize)=>{
        setPage(page);
        setpageSize(pageSize);
    };
    const changeDate = (item, data) => {
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/message/sendingLog/','startDatesms','2000-01-01');
            updateSessionStorage('/message/sendingLog/','endDatesms','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/message/sendingLog/','startDatesms',data[0]);
            updateSessionStorage('/message/sendingLog/','endDatesms',data[1]);
        }
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/message/sendingLog/','phonesms',e.target.value);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/message/sendingLog/','namesms',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const getFenyeInfo=()=>{
        SendingLogServer.fenyesms({name, phone, startDate, endDate, page, pageSize}).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                setCount(res.Data.count);
            }
        })
    };
    useEffect(() => {
        getFenyeInfo();
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
                        />
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
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
                                日期:
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
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                size='small'
                scroll={{y:'60vh'}}
                dataSource={dataSource}
                pagination={false}
            />
            <Pagination total={count} pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>
        </div>
    )
}

export default connect() (SmsList)