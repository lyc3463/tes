import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, List, message, Modal, Radio, Select, Space, Spin, Table} from "antd";
import {history,connect} from 'umi'
import * as RenovationService from "@/services/renovation";
import RenovationType from "@/ModelTypes/TypeRenovation";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Renovation=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    // 修改的弹窗
    const [isEditOpen,setInsEditOpen]=useState(false);
    // 删除的弹窗
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    // 搜索名称的输入框
    const [RenovationName,setRenovationName]=useState('');
    // 需要修改的id
    const [uid,setUid]=useState<number|undefined>();
    // 删除的id
    const [did,setDid]=useState<number|undefined>();
    // form 实例
    const formRef=useRef();
    const [name,setName]=useState('');
    const columns=[
        {
            title: '装修名称',
            dataIndex: 'renovation_name',
        },
        // {
        //     title: '显示在小程序',
        //     dataIndex: 'ZXStatus',
        //     render: (text: any, record: any) => (
        //         <div>
        //             {text?<span style={{color:'green'}}>是</span>:<span style={{color:'red'}}>否</span>}
        //         </div>
        //     ),
        // },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    <Space>
                        <Button type='primary' onClick={()=>isEdit(record)}>编辑</Button>
                        <Button type='primary' danger onClick={()=>isDelete(record)}>删除</Button>
                    </Space>
                </Space>
            ),
        },
    ];
    const toadd=()=>{
        history.push('/appletManage/addRenovation')
    };
    // 删除的弹窗
   const isDelete=async (record:RenovationType)=>{
       setDid(record.id)
       setIsDeleteOpen(true)
   };
   // 确定删除的确定
    const deleteOK=async ()=>{
        props.dispatch({
            type:'Renovation/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsLoading(false);
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data);
                setIsDeleteOpen(false);
            }
        })
    };
    // 点击编辑获取详情信息
    const isEdit=async (e:any)=>{
        setUid(e.id);
        setInsEditOpen(true);
        RenovationService.one(e.id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                formRef.current.setFieldsValue(res?.Data)
            }else {
                message.error(res.Data)
            }
        });
    };
    // 修改的提交
    const onFinsh=(values:any)=>{
       setIsLoading(true);
       props.dispatch({
           type:'Renovation/edit',
           payload:{...values,uid}
       }).then((res:TypeErrorCode)=>{
           if (res.ErrorCode==0){
               message.success('修改成功');
               setIsLoading(false);
               setInsEditOpen(false);
           }else {
               message.error(res.Data);
               setIsLoading(false);
           }
       })
    };
   const logfenye=()=>{
       props.dispatch({
           type:'Renovation/fetch',
           payload:{name}
       })
    };
    useEffect(() => {
        logfenye();
    }, []);
    const sousuo=()=>{
      logfenye();
    };
    return(
        <div>
            <Spin spinning={isLoading}>
                <List>
                    <List.Item>
                        <div>
                            <Button type="primary" onClick={toadd}>
                                添加装修
                            </Button>
                        </div>
                        <Space>
                            <Input
                                onChange={(e)=>setName(e.target.value)}
                                addonBefore="名称:"
                            />
                            <Button type='primary' onClick={sousuo}>搜索</Button>
                        </Space>
                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={false}
                    scroll={{y:'70vh'}}
                    dataSource={props.RenovationList}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
            </Spin>
            {/*编辑的弹窗*/}
            <Modal open={isEditOpen} title={'编辑装修'} onCancel={()=>setInsEditOpen(false)} onOk={()=>setInsEditOpen(false)} footer={null}>
                <Form ref={formRef} onFinish={onFinsh}>
                    <Form.Item label="id" name='id' style={{display:'none'}}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="装修名称" name="renovation_name">
                        <Input />
                    </Form.Item>
                    {/*<Form.Item label="是否显示在小程序" name='ZXStatus'>*/}
                    {/*    <Radio.Group>*/}
                    {/*        <Radio value={1}>是</Radio>*/}
                    {/*        <Radio value={0}>否</Radio>*/}
                    {/*    </Radio.Group>*/}
                    {/*</Form.Item>*/}
                    <Form.Item {...tailLayout}>
                        <Button type="primary"  htmlType="submit">
                            修改
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/*删除的弹窗*/}
            <Modal open={isDeleteOpen} onOk={deleteOK} onCancel={() => setIsDeleteOpen(false)} title='删除'>
                <div>是否要删除此数据?</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RenovationList: state.Renovation.list
    }
};
export default connect(mapStateToProps)(Renovation)