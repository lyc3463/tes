import {Button, Input, List, Select, Space, Table} from "antd";

const TimeMeterReading=()=>{
    const columns =[
        {
            title: '序号',
            dataIndex: 'xuhao',
            key: 'xuhao',
        },
        {
            title: '采集器编号',
            dataIndex: 'biaohao',
            key: 'biaohao',
        },
        {
            title: '通讯地址',
            dataIndex: 'dizhi',
            key: 'dizhi',
        },
        {
            title: '用户',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '定时设置',
            dataIndex: 'shezhe',
            key: 'shezhe',
        },
        {
            title: '下次执行时间',
            dataIndex: 'xiaci',
            key: 'xiaci',
        },
        {
            title: '创建时间',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '当前状态',
            dataIndex: 'stutes',
            key: 'stutes',
            fixed: 'right',
            width: 100,
        },
        {
            title: '上次执行结果',
            dataIndex: 'jieguo',
            key: 'jieguo',
            fixed: 'right',
            width: 100,
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            fixed: 'right',
            width: 150,
            render: (text:any, record:any) => {
                return(
                    <div>
                        {/*<a onClick={()=>{setDel(true)}}>删除</a>*/}
                        {/*<a onClick={()=>{setcx(true)}} style={{margin:'0 3px',color:'green'}}>重抄</a>*/}
                        {/*<a onClick={()=>{setrz(true)}}>抄表日志</a>*/}
                    </div>
                )
            },
        }
    ]
    return(
        <div>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="用户名称:"
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
                                    采集器:
                                </div>
                                <Select
                                    defaultValue="255"
                                    style={{ width: 120 }}
                                    options={[
                                        { value: '255', label: '全部' },

                                    ]}
                                />
                            </Space.Compact>
                            <Button type="primary">
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
export default TimeMeterReading