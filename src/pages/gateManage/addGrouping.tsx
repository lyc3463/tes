import {Button, Form, Input, message, Select, Spin} from "antd";
import {useState} from "react";
import {connect,history} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddGrouping=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const onFinish=async (values)=>{

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
                    <Form.Item label='人员ID' name='empId'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='分组名称' name='groupName'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='闸机地点' name='gateId'>
                        <Input/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary"  htmlType="submit" >
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
export default connect() (AddGrouping)