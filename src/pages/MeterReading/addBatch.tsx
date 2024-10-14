import {Button, Form, Input, message, Radio, Select} from "antd";
import CmpImageUploader from "@/components/ImageUploader";
import {history} from "@@/core/history";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddBatch=()=>{
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
                <Form.Item label="任务名称" name="biaohao" rules={[{required: true, message: '请输入批量任务名称'}]}>
                    <Input placeholder=""/>
                </Form.Item>
                <Form.Item label="任务类型" name="biaohao" >
                    <Select/>
                </Form.Item>
                <Form.Item label="备注" name="biaohao">
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default AddBatch