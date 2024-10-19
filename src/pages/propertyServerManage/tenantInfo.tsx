import {Button, DatePicker, Input, List, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import dayjs from "dayjs";

const TenantInfo=(props:any)=>{
    const [loading,setLoading]=useState(false)

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
                            <DatePicker.RangePicker/>
                        </Space.Compact>
                        <Button type="primary" /*onClick={sousuo}*/>
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