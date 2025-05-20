import {history,connect,useLocation,useNavigate} from "umi";
import {Button, Form, Input, InputNumber, message, Radio, Select, Space} from "antd";
import {useEffect, useRef, useState} from "react";
import * as AccountService from "@/services/account";
import * as ProjectService from '@/services/project';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditAccountList=(props:any)=>{
    const navigate=useNavigate();
    const location=useLocation();
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 公司列表
    const [companyList,setCompanyList]=useState([]);
    // 项目列表
    const [projectList,setProjectList]=useState([]);
    // 项目名字
    const [projectName,setprojectName]=useState('');
    // 公司id
    const [company_id,setcompany_id]=useState(0);
    const getAccounOne=async (e:any)=>{
        let res:any=await AccountService.one(e)
        if (res.ErrorCode==0){
           setcompany_id(res.Data.company_id);
            formRef.current.setFieldsValue(res?.Data);
        }else {
            message.error(res.Data);
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getAccounOne(id)
        getProjectList();
        getCompanList();
    }, []);
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Account/edit',
            payload:{...values,uid,company_id}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/financeManage/list')
        }else {
            message.error(res.Data)
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
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
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
                            修改
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list,
        ProjectList: state.Project.list,
    }
};
export default connect(mapStateToProps) (EditAccountList)