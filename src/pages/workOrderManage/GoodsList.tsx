import {Button, Space, Spin, Table, Tag} from "antd";
import {useState} from "react";
import dayjs from "dayjs";

const GoodsList=()=>{
    const [spinning,setspinning]=useState(false);
    const columns =[
        {
            title: '物品名称',
            dataIndex: 'created',
            key: 'created',

        },
        {
            title: '固定金额',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        <span style={{fontSize:'14px',color:'red'}}>{record.consumptionMoney}<span style={{fontSize:'12px',color:'#555'}}>元</span></span>
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
        },
    ];
    return(
        <Spin spinning={spinning}>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
            />
        </Spin>
    )
}
export default GoodsList