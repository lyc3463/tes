import {useLocation, connect, history} from 'umi';
import {useEffect, useRef, useState} from "react";
import * as CompanService from '@/services/compan';
import {Button, Form, Image, Input, message, Radio, Spin, Upload} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCompany=(props:any)=>{
    const location=useLocation()
    const formRef =useRef()
    const [isLoading,setIsLoading]=useState(false);
    // 路由参数
    const [uid,setUid]=useState<string|undefined>()
    // 获取公司详情信息
    const getCompanyOne=async (e:any)=>{
        let res=await CompanService.one(e)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getCompanyOne(id)
    }, []);
    const  onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Compan/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
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
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                ref={formRef}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label="公司名称" name="company_name" rules={[{required: true, message: '请输入公司名'}]}>
                    <Input placeholder="例如:001"/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(EditCompany)