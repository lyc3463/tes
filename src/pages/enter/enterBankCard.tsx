import {Button, DatePicker, Input, List, Space, Spin, Table} from "antd";
import {useState} from "react";
import {history} from "umi";
import dayjs from "dayjs";
const EnterBankCard=()=>{
    const [spinning,setSpinning]=useState(false);
    const toadd=()=>{
      history.push('/enter/addBankCard');
    };
    const columns=[
        {
            title: '租户姓名',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
        },
        {
            title: '银行卡号',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
        },
        {
            title: '预留手机号',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
        },
        {
            title: '户名',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
        },
        {
            title: '开户行',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
        },
        {
            title: '操作',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
            render: (text, record) => (
                <Space>
                    <Button type="primary">
                        编辑
                    </Button>
                    <Button type="primary" danger>
                        删除
                    </Button>
                </Space>
            )
        },
    ];
    return(
        <Spin spinning={spinning}>
           <List>
               <List.Item>
                   <div>
                       <Button type="primary" onClick={toadd}>银行卡录入</Button>
                   </div>
                   <Space>
                       <Input
                           addonBefore="租户姓名:"
                       />
                       <Space.Compact>

                       </Space.Compact>

                       <Button type="primary">
                           搜索
                       </Button>
                   </Space>
               </List.Item>
           </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
            />
        </Spin>
    )
}
export default EnterBankCard;