import {Form, Input, Select, Button, Switch, InputNumber, message, Spin} from 'antd';
import { useState } from 'react';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddWarehouse = (props: any) => {
    const [form] = Form.useForm();
    const [spinning,setSpinning] = useState(false);
    // 提交表单
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // 调用新增接口逻辑
            console.log('提交数据:', values);
        } catch (error) {
            message.error('表单验证失败');
        }
    };

    return (
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}

            >
                {/* 2. 仓库名称 */}
                <Form.Item
                    name="price_name"
                    label="仓库名称"
                    rules={[
                        { required: true, message: '请输入仓库名称' },
                        { max: 50, message: '名称长度不超过50字符' }
                    ]}
                >
                    <Input placeholder="请输入仓库名称" />
                </Form.Item>

                {/* 3. 仓库类型（与列表页类型对应） */}
                <Form.Item
                    name="price_type"
                    label="仓库类型"
                    rules={[{ required: true, message: '请选择仓库类型' }]}
                >
                    <Select placeholder="请选择类型">
                        <Select.Option value={1}>普通仓库</Select.Option>
                        <Select.Option value={2}>冷藏仓库</Select.Option>
                        <Select.Option value={3}>危险品仓库</Select.Option>
                    </Select>
                </Form.Item>

                {/* 4. 所在地址 */}
                <Form.Item
                    name="address"
                    label="所在地址"
                    rules={[{ required: true, message: '请输入仓库地址' }]}
                >
                    <Input placeholder="请输入详细地址（如：XX市XX区XX路）" />
                </Form.Item>

                {/* 5. 负责人信息 */}
                <Form.Item
                    name="manager"
                    label="负责人姓名"
                    rules={[{ required: true, message: '请输入负责人姓名' }]}
                >
                    <Input placeholder="请输入负责人姓名" />
                </Form.Item>

                {/* 6. 联系电话 */}
                <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[
                        { required: true, message: '请输入联系电话' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                    ]}
                >
                    <Input placeholder="请输入负责人联系电话" />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};
export default AddWarehouse;
