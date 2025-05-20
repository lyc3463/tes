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
    // 项目列表
    const [projectList,setProjectList]=useState([]);
    // 公司id
    const [company_id,setcompany_id]=useState(0);
    // 项目名字
    const [projectName,setprojectName]=useState('');
    const [spinning,setspinning]=useState(false);
    useEffect(() => {
        getProjectList();
        getCompanList();
    }, []);
    const onFinish=async (values)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Account/add',
            payload:{...values,company_id}
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
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCompanyList(res.Data);
            }else {
                setCompanyList([]);
            }
        })
    };
    // 获取项目列表
    const getProjectList=()=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name:projectName,companyId:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setProjectList(res.Data);
            }else {
                setProjectList([]);
            }
        });
    };
    // 监听下拉选择的项目
    const changeProject=(e)=>{
        getProjectOne(e);
    };
    // 获取项目详情
    const getProjectOne=(e)=>{
        ProjectService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log(res)
                setcompany_id(res.Data.company_id);
            }else {
                message.error(res.ErrorCode)
            }
        })
    };
    // 监听项目输入的名字
    const onSearchSbjValue=(value:string)=>{
        // console.log("value",value);
        setprojectName(value);
    };
    useEffect(() => {
        console.log('projectName',projectName);
    }, [projectName]);
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
                <Form.Item label="账户名称" name="account_name" rules={[{required: true, message: '请输入账户名称'}]}>
                    <Input placeholder="例:xx账户"/>
                </Form.Item>
                <Form.Item label="账户卡号" name="account_card" rules={[{required: true, message: '请输入账户卡号'}]}>
                    <Input placeholder="例:456465****"/>
                </Form.Item>
                <Form.Item label="选择项目" name="project_id" rules={[{required: true, message: '请选择科目'}]}>
                    <Select
                        showSearch
                        onChange={changeProject}
                        optionFilterProp="children"
                        onSearch={(value) => {
                            onSearchSbjValue(value)
                        }}
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {projectList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.project_name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="选择公司" rules={[{required: true, message: '请选择公司'}]}>
                    <Select disabled value={company_id}>
                        {companyList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.company_name}
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