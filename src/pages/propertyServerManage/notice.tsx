import {Button, Input, List, Select, Space, Spin, Table} from "antd";
import TypeNotice from "@/ModelTypes/TypeNotice";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import dayjs from "dayjs";

const Notice=(props:any)=>{
    const [loading,setLoading]=useState(false)
    // 去添加页面
    const tianjia=()=>{
        history.push('/propertyServerManage/addNotice')
    }
    const toinfo=(e:number)=>{
        history.push(`/propertyServerManage/editNotice?id=${e}`)
    }
    const columns =[
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (_: any, record: any) => (
                <Button type="link" onClick={()=>toinfo(record.id)}>{record.id}</Button>
            ),
        },
        {
            title: '日期',
            dataIndex: 'noticeDate',
            key: 'noticeDate',
            render: (_, record: any) => (
                <span>{dayjs(record.noticeDate).format('YYYY-MM-DD')}</span>
            ),
        },
        {
            title: '消息内容',
            dataIndex: 'notice_content',
            key: 'notice_content',
            render: (_: any, record: any) => (
               <Input.TextArea defaultValue={record.notice_content}/>
            ),
        },
        {
            title: '状态',
            dataIndex: 'park_status',
            key: 'park_status',
            render:(_:any,record:any)=>{
                return(
                    <Space>
                     {record.park_status? <span style={{color:'green'}}>已发布</span>:<span style={{color:"red"}}>未发布</span>}
                    </Space>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(_:any,record:any)=>{
                return(
                    <Space>
                        <Button type='primary' style={{backgroundColor:"red"}}>删除</Button>
                    </Space>
                )
            }
        },
    ]

    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={tianjia}>
                            添加园区公告
                        </Button>
                    </div>
                    <Space>
                        <Input
                            // onChange={cggsname}
                            addonBefore="园区内容:"
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
                                状态:
                            </div>
                            <Select
                                defaultValue="255"
                                style={{ width: 120 }}
                                // onChange={tiaojiancg}
                                options={[
                                    { value: '255', label: '全部' },
                                    { value: '1', label: '条件' },
                                ]}
                            />
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
                dataSource={props.NoticeList}
                // rowClassName={(record, index) =>
                //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                // }
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        NoticeList: state.Notice.list
    }
};
export default connect(mapStateToProps) (Notice)