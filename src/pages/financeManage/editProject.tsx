import {useLocation,history,connect} from "umi";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import * as ProjectService from "@/services/project";
import * as AccountService from "@/services/account";
import {useNavigate} from "@@/exports";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
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
    // 账户列表
    const [account,setAccount]=useState([]);
    const [account_ID,setAccount_ID]=useState(0);
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
            payload:{...values,uid,account_ID}
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
            console.log('res',res)
            formRef.current.setFieldsValue(res?.Data);
            setAccount_ID(res?.Data?.accountId)
        }
    }
    // 获取账户列表
    const getAccountList=()=>{
        AccountService.fetch({name:'',account_type:0}).then((res:TypeErrorCode)=>{
            console.log('res',res);
            if (res.ErrorCode==0){
                setAccount(res.Data)
            }
        })
    };
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        })
    };
    useEffect(()=>{
        getAccountList();
        getCompanList();
    },[])
    const changeAccout=(e:any)=>{
        setAccount_ID(e)
    };
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
                <Form.Item label="公司名称" name='company_id'>
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
                <Form.Item label="账户名称">
                    <Select
                        value={account_ID}
                        onChange={changeAccout}
                    >
                        {account.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.account_name}-{item.account_card}
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