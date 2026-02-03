import {Button, Form, Input, List, message, Modal, Space, Spin, Table} from "antd";
import {connect, history} from "umi";
import {useEffect, useRef, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as PayTypeServices from '@/services/payType';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const PayType=(props)=>{
    const [name,setName]=useState(checkSessionStorage('/warehouse/warehouseAndType','payName') || '');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const formRef=useRef();
    const [eID,setEID]=useState(0);// 编辑的id
    const [didOpen,setDidOpen]=useState(false);// 删除确认弹窗是否打开
    const [did,setDid]=useState(0);// 删除的id
    const [eidOpen,setEidOpen]=useState(false);// 编辑确认弹窗是否打开
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const [pmName,setPmName]=useState('');
    const columns=[
        {
            title:'支付名称',
            dataIndex:'pmName',
            key:'pmName',
        },
        {
            title:'操作',
            dataIndex:'number',
            key:'number',
            render:(text,record)=>{
                return(
                    <Space>
                        <Button onClick={()=>isDelOpen(record.id)} danger type='primary'>删除</Button>
                        <Button onClick={()=>isEidOpen(record.id)} type='primary'>编辑</Button>
                    </Space>
                )
            }
        }
    ];
    // 删除的弹窗
    const isDelOpen=(e)=>{
        setDid(e);
        setDidOpen(true);
    };
    // 编辑的弹窗
    const isEidOpen=(e)=>{
        setEID(e);
        getOne(e);
        setEidOpen(true);
    };
    const toAdd=()=>{
        history.push('/warehouse/addPayType');
    };
    const getList=()=>{
        props.dispatch({
            type:'PayType/fetch',
            payload:{page, name, pageSize}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const changeName=(e:any)=>{
        setName(e.target.value);
        updateSessionStorage('/warehouse/warehouseAndType','payName',e.target.value);
    };
    // 删除确定按钮
    const onDok=()=>{
        setSpinning(true);
        props.dispatch({
            type:'PayType/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setDidOpen(false);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
                setDidOpen(false);
            }
        })
    };
    // 编辑的确定
    const onFinish=()=>{
        setSpinning(true);
        if (pmName=='') return message.error('请输入支付类型名称');
        props.dispatch({
            type:'PayType/edit',
            payload:{uid:eID,pmName}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('编辑成功');
                setSpinning(false);
                setEidOpen(false);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
                setEidOpen(false);
            }
        })
    };
    // 获取详情
    const getOne=(e:number)=>{
        setSpinning(true);
        PayTypeServices.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setSpinning(false);
                setPmName(res.Data.pmName);
                setEID(res.Data.id);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toAdd}>新增支付名称</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="名称:"
                            value={name}
                            onChange={changeName}
                        />
                        <Button type="primary" onClick={getList}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                dataSource={props.list}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {/*删除的弹窗*/}
            <Modal open={didOpen} onCancel={()=>setDidOpen(false)} onOk={onDok} title={'删除'} loading={spinning}>
                <div>是否要删除?</div>
            </Modal>
            <Modal open={eidOpen} onCancel={()=>setEidOpen(false)} title={'编辑'} loading={spinning} onOk={onFinish}>
                <Form
                    form={form}
                    ref={formRef}
                    layout="horizontal"
                    size={'large'}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label="支付类型名称">
                        <Input value={pmName} onChange={(e)=>setPmName(e.target.value)}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.PayType.list,
});
export default connect(mapStateToProps)(PayType);
