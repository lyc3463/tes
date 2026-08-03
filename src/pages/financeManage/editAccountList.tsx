import {history,connect,useLocation,useNavigate} from "umi";
import {Button, Form, Input, InputNumber, message, Radio, Select, Space} from "antd";
import {useEffect, useRef, useState} from "react";
import * as AccountService from "@/services/account";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditAccountList=(props:any)=>{
    const navigate=useNavigate();
    const location=useLocation();
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const getAccounOne=async (e:any)=>{
        let res:any=await AccountService.one(e);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
        }else {
            message.error(res.Data);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getAccounOne(id);
        getCompanList();
    }, []);
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Account/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/financeManage/list')
        }else {
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
    }
};
export default connect(mapStateToProps) (EditAccountList)