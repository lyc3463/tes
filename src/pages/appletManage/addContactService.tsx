import {Button, Form, Image, Input, InputNumber, message, Radio, Spin} from "antd";
import CmpImageUploader from "@/components/ImageUploader";
import {useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddContactService=(props:any)=>{
    const [form] = Form.useForm();
    const [isLoading,setIsLoading]=useState(false);
    // 确定添加
    const onFinish=(e)=>{
        setIsLoading(true);
        props.dispatch({
            type:'ContactService/add',
            payload:{...e}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/appletManage/links');
                setIsLoading(false);
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    return(
        <div>
            <Spin spinning={isLoading}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label="链接名称" name="csName" rules={[{required: true, message: '请输入链接名称'}]}>
                        <Input placeholder="例:xx客服"/>
                    </Form.Item>
                    <Form.Item label="链接地址" name="csLink" rules={[{required: true, message: '请输入链接地址'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="链接类型" name="csType">
                        <Radio.Group>
                            <Radio value={1}>物业客服</Radio>
                            <Radio value={2}>招商客服</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
export default connect() (AddContactService)