import {Button, Input, List, Space, Table} from "antd";
import {history} from "umi";
const PayType=()=>{
    const columns=[
        {
            title:'类型名称',
            dataIndex:'name',
            key:'name',
        },
        {
            title:'户名',
            dataIndex:'number',
            key:'number',
        },
        {
            title:'银行卡号',
            dataIndex:'number',
            key:'number',
        },
        {
            title:'开户行',
            dataIndex:'number',
            key:'number',
        },
        {
            title:'预留手机号',
            dataIndex:'number',
            key:'number',
        },
        {
            title:'操作',
            dataIndex:'number',
            key:'number',
        },
    ];
    const toAdd=()=>{
        history.push('/warehouse/addPayType');
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toAdd}>新增支付类型</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="类型:"
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
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
export default PayType;