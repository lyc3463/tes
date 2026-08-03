import {connect,history,useNavigate} from 'umi'
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as AccountService from "@/services/account";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddProject=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const [companyList,setCompanyList]=useState([]);
    // 账户列表
    const [account,setAccount]=useState([]);
    const [account_ID,setAccount_ID]=useState(0);
    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Project/add',
            payload:{...values,account_ID}
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
    // 获取账户列表
    const getAccountList=()=>{
        AccountService.fetch({name:'',account_type:0}).then((res:TypeErrorCode)=>{
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
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label="项目名称" name="name" rules={[{required: true, message: '请输入项目名称'}]}>
                    <Input placeholder="例:xx项目"/>
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
        CompanList: state.Compan.list
    }
};
export default connect (mapStateToProps)(AddProject)