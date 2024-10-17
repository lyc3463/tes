import {Button, Input, Table, Form, List, Space, Pagination} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";

const Zuhulist=(props:any)=>{
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
export default connect(mapStateToProps) (Zuhulist)