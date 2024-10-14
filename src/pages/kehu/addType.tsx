import {connect} from "umi";
import {Button, Form, Input, InputNumber, message, Radio, Select} from "antd";
import {history} from "@@/core/history";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddType=(props:any)=>{
    const [form] = Form.useForm();
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Biaoqian/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/kehu/typeList')
        }
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
            <Form.Item label="上级" name="parent">
                <Select
                    options={[
                        {label:'最上级',value:0}
                    ]}
                >
                </Select>
            </Form.Item>
            <Form.Item label="标签名称" name="label_name" rules={[{required: true, message: '请输入账户名称'}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="排序" name="sort" >
                <InputNumber/>
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