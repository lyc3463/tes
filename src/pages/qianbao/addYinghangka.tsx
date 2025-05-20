import {Button, Form, Input, message, Radio, Space} from "antd";
import {connect,history,useNavigate} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

const AddYinghangka=(props:any)=>{
    const [form] = Form.useForm();
    const navigate=useNavigate();
    const onFinish = (values: any) => {
        props.dispatch({
            type:'Yinghangka/add',
            payload:values
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/qianbao/yinghangka')
            }else {
                message.error(res.Data)
            }
        })
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
                <Form.Item label='户名' name='accountName' rules={[{required: true, message:'请输入户名'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='银行卡号' name='cardNum' rules={[{required: true, message:'请输入银行卡号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='预留手机号' name='bankPhone' rules={[{required: true, message:'请输入预留手机号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='开户行' name='bankName' rules={[{required: true, message:'请输入开户行'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item {...tailLayout}>
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
        </div>
    )
}
export default connect() (AddYinghangka)