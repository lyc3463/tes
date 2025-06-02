import {Button, DatePicker, Input, List, Space, Spin, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";

const GoodsList=(props)=>{
    const [spinning,setspinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [tenantName,settenantName]=useState('');
    const [goodsName,setgoodsName]=useState('');
    const [userId,setuserId]=useState(0);
    const [uid,setUid]=useState(0);
    const columns =[
        {
            title: '租户名称',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            {record.tenant_name}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: '物品名称',
            dataIndex: 'goodName',
            key: 'goodName',
        },
        {
            title: '金额类型',
            dataIndex: 'goodType',
            key: 'goodType',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.goodType==2?<Tag color='green'>自定义金额</Tag>:<Tag color='blue'>固定金额</Tag>}
                    </div>
                )
            }
        },
        {
            title: '金额',
            dataIndex: 'goodMoney',
            key: 'goodMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.goodMoney}元
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        <Button onClick={()=>toedit(record.id)} type='primary'>编辑</Button>
                        <Button onClick={()=>isdelete(record.id)} type='primary'>删除</Button>
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/workOrderManage/addGoods');
    };
    const toedit=(record)=>{
        history.push(`/workOrderManage/editGoods?id=${record}`);
    };
    const isdelete=(e)=>{
        setUid(e);
    };
    const getGoodsList=()=>{
      props.dispatch({
          type:'Goods/fetch',
          payload:{userId,page,pageSize,tenantName,goodsName}
      })
    };
    const getGoodsFY=()=>{
        props.dispatch({
            type:'Goods/fenye',
            payload:{userId,pageSize,tenantName,goodsName}
        })
    };
    useEffect(() => {
        getGoodsList();
    }, [page,pageSize]);
    useEffect(() => {
        getGoodsFY();
    }, []);
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>添加物品</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="客户姓名:"
                        />
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                dataSource={props.GoodsList}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
            />

        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GoodsList: state.Goods.list,
        count: state.Goods.count
    }
};
export default connect(mapStateToProps) (GoodsList)