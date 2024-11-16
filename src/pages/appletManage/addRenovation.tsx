import {useState} from "react";
import {Button, Form, Input, message, Radio, Select, Spin} from "antd";
import * as RenovationService from '@/services/renovation';
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddRenovation=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();

    const onFinish=async (values)=>{
        setIsLoading(true);
        props.dispatch({
            type:'Renovation/add',
            payload:values
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/appletManage/propertyDescription')
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    }
    return(
        <Spin spinning={isLoading}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >

                <Form.Item label="装修名称" name="name">
                    <Input placeholder="例:豪华装修"/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(AddRenovation)