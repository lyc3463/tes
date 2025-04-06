import {Button, Form, Input, List, Modal, Radio, Select, Space, Spin, Table, Upload, message, Tabs} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {history,connect} from "umi";
import * as RegionService from '@/services/region';
import RenovationType from "@/ModelTypes/TypeRenovation";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Region=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false);
    // 编辑的弹窗
    const [isEditOpen,setInsEditOpen]=useState(false);
    // 需要修改的id
    const [uid,setUid]=useState<number|undefined>();
    // form 实例
    const formRef=useRef();
    // 删除的弹窗
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    // 删除的id
    const [did,setDid]=useState<number|undefined>();
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns=[
        {
            title: '区域名称',
            dataIndex: 'area_name',
        },
        // {
        //     title: '显示在小程序',
        //     dataIndex: 'areaStatus',
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
                    {uqx[130]=='1'?<Button type='primary' onClick={()=>isEdit(record)}>编辑</Button>:''}
                    {uqx[131]=='1'?<Button type='primary' danger onClick={()=>isDelete(record)}>删除</Button>:''}
                </Space>
            ),
        },
    ];
    // 详情
    const isEdit=async (e:any)=>{
        setUid(e.id);
        setInsEditOpen(true);
        let res:any=await RegionService.one(e?.id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
        }else {
            message.error(res.Data);
        }
    };
    const toadd=()=>{
        history.push('/appletManage/addRegion');
    };
    // 修改
    const onFinsh=(values:any)=>{
        setIsLoading(true);
        props.dispatch({
            type:'Region/edit',
            payload:{...values,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('编辑成功');
                setIsLoading(false);
                setInsEditOpen(false);
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    // 删除的弹窗
    const isDelete=async (record:RenovationType)=>{
        setDid(record.id);
        setIsDeleteOpen(true);
    };
    // 确定删除的确定
    const deleteOK= ()=>{
        setIsLoading(true);
        props.dispatch({
            type:'Region/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsLoading(false);
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
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
                            {uqx[129]=='1'?<Button type="primary" onClick={toadd}>添加区域</Button>:''}
                        </div>
                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={false}
                    dataSource={props.RegionList}
                    scroll={{y:'70vh'}}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
            </Spin>
            {/*编辑的弹窗*/}
            <Modal open={isEditOpen} title={'编辑区域'} onCancel={()=>setInsEditOpen(false)} onOk={()=>setInsEditOpen(false)} footer={null}>
                <Form ref={formRef} onFinish={onFinsh}>
                    <Form.Item label="id" name='id' style={{display:'none'}}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="区域名称" name='area_name'>
                        <Input/>
                    </Form.Item>
                    {/*<Form.Item label="是否显示在小程序" name='areaStatus'>*/}
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
        RegionList: state.Region.list
    }
};
export default  connect(mapStateToProps)(Region)