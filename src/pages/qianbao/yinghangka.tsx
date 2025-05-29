import {Button, Input, List, message, Modal, Select, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const Yinghangka=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(sessionStorage.getItem('qianbaoYinghangkaName')||'');
    const [phone,setPhone]=useState(sessionStorage.getItem('qianbaoYinghangkaPhone')||'');
    const [uid,setUid]=useState(0);
    const [isOpen,setOpen]=useState(false);
    const [yhk,setYhk]=useState('');
    const [did,setDid]=useState(0);
    const [isOffOpen,setisOffOpen]=useState(false);
    const [isONOpen,setisONOpen]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
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
            title: '开户行',
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
            title: '切换默认卡号',
            dataIndex: 'offon',
            key: 'offon',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.isDefault==1?<Button onClick={()=>offOpen(record.id)} type='primary' danger >关闭默认</Button>:<Button type='primary' onClick={()=>onOpen(record.id)}>开启默认</Button>}
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
                        {uqx[301]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button> :''}
                        {uqx[171]=='1'?<Button type='primary' danger onClick={()=>isdelete(record)}>删除</Button> :''}
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
            payload:{page,name,phone,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
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
    // 关闭默认
    const offOpen=(e:number)=>{
      setDid(e);
      setisOffOpen(true)
    };
    // 关闭默认OK
    const onOffOK=()=>{
        props.dispatch({
            type:'Yinghangka/onisoff',
            payload:{did,stutes:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('关闭成功');
                setisOffOpen(false);
            }else {
                message.error(res.Data);
                setisOffOpen(false);
            }
        })
    };
    // 开启是弹窗
    const onOpen=(e)=>{
      setDid(e);
      setisONOpen(true);
    };
    const onOnOK=()=>{
        props.dispatch({
            type:'Yinghangka/onisoff',
            payload:{did,stutes:1}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('开启成功');
                setisONOpen(false);
            }else {
                message.error(res.Data);
                setisONOpen(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setName(e.target.value);
        sessionStorage.setItem('qianbaoYinghangkaName',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        sessionStorage.setItem('qianbaoYinghangkaPhone',e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        {uqx[300]=='1'? <Button type="primary" onClick={toadd}>新增银行卡</Button>:''}
                    </div>
                    <Space>
                        <Input
                            addonBefore="银行卡号:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="预留手机号:"
                            onChange={changePhone}
                            value={phone}
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
        {/*    删除弹窗*/}
            <Modal open={isOpen} onOk={onOk} title='删除' onCancel={()=>setOpen(false)}>
                <div>是否要删除银行卡:<span style={{color:'red'}}>{yhk}</span></div>
            </Modal>
            {/*关闭默认是弹窗*/}
            <Modal open={isOffOpen} onOk={onOffOK} onCancel={()=>setisOffOpen(false)}>
                <div>是否要关闭默认?</div>
            </Modal>
            {/*关闭默认是弹窗*/}
            <Modal open={isONOpen} onOk={onOnOK} onCancel={()=>setisONOpen(false)}>
                <div>是否要关闭默认?</div>
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