import {Button, DatePicker, Input, List, Space, Table} from "antd";

const RechargeList=(props)=>{
    const columns =[
        {
            title: '充值时间',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '充值类型',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '充值金额',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '到账人',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '到账人联系方式',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '手动充值操作者',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '操作',
            dataIndex: 'item_name',
            key: 'item_name',
            render: (text:any, record:any) => {
                return(
                    <Button type='primary'>
                        删除记录
                    </Button>
                )
            }
        }
    ];
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="到账人:"
                        />
                        <Input
                            addonBefore="到账人联系方式:"
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
                            <DatePicker.RangePicker />
                        </Space.Compact>
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                dataSource={props.MovementCableList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
export default RechargeList