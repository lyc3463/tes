import {Button, Form, InputNumber, Select} from "antd";

const EditPassword=()=>{
    const [form] = Form.useForm();
    const onFinisn=(vals)=>{

    }
    return(
        <div>
            <Form
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinisn}
            >
                <Form.Item label='输入手机号'>

                </Form.Item>
                <Form.Item label='对账金额(元)' name='reconBalance'>
                    <InputNumber/>
                </Form.Item>
                <Button type="primary"  htmlType="submit">
                    添加
                </Button>
            </Form>
        </div>
    )
}
export default EditPassword