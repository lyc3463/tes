import {Button, DatePicker, Input, List, message, Modal, Space, Spin, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const GoodsList=(props)=>{
    const [spinning,setspinning]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [tenantName,settenantName]=useState('');
    const [goodsName,setgoodsName]=useState('');
    const [userId,setuserId]=useState(0);
    const [uid,setUid]=useState(0);
    const [dOpen,setDoepn]=useState(false);
    const columns =[
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
                        <Button onClick={()=>isdelete(record.id)} type='primary' danger>删除</Button>
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
        setDoepn(true);
    };
    const getGoodsList=()=>{
      props.dispatch({
          type:'Goods/fetch',
          payload:{userId,page,pageSize,tenantName,goodsName}
      })
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'Goods/remove',
            payload:uid,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setspinning(false);
                setDoepn(false);
                getGoodsList();
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getGoodsList();
    }, [page,pageSize]);
    const sousuo=()=>{
        setPage(1);
        getGoodsList();
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>添加物品</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="物品名称:"
                            value={goodsName}
                            onChange={(e)=>setgoodsName(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
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
            <Modal open={dOpen} loading={spinning} onCancel={()=>setDoepn(false)} onOk={onOK}>
                <div>
                    确定删除吗？
                </div>
            </Modal>
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