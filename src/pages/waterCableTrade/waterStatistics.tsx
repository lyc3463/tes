import {Button, DatePicker, Input, List, Select, Space, Table} from "antd";

const WaterStatistics=()=>{
    const columns =[
        {
            title: '日期',
            dataIndex: 'bianhao',
            key: 'bianhao',
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
        }
    ];
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
                                日期:
                            </div>
                            <DatePicker.RangePicker/>
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
export default WaterStatistics