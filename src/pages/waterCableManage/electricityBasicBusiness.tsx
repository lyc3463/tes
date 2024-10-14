import {useEffect, useRef, useState} from "react";
import {useLocation,connect} from 'umi'
import {history} from "@@/core/history";
import {Button, Form, Input, Modal, Select, Space} from "antd";
import * as CableServer from "@/services/cable";
import {off} from "@/services/cable";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const ElectricityBasicBusiness=(props:any)=>{
    const location=useLocation();
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 拉闸弹窗
    const [lazha,setlazha]=useState(false)
    // 合闸弹窗
    const [hezha,sethezha]=useState(false)

    // 获取单个电表详情
    const getOneCable=async (id:string)=>{
        let res=await  CableServer.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    };
    // 拉闸弹窗确定
    const offlazha=async ()=>{
        let res=await CableServer.off({uid,stutes:2})
        console.log('拉闸触发')
    };
    // 合闸弹窗确定
    const offhezha=async ()=>{
        let res=await CableServer.off({uid,stutes:1})
        console.log('合闸触发')

    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneCable(id)
    }, []);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                ref={formRef}
                // onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='采集器编号' name='collectorid'>
                    <Input/>
                </Form.Item>
                <Form.Item label='表编号/地址' name='address'>
                    <Input/>
                </Form.Item>
                <Form.Item label='电能表类型' name='electricity_type'>
                    <Select options={[
                        {label:'单相单费率',value:'16225'},
                        {label:'三相单费率',value:'10226'}
                    ]}>
                    </Select>
                </Form.Item>
                <Form.Item label='表参数设置'>
                    <Select/>
                </Form.Item>
                <Form.Item label='描述' name='remark'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='互感器变化'>
                    <Input/>
                </Form.Item>
                <Form.Item label='其他操作'>
                    <Space>
                        <Button type='primary'>远程清零</Button>
                        <Button type='primary'>远程销户</Button>
                        <Button type='primary' onClick={()=>setlazha(true)}>拉闸</Button>
                        <Button type='primary' onClick={()=>sethezha(true)}>合闸</Button>
                        <Button type='primary'>保电</Button>
                        <Button type='primary'>解除保电</Button>
                    </Space>
                </Form.Item>
                <Form.Item label='当前总用量'>
                    <Input/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
            {/*拉闸的弹窗*/}
            <Modal open={lazha} onCancel={()=>setlazha(false)} onOk={offlazha}>
                <div>
                    确定要拉闸吗？
                </div>
            </Modal>
            {/*合闸的弹窗*/}
            <Modal open={hezha} onCancel={()=>sethezha(false)} onOk={offhezha}>
                <div>
                    确定要合闸吗？
                </div>
            </Modal>
        </div>
    )
}
export default connect() (ElectricityBasicBusiness)