import {Button, Form, Input, message, Space, Spin} from "antd";
import {connect,history,useNavigate} from 'umi'
import {useState} from "react";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCollector=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Collector/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/waterCableManage/collector');
            setspinning(false);
        }else {
            message.error(res.Data);
            setspinning(false);
        }
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
                <Form.Item label='采集器ID' name='collector_number'  rules={[{required: true, message: '请填写采集器ID'}]}>
                    <Input placeholder='请输入采集器ID'/>
                </Form.Item>
                <Form.Item label='备注' name='remark'  rules={[{required: true, message: '请填写备注'}]}>
                    <Input.TextArea placeholder='备注'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary"  htmlType="submit">
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
export default connect() (AddCollector)