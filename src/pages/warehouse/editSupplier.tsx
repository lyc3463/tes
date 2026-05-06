import {Button, Form, Input, message, Select, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect,history,useNavigate} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as Suppliervice from '@/services/supplier';

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditSupplier=(props:any)=>{
    const navigate = useNavigate();
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
                navigate(-1)
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
                    label="开户行"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="personName"
                    label="账号"
                >
                    <Input placeholder="请输入账号" />
                </Form.Item>
                <Form.Item
                    name="personPhone"
                    label="账户名"
                >
                    <Input placeholder="请输入账户名"/>
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
