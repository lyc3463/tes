import {Button, DatePicker, Input, List, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import dayjs from "dayjs";

const TenantInfo=(props:any)=>{
    const [loading,setLoading]=useState(false)
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [page,setPage]=useState(1);
    const [stutes,setStutes]=useState(0);
    const [openid,setOpenid]=useState('');
    const [phone,setPhone]=useState('');
    const [content,setContent]=useState('');

    const columns =[
        {
            title: '日期',
            dataIndex: 'messageTime',
            key: 'messageTime',
            render:(text:any,record:any)=>(
                <div>
                    {dayjs(text).format('YYYY-MM-DD')}
                </div>
            )
        },
        {
            title: '租户名称',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '消息内容',
            dataIndex: 'message_content',
            key: 'message_content',
            render:(text:any,record:any)=>(
                <Input.TextArea value={text}>

                </Input.TextArea>
            )
        },
        {
            title: '状态',
            dataIndex: 'messageStatus',
            key: 'messageStatus',
            render:(text:any,record:any)=>(
                <>
                    {record.messageStatus==0?<Tag color='red'>未读</Tag>:<Tag color='green'>已读</Tag>}
                </>
            )
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>(
                <Space>
                   <Button type='primary' danger>删除</Button>
                   <Button type='primary'>编辑</Button>
                </Space>
            )
        }
    ]
    const toadd=()=>{
        history.push('/propertyServerManage/addTenantInfo')
    };
    useEffect(() => {
        logFenye();
    }, [page]);

    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const logFenye=()=>{
        props.dispatch({
            type:"TenantInfo/fetch",
            payload:{page,content,phone,startDate,endDate,stutes,openid}
        })
    };
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:"TenantInfo/fenye",
            payload:{content,phone,startDate,endDate,stutes,openid}
        });
        logFenye();
    };
    const onChange=(e:any)=>{
      setPage(e)
    };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            通知用户
                        </Button>
                    </div>
                    <Space>
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
                                状态:
                            </div>
                            <Select
                                onChange={(e)=>setStutes(e)}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未读' },
                                    { value:2, label: '已读' },
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
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.TenantInfoList}
                // rowClassName={(record, index) =>
                //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                // }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TenantInfoList: state.TenantInfo.list,
        count: state.TenantInfo.count
    }
};
export default connect(mapStateToProps) (TenantInfo)