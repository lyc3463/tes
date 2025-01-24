import {Button, Form, Input, InputNumber, message, Select, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {useLocation, connect, history} from 'umi'
import * as CollectorServer from "@/services/collector";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCollector=(props:any)=>{
    const location=useLocation();
    const formRef =useRef();
    const [spinning,setspinning]=useState(false);
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 获取单个采集器详情
    const getOneCollerctor=async (id:string)=>{
        let res=await  CollectorServer.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCollerctor(id);
    },[]);
    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Collector/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功');
            history.push('/waterCableManage/collector');
            setspinning(false);
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    }
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='采集器ID' name='collectorid'  rules={[{required: true, message: '请填写采集器ID'}]}>
                    <Input placeholder='请输入采集器ID'/>
                </Form.Item>
                <Form.Item label='备注' name='remark'  rules={[{required: true, message: '请填写备注'}]}>
                    <Input.TextArea placeholder='备注'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (EditCollector)