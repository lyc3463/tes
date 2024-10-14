import {Button, Form, Input, Radio} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const AddYinghangka=()=>{
    const [form] = Form.useForm();
    const onFinish = (values: any) => {

    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='户名'>
                    <Input/>
                </Form.Item>
                <Form.Item label='银行卡号'>
                    <Input/>
                </Form.Item>
                <Form.Item label='预留手机号'>
                    <Input/>
                </Form.Item>
                <Form.Item label='银行名称'>
                    <Input/>
                </Form.Item>
                <Form.Item label='是否为默认卡'>
                    <Radio.Group defaultValue={1}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default AddYinghangka