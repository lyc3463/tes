import {Button, Input, List, Space, Table} from "antd";
import {history} from "umi";

const CableParameter=()=>{
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
    ];
    const toadd=()=>{
        history.push('/waterCableManage/addCableParameter')
    }
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            创建电表参数
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="电表参数名称:"
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
export default CableParameter