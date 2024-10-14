import {Button, Input, List, Space, Table} from "antd";
import {history} from "umi";

const WaterCableDosageSetup=()=>{
    const columns =[
        {
            title: '设置名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '检测周期',
            dataIndex: 'zhouqi',
            key: 'zhouqi',
        },
        {
            title: '报警触发条件',
            dataIndex: 'tiaojian',
            key: 'tiaojian',
        },
        {
            title: '报警静默期',
            dataIndex: 'jinmoqi',
            key: 'jinmoqi',
        },
        {
            title: '全局配置',
            dataIndex: 'peizhi',
            key: 'peizhi',
        },
        {
            title: '使用情况',
            dataIndex: 'qingkuang',
            key: 'qingkuang',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            fixed: 'right',
            width: 100,
            render: (text:any, record:any) => {
                return(
                    <div>

                    </div>
                )
            }
        }
    ]
    const toadd=()=>{
        history.push('/policeSetup/addWaterCableDosageSetup')
    }
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            添加报警用量参数
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="报警参数名称:"
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
export default WaterCableDosageSetup