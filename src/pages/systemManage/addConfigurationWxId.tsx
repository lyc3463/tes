import {Button, Form, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {useState} from "react";
import {useNavigate} from "umi";
import * as AppPzService from '@/services/appPz';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddConfigurationWxId=()=>{
    const navigate=useNavigate();
    const [spinning,setspinning]=useState(false);
    const [form] = Form.useForm();
    const onFinish=(val)=>{
        setspinning(true);
        AppPzService.addWxInfo(val).then((res:TypeErrorCode)=>{
            try {
                if(res.ErrorCode===0){
                    message.success('添加成功');
                    setspinning(false);
                    navigate(-1);
                }else {
                    message.error(res.Data);
                    setspinning(false);
                }
            }catch (e) {
                message.error(e);
                setspinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label="企业名称(简称)" name="qyName" rules={[{required: true, message: '请输入企业名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="企业ID" name="authCorpId" rules={[{required: true, message: '请输入企业ID'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <a href='https://work.weixin.qq.com/' target='_blank'>查看企业简称</a>
                    <div style={{color:'#555'}}>注意:填写的企业名称请到企业微信后台查看<span style={{color:"red"}}>企业简称,填写企业简称请不要填写企业的全称</span></div>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary"  htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default AddConfigurationWxId