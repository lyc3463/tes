import {Button, DatePicker, Form, Modal, Pagination, Select, Table,Input} from "antd";
const Yiruzhang=()=>{
    const columns =[
        {
            title: '系统转账单号',
            dataIndex: 'danhao',
            key: 'danhao',
        },
        {
            title: '收款钱包',
            dataIndex: 'qianbao',
            key: 'qianbao',
        },
        {
            title: '真实姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '总金额',
            dataIndex: 'jine',
            key: 'jine',
        },
        {
            title: '转账手续费',
            dataIndex: 'shouxu',
            key: 'shouxu',
        },
        {
            title: '实际到账金额',
            dataIndex: 'daozhang',
            key: 'daozhang',
        },
        {
            title: '入账时间',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '转账说明',
            dataIndex: 'beizhu',
            key: 'beizhu',
        },
        {
            title: '转账状态',
            dataIndex: 'stutes',
            key: 'stutes',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.stutes==1?<a style={{marginRight:'10px',color:'green'}}>交易成功</a>:<a style={{color:'red'}}>交易失败</a>}
                    </div>
                )
            }
        },
        {
            title: '错误信息',
            dataIndex: 'info',
            key: 'info',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            fixed: 'right',
            render:(_:any,record:any)=>{
                return(
                    <div>


                    </div>
                )
            }
        }
    ]
    return(
        <div>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <div style={{display:'flex'}}>
                    <Form.Item label='日期范围'>
                        <DatePicker.RangePicker/>
                    </Form.Item>
                    <Form.Item label='快速选择' style={{margin:'0 10px'}}>
                        <DatePicker/>
                    </Form.Item>
                </div>
                <div style={{display:'flex'}}>
                    <Form.Item label='单号类型' style={{width:'20vw'}}>
                        <Select/>
                    </Form.Item>
                    <Form.Item label='交易单号查询'  style={{width:'20vw',margin:'0 10px'}}>
                        <Input placeholder='交易单号'/>
                    </Form.Item>
                    <Form.Item label='转账状态'  style={{width:'20vw'}}>
                        <Select/>
                    </Form.Item>
                </div>
                <div style={{display:'flex'}}>
                    <Form.Item label='钱包' style={{width:'20vw'}}>
                        <Select/>
                    </Form.Item>
                    <Form.Item label='代付状态' style={{width:'20vw',margin:'0 10px'}}>
                        <Select/>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' style={{marginRight:"10px"}}>查询</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" >导出到Excel</Button>
                    </Form.Item>
                </div>
            </Form>
            <div>
            </div>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}} />
        </div>
    )
}
export default Yiruzhang