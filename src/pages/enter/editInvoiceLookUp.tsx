import {history,connect} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as InvoiceLookUpServer from "@/services/InvoiceLookUp";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, Form, Input, message, Radio, Select, Space, Spin} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditInvoiceLookUp=(props)=>{
    const formRef=useRef();
    const [uid,setUid]=useState('');
    const [spinning,setspinning]=useState(false);
    const [rise_type,setrise_type]=useState(0);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInvoiceLoolUp(id);
    }, []);
    // 获取抬头详情
    const getInvoiceLoolUp=(id)=>{
        InvoiceLookUpServer.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log("抬头信息",res)
                formRef.current.setFieldsValue(res.Data);
                setrise_type(res.Data.rise_type);
            }else {
                message.error(res.Data);
            }
        })
    };
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'InvoiceLookUp/edit',
            payload:{...vals,uid,rise_type}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('修改成功');
                history.push('/enter/invoiceLookUp/')
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const changeType=(e)=>{
        setrise_type(e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                initialValues={{bankDeposit:'',bankCard:'',work_phone:'',work_address:'',duty_paragraph:''}}
                ref={formRef}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='抬头类型'>
                    <Radio.Group onChange={changeType} value={rise_type}>
                        <Radio value={1}>
                            企业
                        </Radio>
                        <Radio value={0}>
                            个人
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='抬头名称' name='rise_name'  rules={[{required: true, message: '请填写抬头名称'}]} >
                    <Input/>
                </Form.Item>
                {
                    rise_type==1?<Form.Item label='税号' name='duty_paragraph' rules={[{required: true, message: '请填写抬头名称'}]}>
                        <Input/>
                    </Form.Item>:<Form.Item label='税号' name='duty_paragraph' style={{display:'none'}}>
                        <Input/>
                    </Form.Item>
                }
                <Form.Item label='手机号' name='phone' rules={[{required: true, message: '请输入手机号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='邮箱' name='email' rules={[{required: true, message: '请输入手机号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='是否默认' name='is_default'>
                    <Radio.Group disabled>
                        <Radio value={1}>
                            是
                        </Radio>
                        <Radio value={0}>
                            否
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='  '>
                    <div style={{fontSize:'12px',color:'#555'}}>(选填信息)</div>
                </Form.Item>
                <Form.Item label='开户银行' name='bankDeposit'>
                    <Input placeholder='非必填'/>
                </Form.Item>
                <Form.Item label='银行卡号' name='bankCard'>
                    <Input placeholder='非必填'/>
                </Form.Item>
                <Form.Item label='单位号码' name='work_phone'>
                    <Input placeholder='非必填'/>
                </Form.Item>
                <Form.Item label='单位地址' name='work_address'>
                    <Input placeholder='非必填'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (EditInvoiceLookUp)