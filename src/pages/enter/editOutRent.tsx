import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as OutRentService from '@/services/outRent';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const editOutRent=(props)=>{
    const navigate=useNavigate();

    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    const [spinning,setspinning]=useState(false);
    const [startDate,setStartDate]=useState('2000-01-01');
    const getInfo=(e)=>{
        OutRentService.one(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                formRef.current.setFieldsValue(res.Data);
                setStartDate(res.Data.refundData);
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInfo(id);
    }, []);
    const onFinish=(val)=>{
        setspinning(true);
        props.dispatch({
            type:"OutRent/edit",
            payload:{uid,startDate,...val}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setspinning(false);
                history.push(`/enter/afterSales`);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeDate=(_:any,date:any)=>{
      setStartDate(date);
    };
    const changeInput=(e)=>{
        console.log(e);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                initialValues={{refundReason:''}}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='姓名'>
                    <Input placeholder='姓名' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='手机号'>
                    <Input placeholder='手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='退租时间'>
                    <DatePicker value={dayjs(startDate)} onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='退租原因' name='refundReason' rules={[ {required: true, message: '请填写原因'}]}>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                 <Space>
                     <Button type="primary" htmlType="submit">
                         编辑
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
export default connect() (editOutRent)