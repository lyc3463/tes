import {Button, Form, Input, message} from "antd";
import {connect,history} from 'umi'
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCollector=(props:any)=>{
    const [form] = Form.useForm();
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Collector/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/waterCableManage/collector')
        }else {
            message.error(res.Data)
        }
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
                <Form.Item label='采集器ID' name='collector_number'  rules={[{required: true, message: '请填写采集器ID'}]}>
                    <Input placeholder='请输入采集器ID'/>
                </Form.Item>
                <Form.Item label='备注' name='remark'  rules={[{required: true, message: '请填写备注'}]}>
                    <Input.TextArea placeholder='备注'/>
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
export default connect() (AddCollector)