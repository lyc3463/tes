import {Button, DatePicker, Form, Pagination, Select, Table,Input} from "antd";
const Alljiaoyi=()=>{
    const columns =[
        {
            title: '类型',
            dataIndex: 'stutes',
            key: 'stutes',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.stutes}
                    </div>
                )
            }
        },
        {
            title: '交易单号',
            dataIndex: 'danhao',
            key: 'danhao',
        },
        {
            title: '系统交易单号',
            dataIndex: 'xitongdanhao',
            key: 'xitongdanhao',
        },
        {
            title: '用户支付时间',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '手续费',
            dataIndex: 'shouxufei',
            key: 'shouxufei',
        },
        {
            title: '退款金额',
            dataIndex: 'tuikuan',
            key: 'tuikuan',
        },
        {
            title: '结算金额',
            dataIndex: 'jine',
            key: 'jine',
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
                        {record.stutes==1?<a style={{marginRight:'10px',color:'green'}}>交易成功</a>:<a style={{color:'red'}}>交易失败</a>}
                    </div>
                )
            }
        }
    ]
    return(
        <div>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <div style={{display:"flex"}}>
                    <Form.Item label='日期范围'>
                        <DatePicker.RangePicker/>
                    </Form.Item>
                    <Form.Item label='快速搜索' style={{marginLeft:'10px'}}>
                        <DatePicker/>
                    </Form.Item>
                </div>
                <div style={{display:'flex'}}>
                    <Form.Item label='类型' style={{width:'20vw'}}>
                        <Select/>
                    </Form.Item>
                    <Form.Item label='交易单号查询' style={{margin:'0 10px',width:'20vw'}}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='交易状态' style={{width:'20vw'}}>
                        <Select/>
                    </Form.Item>
                </div>
                <Form.Item >
                    <Button type='primary' style={{marginRight:'5px'}}>查询</Button>
                    <Button>导出</Button>
                </Form.Item>
            </Form>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}} />
            <div style={{marginTop:'10px'}}>
                <Pagination defaultCurrent={1} total={50}/>
            </div>
        </div>
    )
}
export default Alljiaoyi