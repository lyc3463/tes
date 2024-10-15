import {Button, Form, Input, Space, Table} from "antd";
import {connect,history} from "umi";
import {useEffect} from "react";

const Zuhuguanlian=(props:any)=>{
    const columns =[
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '身份证号',
            dataIndex: 'tenant_card',
            key: 'tenant_card',
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
        {
            title: '操作',
            dataIndex: 'caoz',
            key: 'caoz',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        <Button type='link' onClick={()=>toguanlian(record.id)}>关联</Button>
                    </Space>
                )
            }
        }
    ];
    // 去关联页面
    const toguanlian=(e:number)=>{
        history.push(`/kehu/byzhuhu?id=${e}`)
    };
    useEffect(() => {
        console.log(props)
    }, []);
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
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.ZuhuList}
                scroll={{x:1500}}
                pagination={false}
            />
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.Zuhu.list
    }
};
export default connect(mapStateToProps) (Zuhuguanlian)