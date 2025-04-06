import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, List, message, Modal, Radio, Select, Space, Spin, Table, Tabs} from "antd";
import {history,connect} from "umi";
import * as CharacteristicService from "@/services/characteristic";
import CharacteristicType from "@/ModelTypes/TypeCharacteristic";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import Region from "@/pages/appletManage/region";
const park_id=sessionStorage.getItem('park_id')
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Characteristic=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    // 编辑的弹窗
    const [isEditOpen,setInsEditOpen]=useState(false)
    // 搜索的名称（特色名称）
    const [CharacteristicName,setCharacteristicName]=useState('')
    // 需要修改的id
    const [uid,setUid]=useState<number|undefined>()
    // 删除的弹窗
    const [isDeleteOpen,setIsDeleteOpen]=useState(false)
    // 删除的id
    const [did,setDid]=useState<number|undefined>()
    // form 实例
    const formRef=useRef();
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns=[

        {
            title: '区域名称',
            dataIndex: 'feature_name',
        },
        // {
        //     title: '显示在小程序',
        //     dataIndex: 'TSStatus',
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
                    {uqx[136]=='1'?<Button type='primary' onClick={()=>isEdit(record)}>编辑</Button>:''}
                    {uqx[137]=='1'?<Button type='primary' danger onClick={()=>isDelete(record)}>删除</Button>:''}
                </Space>
            ),
        },
    ];
    // 删除的弹窗
    const isDelete=async (record:CharacteristicType)=>{
        setDid(record.id)
        setIsDeleteOpen(true)
    }
    // 确定删除
    const deleteOK=()=>{
        setIsLoading(true);
        props.dispatch({
            type:'Characteristic/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
           if (res?.ErrorCode==0){
               message.success('删除成功');
               setIsDeleteOpen(false);
               setIsLoading(false);
           }else {
               message.error(res.Data);
               setIsLoading(false);
           }
       })

    };
    const toadd=()=>{
        history.push('/appletManage/addCharacteristic')
    };
    // 修改
    const onFinsh= (values:any)=>{
        setIsLoading(true);
        props.dispatch({
            type:'Characteristic/edit',
            payload: {...values,uid}
        }).then((res:TypeErrorCode)=>{
            if (res?.ErrorCode==0){
                message.success('修改成功');
                setInsEditOpen(false);
                setIsLoading(false);
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    // 详情
    const isEdit=async (e:any)=>{
        setUid(e.id)
        setInsEditOpen(true)
        let res:any=await CharacteristicService.one(e?.id)
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res.Data)
        }else {
            message.error(res.Data)
        }
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <div>
            <Spin spinning={isLoading}>
                <List>
                    <List.Item>
                        <div>
                            {uqx[135]=='1'?<Button type="primary" onClick={toadd}>添加特色</Button>:''}
                        </div>
                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={false}
                    scroll={{y:'70vh'}}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                    dataSource={props.CharacteristicList}
                />
            </Spin>
            {/*编辑的弹窗*/}
            <Modal open={isEditOpen} title={'编辑特色'} onCancel={()=>setInsEditOpen(false)} onOk={()=>setInsEditOpen(false)} footer={null}>
                <Form ref={formRef} onFinish={onFinsh}>
                    <Form.Item label="所属园区" name='parkId' style={{display:'none'}}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="id" name='id' style={{display:'none'}}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="特色名称" name="feature_name">
                        <Input placeholder="例:性价比高"/>
                    </Form.Item>
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
        CharacteristicList: state.Characteristic.list
    }
};
export default  connect(mapStateToProps)(Characteristic)