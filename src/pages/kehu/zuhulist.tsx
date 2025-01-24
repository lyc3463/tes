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
            title: '身份证',
            dataIndex: 'tenant_card',
            key: 'tenant_card',
        },
        {
            title: '余额(元)',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: '积分(分)',
            dataIndex: 'integral',
            key: 'integral',
        },
        {
            title: '全部账单(元)',
            dataIndex: 'billMoney',
            key: 'billMoney',
        },
        {
            title: '公共押金(元)',
            dataIndex: 'deposit',
            key: 'deposit',
        },
    ];
    useEffect(() => {
        logFenye();
    }, []);
    useEffect(() => {
        console.log('props',props);
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
        logFenyeInfo();
        logFenye()
    };
    const onChange=(val:number)=>{
        setPage(val)
    };
    // 查看分页记录
    const logFenyeInfo=()=>{
        props.dispatch({
            type:'Zuhu/fetch',
            payload:{page,name,phone}
        });
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
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={1}
                            >
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                                总人数:{props.count?props.count.count:''}人
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {props.count?props.count.balanceSum:''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {props.count?props.count.integralSum:''}分
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.billMoneySum:''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={8}
                            >
                                {props.count?props.count.depositSum:''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
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