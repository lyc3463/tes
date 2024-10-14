import {Button, Form, Input, List, Select, Space, Table} from "antd";
import {history} from "umi";

const WaterParameter=()=>{
    const columns =[
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '价格名',
            dataIndex: 'jiage',
            key: 'jiage',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            fixed: 'right',
            render: (text:any, record:any) => {
                return(
                    <div>

                    </div>
                )
            },
        }
    ]
    const toadd=()=>{
        history.push('/waterCableManage/addWaterParameter')
    }
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            创建水表参数
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="水表参数名称:"
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
export default WaterParameter