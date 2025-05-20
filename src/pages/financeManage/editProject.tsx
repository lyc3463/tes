import {useLocation,history,connect} from "umi";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import * as ProjectService from "@/services/project";
import {useNavigate} from "@@/exports";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditProject=(props)=>{
    const location=useLocation();
    const navigate=useNavigate();
    const formRef =useRef();
    const [isLoading,setIsLoading]=useState(false);
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 公司列表
    const [company,setCompany]=useState([]);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getCompanyOne(id)
    }, []);
    const  onFinish=async (values:any)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Project/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功');
            history.push('/financeManage/list');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    }
    // 获取项目详情信息
    const getCompanyOne=async (e:any)=>{
        let res=await ProjectService.one(e)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
        }
    }
    useEffect(()=>{
        if (props.CompanList.length>0){
            let list=props.CompanList.map((item:any)=>{
                return{
                    label:item.company_name,
                    value:item.id
                }
            })
            setCompany(list)
        }
    },[])
    return(
        <Spin spinning={isLoading}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                ref={formRef}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label="项目名称" name='project_name' rules={[{required: true, message: '请输入项目名称'}]}>
                    <Input placeholder="例如:001"/>
                </Form.Item>
                <Form.Item label="项目名称"  name='company_id'>
                    <Select>
                        {company.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list
    }
};
export default connect(mapStateToProps)(EditProject)