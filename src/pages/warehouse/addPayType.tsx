import {connect} from "umi";
import {Button, Form, Input, InputNumber, message, Radio, Select} from "antd";
import {history} from "@@/core/history";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddType=(props:any)=>{
    const [form] = Form.useForm();
    const onFinish=async (values)=>{

    }
    return(
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            form={form}
            layout="horizontal"
            size={'large'}
            onFinish={onFinish}
            style={{ marginTop: '1rem' }}
        >
            <Form.Item label="类型名称" name="label_name" rules={[{required: true, message: '请输入类型名称'}]}>
                <Input/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary"  htmlType="submit">
                    添加
                </Button>
            </Form.Item>
        </Form>
    )
}
export default connect() (AddType)