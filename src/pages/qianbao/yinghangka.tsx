import {Button, Input, List, Select, Space, Table} from "antd";
import {history} from "umi";

const Yinghangka=()=>{
    const columns =[
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '银行卡号',
            dataIndex: 'kahao',
            key: 'kahao',
        },
        {
            title: '预留手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '银行名称',
            dataIndex: 'yinhang',
            key: 'yinhang',
        },
        {
            title: '添加时间',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '是否为默认卡',
            dataIndex: 'istrue',
            key: 'istrue',
            render:(text:any,record:any)=>{
                return(
                    <div>
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            render:(text:any,record:any)=>{
                return(
                    <div>

                    </div>
                )
            }
        },
    ]
    const toadd=()=>{
        history.push('/qianbao/addYinghangka')
    }
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增银行卡
                        </Button>
                    </div>
                    <Space>
                        <Input

                            addonBefore="银行卡名称:"
                        />
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}} pagination={false}/>

        </div>
    )
}
export default Yinghangka