import {Button, Form, Input, Table} from "antd";

const Zuhuguanlian=()=>{
    const columns =[
        {
            title: '用户ID',
            dataIndex: 'ID',
            key: 'ID',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '身份证号',
            dataIndex: 'accedit',
            key: 'accedit',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '安装地址',
            dataIndex: 'adddizhi',
            key: 'adddizhi',
        },
        {
            title: '通讯地址',
            dataIndex: 'tongxu',
            key: 'tongxu',
        },
        {
            title: '关联信息',
            dataIndex: 'bianbiao',
            key: 'bianbiao',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '在线支付',
            dataIndex: 'zhifu',
            key: 'zhifu',
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
        }
    ]
    return(
        <div>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <div style={{display:'flex'}}>
                    <Form.Item label='手机号' style={{width:'20vw'}}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='姓名' style={{width:'20vw',margin:'0 10px'}}>
                        <Input/>
                    </Form.Item>
                </div>
                <div style={{display:'flex'}}>
                    <Form.Item>
                        <Button type='primary'>查询</Button>
                    </Form.Item>
                    <Form.Item style={{margin:'0 10px'}}>
                        <Button type='primary'>重置</Button>
                    </Form.Item>
                </div>
            </Form>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}} pagination={false}/>
        </div>
    )
}
export default Zuhuguanlian