import {connect,history} from "umi";
import {Button, Form, Input, message, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ThingListvice from '@/services/brandList';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const BrandEdit=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef();
    const [uid,setUid]=useState('0');

    const onFinish=(vals:any)=>{
        setSpinning(true);
        props.dispatch({
            type:'BrandList/edit',
            payload:{...vals,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setSpinning(false);
                history.push('/warehouse/warehouseAndType');
            }else {
                message.error('修改成功'+res.ErrorCode+res.Data);
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
        let res:any=await  ThingListvice.one(id);
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
                layout="horizontal"
                size={'large'}

                style={{ marginTop: '1rem' }}
            >
                {/* 1. 仓库名称 */}
                <Form.Item
                    name="brandName"
                    label="品牌名称"
                    rules={[
                        { required: true, message: '请输入品牌名称' },
                        { max: 50, message: '品牌名称长度不超过50字符' }
                    ]}
                >
                    <Input placeholder="请输入品牌名称" />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(BrandEdit);
