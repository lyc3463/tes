import {useEffect, useRef, useState} from "react";
import {connect,useLocation,history} from "umi";
import * as YinghangkaServer from "@/services/yinghangka";
import {Button, Form, Input, message, Radio} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditYinghangka=(props:any)=>{
    const location=useLocation();
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 获取单个采集器详情
    const getOneYinghangka=async (id:string)=>{
        let res:any=await  YinghangkaServer.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneYinghangka(id);
    },[]);
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Yinghangka/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/qianbao/yinghangka')
        }else {
            message.error(res.Data)
        }
    }
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                ref={formRef}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='户名' name='accountName' rules={[{required: true, message:'请输入户名'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='银行卡号' name='cardNum' rules={[{required: true, message:'请输入银行卡号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='预留手机号' name='bankPhone' rules={[{required: true, message:'请输入预留手机号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='银行名称' name='bankName' rules={[{required: true, message:'请输入银行名称'}]}>
                    <Input/>
                </Form.Item>
        
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (EditYinghangka)