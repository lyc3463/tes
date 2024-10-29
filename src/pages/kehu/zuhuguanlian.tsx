import {Button, Form, Input, List, Pagination, Space, Table} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";

const Zuhuguanlian=(props:any)=>{
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [page,setPage]=useState(1);
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
            title: '身份证',
            dataIndex: 'tenant_card',
            key: 'tenant_card',
        },
        {
            title: '余额',
            dataIndex: 'appUser_balance',
            key: 'appUser_balance',
        },
        {
            title: '积分',
            dataIndex: 'appUser_integral',
            key: 'appUser_integral',

        },
        {
            title: '账单',
            dataIndex: 'appUser_bill',
            key: 'appUser_bill',
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
        logFenye();
    }, []);
    useEffect(() => {
    }, [page]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Zuhu/fetch",
            payload:{page,name,phone}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Zuhu/fetch',
            payload:{page,name,phone}
        });
        logFenye()
    };
    const onChange=(val:number)=>{
        setPage(val)
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Input
                            addonBefore="手机号:"
                            onChange={(e)=>setPhone(e.target.value)}
                        />
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.ZuhuList}
                scroll={{x:1500}}
                pagination={false}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}

        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.Zuhu.list,
        count: state.Zuhu.count,
    }
};
export default connect(mapStateToProps) (Zuhuguanlian)