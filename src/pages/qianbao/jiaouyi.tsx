import {DatePicker, Form, Select, Table} from "antd";

const Jiaouyi=()=>{
    const columns =[
        {
            title: '交易单号',
            dataIndex: 'danhao',
            key: 'danhao',
        },
        {
            title: '用户支付时间',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '总金额',
            dataIndex: 'jine',
            key: 'jine',
        },
        {
            title: '手续费',
            dataIndex: 'shouxufei',
            key: 'shouxufei',
        },
        {
            title: '退款金额',
            dataIndex: 'tuijine',
            key: 'tuijine',
        },
        {
            title: '结算金额',
            dataIndex: 'jiejine',
            key: 'jiejine',
        },
        {
            title: '交易说明',
            dataIndex: 'shuoming',
            key: 'shuoming',
        },
        {
            title: '交易状态',
            dataIndex: 'stutes',
            key: 'stutes',
            render:(text:any,record:any)=>{
                return(
                    <div>

                    </div>
                )
            }
        }
    ]
    return(
        <div>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px',display:'flex'}}>
                <Form.Item label='日期选择'>
                    <DatePicker.RangePicker/>
                </Form.Item>
                <Form.Item label='交易状态' style={{width:'250px',margin:'0 10px'}}>
                    <Select>
                    </Select>
                </Form.Item>
            </Form>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}} pagination={false}/>
        </div>
    )
}
export default Jiaouyi