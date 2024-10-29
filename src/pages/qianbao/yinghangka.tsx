import {Button, Input, List, message, Modal, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";

const Yinghangka=(props:any)=>{
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
    const [uid,setUid]=useState(0);
    const [isOpen,setOpen]=useState(false);
    const [yhk,setYhk]=useState('');
    const columns =[
        {
            title: '户名',
            dataIndex: 'accountName',
            key: 'accountName',
        },
        {
            title: '银行卡号',
            dataIndex: 'cardNum',
            key: 'cardNum',
        },
        {
            title: '预留手机号',
            dataIndex: 'bankPhone',
            key: 'bankPhone',
        },
        {
            title: '银行名称',
            dataIndex: 'bankName',
            key: 'bankName',
        },
        {
            title: '是否为默认卡',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.isDefault==1?<Tag color='green'>是</Tag>:<Tag color='red'>否</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                        <Button type='primary' danger onClick={()=>isdelete(record)}>删除</Button>
                    </Space>
                )
            }
        },
    ]
    const toadd=()=>{
        history.push('/qianbao/addYinghangka')
    };
    const toedit=(e)=>{
      history.push(`/qianbao/editYinghangka?id=${e}`)
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Yinghangka/fetch",
            payload:{page,name,phone}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    const sousuo=()=>{
      setPage(1);
        logFenye();
    };
    // 删除的弹窗
    const isdelete=(e:any)=>{
        setUid(e.id);
        setYhk(e.cardNum);
        setOpen(true);
    };
    const onOk=()=>{
        props.dispatch({
            type:"Yinghangka/remove",
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false)
            }else {
                message.error(res.Data)
            }
        })
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增银行卡
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="银行卡号:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Input
                            addonBefore="预留手机号:"
                            onChange={(e)=>setPhone(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                dataSource={props.YinghangkaList}
                pagination={false}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        {/*    弹窗*/}
            <Modal open={isOpen} onOk={onOk} title='删除' onCancel={()=>setOpen(false)}>
                <div>是否要删除银行卡:<span style={{color:'red'}}>{yhk}</span></div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        YinghangkaList: state.Yinghangka.list
    }
};
export default connect(mapStateToProps) (Yinghangka)