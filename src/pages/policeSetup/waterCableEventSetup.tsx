import {Button, Input, List, Select, Space, Table} from "antd";

const WaterCableEventSetup=()=>{
    const columns =[
        {
            title: '设备标号',
            dataIndex: 'biaohao',
            key: 'biaohao',
        },
        {
            title: '设备备注',
            dataIndex: 'beizhu',
            key: 'beizhu',
        },
        {
            title: '报警项',
            dataIndex: 'baojingxiang',
            key: 'baojingxiang',
        },
        {
            title: '触发时间',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '报警详情',
            dataIndex: 'info',
            key: 'info',
        },
        {
            title: '排查提示',
            dataIndex: 'tishi',
            key: 'tishi',
        },
        {
            title: '状态',
            dataIndex: 'stutes',
            key: 'stutes',
        }
    ]
    return(
        <div>
            <List>
                <List.Item>

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
                                报警类型:
                            </div>
                            <Select
                                defaultValue="255"
                                style={{ width: 120 }}

                                options={[
                                    { value: '255', label: '全部' },

                                ]}
                            />
                        </Space.Compact>
                        <Input
                            addonBefore="设备号:"
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

                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
export default WaterCableEventSetup