import {Button, Form, Select, Input, Radio, message} from "antd";
import {history} from "@@/core/history";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddTenantInfo=()=>{
    const [form] = Form.useForm();

    const onFinish=async (values)=>{

    }
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
                <Form.Item label='选择租户'>
                    <Select/>
                </Form.Item>
                <Form.Item label='消息内容'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='是否显示给用户'>
                   <Radio.Group>
                       <Radio value={1}>
                           是
                       </Radio>
                       <Radio value={2}>
                           否
                       </Radio>
                   </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定发送
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default AddTenantInfo