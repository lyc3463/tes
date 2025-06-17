import {connect,useNavigate} from "umi";
import {Button, Form, Input, Select, Space, Spin} from "antd";
import {useState} from "react";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddBankCard=(prosp)=>{
    const [spinning,setSpinning]=useState(false);
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const onFinish=(values)=>{

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
                <Form.Item label='选择租户' name='visitor_position'>
                    <Select/>
                </Form.Item>
                <Form.Item label='银行卡号' name='bankCard' rules={[{required: true, message: '请输入银行卡号'}]}>
                    <Input placeholder='银行卡号'/>
                </Form.Item>
                <Form.Item label='户名' name='accountName' rules={[{required: true, message: '请输入户名'}]}>
                    <Input placeholder='户名'/>
                </Form.Item>
                <Form.Item label='预留手机号' name='phone' rules={[{required: true, message: '请输入预留手机号'}]}>
                    <Input placeholder='预留手机号'/>
                </Form.Item>
                <Form.Item label='开户行' name='openingBank' rules={[{required: true, message: '请输入开户行'}]}>
                    <Input placeholder='xx开户行xx银行'/>
                </Form.Item>
                <Form.Item  {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddBankCard);