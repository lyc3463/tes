import {Button, Form, Input, message, Radio, Select, Spin} from "antd";
import {useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddWarehouseType=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();

    const onFinish=(valus:any)=>{
        setSpinning(true);
        props.dispatch({
            type:"WarehouseType/add",
            payload:{...valus}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setSpinning(false);
                history.push('/warehouse/warehouseAndType');
            }else {
                message.error('添加失败'+res.ErrorCode+res.Data);
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
                    <Input placeholder="请输入物品类型" />
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
export default connect()(AddWarehouseType);
