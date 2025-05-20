import {useState} from "react";
import {Button, Form, Input, Radio, Select, Spin, message, Space} from "antd";
import * as RegionService from '@/services/region';
import {history,connect,useNavigate} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddRegion=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    const navigate=useNavigate();

    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await  props.dispatch({
            type:'Region/add',
            payload:values
        })
       if (res.ErrorCode==0){
           message.success('添加成功');
           history.push('/appletManage/propertyDescription/');
           setIsLoading(false);
       }else {
           message.error(res.Data);
           setIsLoading(false);
       }
    }
    return(
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
                <Form.Item label="区域名称" name="name">
                    <Input placeholder="例:天河区"/>
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
        </Spin>
    )
}
export default connect() (AddRegion)