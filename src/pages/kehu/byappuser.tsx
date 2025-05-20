import {Button, Form, Input, message, Radio, Space, Spin} from "antd";
import {phonePattern} from "@/utils/OpenTool";
import {useEffect, useRef, useState} from "react";
import {connect,history,useNavigate} from "umi";
import * as ZuhuServer from "@/services/zuhu";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Byappuser=(props)=>{
    const navigate=useNavigate();
    const formRef=useRef();
    const [uid,setUid]=useState('0');
    const  [spinning,setspinning]=useState(false);
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data[0]);
        }else {
            message.error(res.Data);
        }
    };
    useEffect(() => {
        setUid(props.id);
        getOneCustom(props.id);
    }, [props.id]);
    const onFinish=(vals)=>{
        setspinning(true);
        props.dispatch({
            type:'Zuhu/newbyappuser',
            payload:{...vals,uid}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('绑定成功');
                setspinning(false);
                // getOneCustom(uid);
                history.push('/kehu/zuhuguanlian');
            }else {
                setspinning(false);
                message.error(res.Data);
                getOneCustom(uid);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                initialValues={{reamrk:'',minimum_recharge:1}}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='小程序手机号' name='tenant_phone' rules={[{required: true, message: '请输入手机号' },{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='是否自动扣款' name='is_deduction'>
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                 <Space>
                     <Button type="primary" htmlType="submit">
                         确定关联
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
export default connect() (Byappuser)