import {Button, Form, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {history,connect,useNavigate} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ProjectService from '@/services/project';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddAccountList=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 公司列表
    const [companyList,setCompanyList]=useState([]);
    // 公司id
    const [spinning,setspinning]=useState(false);
    useEffect(() => {
        getCompanList();
    }, []);
    const onFinish=async (values)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Account/add',
            payload:{...values}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功')
            history.push('/financeManage/list')
        }else {
            setspinning(false);
            message.error(res.Data);
        }
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        })
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
                initialValues={{account_type:0}}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label="账户名称" name="account_name" rules={[{required: true, message: '请输入账户名称'}]}>
                    <Input placeholder="例:xx账户"/>
                </Form.Item>
                <Form.Item label="账户卡号" name="account_card" rules={[{required: true, message: '请输入账户卡号'}]}>
                    <Input placeholder="例:456465****"/>
                </Form.Item>
                <Form.Item label="选择公司" name="company_id" rules={[{required: true, message: '请选择公司'}]}>
                    <Select>
                        {/* 先判断：是数组且长度大于0才渲染选项，否则不渲染 */}
                        {Array.isArray(props.CompanList) && props.CompanList.length > 0
                            ? props.CompanList.map((item: any, index: any) => (
                                <Select.Option value={item.id} key={index}>
                                    {item.company_name}
                                </Select.Option>
                            ))
                            : null}
                    </Select>
                </Form.Item>
                <Form.Item label="余额" name="balance" rules={[{required: true, message: '请输入账户名称'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label="账户类型" name="account_type">
                    <Radio.Group>
                        <Radio value={1}>公账</Radio>
                        <Radio value={0}>私账</Radio>
                    </Radio.Group>
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
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps) (AddAccountList)