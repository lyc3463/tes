import {Button, Form, Input, InputNumber, message, Radio, Select} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddAccountList=(props:any)=>{
    const [form] = Form.useForm();
    // 公司列表
    const [companyList,setCompanyList]=useState([])
    // 项目列表
    const [projectList,setProjectList]=useState([])
    useEffect(() => {
        filterAndUpdateList(props.CompanList, 'company_name', 'id', setCompanyList);
        filterAndUpdateList(props.ProjectList, 'project_name', 'id', setProjectList);
    }, []);

    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Account/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/financeManage/list')
        }else {
            message.error(res.Data)
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
            <Form.Item label="账户名称" name="account_name" rules={[{required: true, message: '请输入账户名称'}]}>
                <Input placeholder="例:xx账户"/>
            </Form.Item>
            <Form.Item label="账户卡号" name="account_card" rules={[{required: true, message: '请输入账户卡号'}]}>
                <Input placeholder="例:456465****"/>
            </Form.Item>
            <Form.Item label="选择公司" name="company_id" rules={[{required: true, message: '请选择公司'}]}>
                <Select>
                    {companyList.map((item:any,index:any)=>{
                        return(
                            <Select.Option value={item.value} key={index}>
                                {item.label}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item label="选择项目" name="project_id" rules={[{required: true, message: '请选择科目'}]}>
                <Select>
                    {projectList.map((item:any,index:any)=>{
                        return(
                            <Select.Option value={item.value} key={index}>
                                {item.label}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item label="余额" name="balance" rules={[{required: true, message: '请输入账户名称'}]}>
                <InputNumber/>
            </Form.Item>
            <Form.Item label="余额" name="account_type">
                <Radio.Group>
                    <Radio value={1}>公账</Radio>
                    <Radio value={0}>私账</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary"  htmlType="submit">
                    添加
                </Button>
            </Form.Item>
        </Form>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps) (AddAccountList)