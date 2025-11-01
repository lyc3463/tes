import {connect,history} from "umi";
import {Button, Form, Input, message, Spin} from "antd";
import {useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const BrandAdd=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();

    const onFinish=(vals:any)=>{
        setSpinning(true);
        props.dispatch({
            type:'BrandList/add',
            payload:vals
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
export default connect()(BrandAdd);
