import {Button, Input, Table,Form} from "antd";
import {connect} from "umi";
import {useEffect} from "react";

const Zuhulist=(props:any)=>{
    const columns =[
        {
            title: '标签名称',
            dataIndex: 'pjname',
            key: 'pjname',
        },
        {
            title: '租户姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '余额',
            dataIndex: 'yue',
            key: 'yue',
        },
        {
            title: '积分',
            dataIndex: 'jifen',
            key: 'jifen',
        },
        {
            title: '账单金额',
            dataIndex: 'zhangdan',
            key: 'zhangdan',
        },
        {
            title: '分期',
            dataIndex: 'feniq',
            key: 'feniq',
        },
        {
            title: '优惠',
            dataIndex: 'youhui',
            key: 'youhui',
        },
        {
            title: '房屋面积(m²)',
            dataIndex: 'mianji',
            key: 'mianji',
        },
        {
            title: '租金(元)',
            dataIndex: 'zujin',
            key: 'zujin',
        },
        {
            title: '押金',
            dataIndex: 'yajin',
            key: 'yajin',
        },
    ];
    useEffect(() => {
        console.log(props)
    }, []);
    return(
        <div>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px',display:'flex'}}>
                <Form.Item style={{width:'20vw'}} label='租户姓名'>
                    <Input/>
                </Form.Item>
                <Form.Item style={{width:'20vw',margin:'0 10px'}} label='租户电话'>
                    <Input/>
                </Form.Item>
                <Form.Item >
                    <Button type='primary'>查询</Button>
                </Form.Item>
            </Form>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}}  scroll={{x:1500}} pagination={false}/>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.Zuhu.list
    }
};
export default connect(mapStateToProps) (Zuhulist)