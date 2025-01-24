import {useState} from "react";
import {Button, Form, Input, message, Radio, Select, Spin} from "antd";
import {connect, history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCharacteristic=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    const onFinish=(values)=>{
        setIsLoading(true);
        props.dispatch({
            type:'Characteristic/add',
            payload:values
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setIsLoading(false);
                history.push('/appletManage/propertyDescription');
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
                <Form.Item label="特色名称" name="name">
                    <Input placeholder="例:性价比高"/>
                </Form.Item>
                {/*<Form.Item label="是否显示在小程序" name='stutes'>*/}
                {/*    <Radio.Group>*/}
                {/*        <Radio value={1}>是</Radio>*/}
                {/*        <Radio value={0}>否</Radio>*/}
                {/*    </Radio.Group>*/}
                {/*</Form.Item>*/}
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddCharacteristic)