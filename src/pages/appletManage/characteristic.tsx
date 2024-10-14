import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, List, message, Modal, Radio, Select, Space, Spin, Table} from "antd";
import {history,connect} from "umi";
import * as CharacteristicService from "@/services/characteristic";
import CharacteristicType from "@/ModelTypes/TypeCharacteristic";
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
    const formRef=useRef()
    const columns=[
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text: any, record: any) => (
                <Button type="link" >{text}</Button>
            ),
        },
        {
            title: '区域名称',
            dataIndex: 'feature_name',
        },
        {
            title: '显示在小程序',
            dataIndex: 'TSStatus',
            render: (text: any, record: any) => (
                <div>
                    {text?<span style={{color:'green'}}>是</span>:<span style={{color:'red'}}>否</span>}
                </div>
            ),
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    <Button type='primary' onClick={()=>isEdit(record)}>编辑</Button>
                    <Button type='primary' danger onClick={()=>isDelete(record)}>删除</Button>
                </Space>
            ),
        },
    ]
    // 删除的弹窗
    const isDelete=async (record:CharacteristicType)=>{
        setDid(record.id)
        setIsDeleteOpen(true)
    }
    // 确定删除
    const deleteOK=async ()=>{
        let res=await props.dispatch({
            type:'Characteristic/remove',
            payload:did
        })
        if (res?.ErrorCode==0){
            message.success('删除成功')
            setIsDeleteOpen(false)
        }
    }
    const toadd=()=>{
        history.push('/appletManage/addCharacteristic')
    }
    // 修改
    const onFinsh=async (values:any)=>{
        let res=await props.dispatch({
            type:'Characteristic/edit',
            payload: {...values,uid}
        })
        if (res?.ErrorCode==0){
            message.success('修改成功')
            setInsEditOpen(false)
        }
    }
    // 详情
    const isEdit=async (e:any)=>{
        setUid(e.id)
        setInsEditOpen(true)
        let res=await CharacteristicService.one(e?.id)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    }
    return(
        <div>
            <Spin spinning={isLoading}>
                <List>
                    <List.Item>
                        <div>
                            <Button type="primary" onClick={toadd}>
                                添加特色
                            </Button>
                        </div>
                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={false}
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

                    <Form.Item label="是否显示在小程序" name='TSStatus'>
                        <Radio.Group>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </Radio.Group>
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