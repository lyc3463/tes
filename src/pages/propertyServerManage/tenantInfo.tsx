import {Button, DatePicker, Input, List, Select, Space, Spin, Table, Tag} from "antd";
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
        console.log(props)
    }, []);

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
    const sousuo=()=>{

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
                        <Input
                            // onChange={cggsname}
                            addonBefore="租户名称:"
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TenantInfoList: state.TenantInfo.list
    }
};
export default connect(mapStateToProps) (TenantInfo)