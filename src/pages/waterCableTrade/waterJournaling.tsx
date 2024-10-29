import {Button, Input, List, Space, Table} from "antd";

const WaterJournaling=(props)=>{
    const columns =[
        {
            title: '日期',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '电表编号',
            dataIndex: 'bianhao',
            key: 'bianhao',
        },
        {
            title: '用电量',
            dataIndex: 'dianliang',
            key: 'dianliang',
        },
    ];
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="电表编号:"
                        />
                        <Button type="primary">
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                dataSource={props.YinghangkaList}
                pagination={false}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
export default WaterJournaling