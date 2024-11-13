import {connect,history} from 'umi'
import {Button, Form, Image, Input, message, Radio, Spin, Upload} from "antd";
import {useState} from "react";
import * as BannerServer from "@/services/banner";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCompany=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Compan/add',
            payload:{...values,addCompanyHouseId:1,addCompanyUnitId:1}
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/financeManage/list')
        }else {
            message.error(res.Data)
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
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(AddCompany)