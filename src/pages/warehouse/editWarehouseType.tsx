import {Button, Form, Input, message, Select, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as WarehouseType from "@/services/warehouseType";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditWarehouseType=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const [uid,setUid]=useState('0');
    const formRef=useRef();
    const onFinish=(valus:any)=>{
        setSpinning(true);
        props.dispatch({
            type:"WarehouseType/edit",
            payload:{...valus,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setSpinning(false);
                history.push('/warehouse/warehouseAndType');
            }else {
                message.error('修改失败'+res.ErrorCode+res.Data);
                setSpinning(false);
            }
        })
    };
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  WarehouseType.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setSpinning(false);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
    }, []);
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                onFinish={onFinish}
                layout="horizontal"
                size={'large'}

                style={{ marginTop: '1rem' }}
            >
                {/* 1. 仓库名称 */}
                <Form.Item
                    name="typeName"
                    label="类型名称"
                    rules={[
                        { required: true, message: '请输入类型名称' },
                        { max: 50, message: '名称长度不超过50字符' }
                    ]}
                >
                    <Input placeholder="请输入仓库名称" />
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
export default connect()(EditWarehouseType);
