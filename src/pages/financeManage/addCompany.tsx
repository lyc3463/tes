import {connect,history,useNavigate} from 'umi'
import {Button, Form, Image, Input, message, Radio, Space, Spin, Upload} from "antd";
import {useState} from "react";
import * as BannerServer from "@/services/banner";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCompany=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Compan/add',
            payload:{...values,addCompanyHouseId:1,addCompanyUnitId:1}
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/financeManage/list');
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
                <Form.Item label="公司" name="name" rules={[{required: true, message: '请输入公司名称'}]}>
                    <Input placeholder="例:xx公司"/>
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
export default connect()(AddCompany)