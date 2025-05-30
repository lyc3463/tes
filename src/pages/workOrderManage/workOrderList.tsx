import {useState} from "react";
import {Button, List, Space, Spin, Table} from "antd";

const WorkOrderList=()=>{
    const [loading, setLoading] = useState(false);
    const columns=[
        {
            title: 'ID',
            dataIndex: 'roomId',
            render: (text: any, record: any) => (
                <Button type="link" >{text}</Button>
            ),
        },
        {
            title: '日期',
            dataIndex: 'date',
        },
        {
            title: '报修租户',
            dataIndex: 'name',
        },
        {
            title: '报修园区',
            dataIndex: 'name',
        },
        {
            title: '报修内容',
            dataIndex: 'content',
        },
        {
            title: '工单状态',
            dataIndex: 'stutes',
        },
        {
            title: '跟进人',
            dataIndex: 'genjinren',
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>

                </Space>
            ),
        },
    ];
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                // rowClassName={(record, index) =>
                //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                // }
            />
        </Spin>
    )
}
export default WorkOrderList