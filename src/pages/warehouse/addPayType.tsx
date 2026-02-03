import {connect} from "umi";
import {Button, Form, Input, InputNumber, message, Radio, Select, Spin} from "antd";
import {history} from "@@/core/history";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {useState} from "react";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddType=(props:any)=>{
    const [form] = Form.useForm();
    const [spinning,setSpinning]=useState(false);
    const onFinish=(values)=>{
        setSpinning(true);
        props.dispatch({
            type:'PayType/add',
            payload:{...values}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setSpinning(false);
                history.push('/warehouse/warehouseAndType');
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label="支付类型名称" name="pmName" rules={[{required: true, message: '请输入支付类型名称'}]}>
                    <Input/>
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
export default connect() (AddType)