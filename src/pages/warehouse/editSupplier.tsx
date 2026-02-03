import {Button, Form, Input, message, Select, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as Suppliervice from '@/services/supplier';

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditSupplier=(props:any)=>{
    const [form] = Form.useForm();
    const formRef=useRef();
    const [uid,setUid]=useState('0');
    const [spinning,setSpinning] = useState(false);
    const onFinish=(value:any)=>{
        setSpinning(true);
        props.dispatch({
            type:'Supplier/edit',
            payload:{...value,uid},
        }).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('修改成功');
                setSpinning(false);
                history.push('/warehouse/supplier');
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
    }, []);
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  Suppliervice.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setSpinning(false);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                onFinish={onFinish}
                initialValues={{remark:'',supplierAddress:'',personName:'',personPhone:''}}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item
                    name="supplierName"
                    label="供应商名称"
                    rules={[{ required: true, message: '请输入供应商名称' }, { max: 50, message: '名称长度不超过50字符' }]}
                >
                    <Input placeholder="请输入供应商名称" />
                </Form.Item>
                <Form.Item
                    name="supplierAddress"
                    label="所在地址"
                >
                    <Input placeholder="请输入详细地址（如：XX市XX区XX路）" />
                </Form.Item>
                <Form.Item
                    name="personName"
                    label="联系人"
                >
                    <Input placeholder="请输入联系人" />
                </Form.Item>
                <Form.Item
                    name="personPhone"
                    label="联系电话"
                >
                    <Input placeholder="请输入负责人联系电话"/>
                </Form.Item>
                <Form.Item label="备注(选填)" name='remark'>
                    <Input placeholder="请输入备注" />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(EditSupplier);
