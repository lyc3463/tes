import {Button, Form, Input, List, Pagination, Space, Table, Tag} from "antd";
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
        {
            title: '关联状态',
            dataIndex: 'open_id',
            key: 'open_id',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        {
                            record.open_id?<Tag color='green'>已关联</Tag>:<Tag color='red'>用户未登录</Tag>
                        }
                    </Space>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'caoz',
            key: 'caoz',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        <Button type='link' onClick={()=>toguanlian(record.id)}>关联</Button>
                        <Button type='link' onClick={()=>toyajinlist(record.id)}>押金列表</Button>
                    </Space>
                )
            }
        }
    ];
    // 去关联页面
    const toguanlian=(e:number)=>{
        history.push(`/kehu/byzhuhu?id=${e}`)
    };
    // 去关联页面
    const toyajinlist=(e:number)=>{
        history.push(`/kehu/yajinlist?id=${e}`)
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    useEffect(() => {
        logFenyeInfo();
    }, []);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page,name,phone}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        logFenyeInfo();
        logFenye()
    };
    // 查看分页记录
    const logFenyeInfo=()=>{
        props.dispatch({
            type:'BYZhuhu/fenye',
            payload:{page,name,phone}
        });
    };
    const onChange=(val:number)=>{
        setPage(val);
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
                scroll={{x:1500,y:'60vh'}}
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
        ZuhuList: state.BYZhuhu.list,
        count: state.BYZhuhu.count,
    }
};
export default connect(mapStateToProps) (Zuhuguanlian)