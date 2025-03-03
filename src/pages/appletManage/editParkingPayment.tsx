import {history, useLocation,connect} from "umi";
import  * as ParkingPaymenttService from "@/services/parkingPayment";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, message, Spin} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditParkingPayment=(props)=>{
    const location=useLocation()
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 获取单个联系客服
    const getOneLink=async (id:string)=>{
        let res:any=await  ParkingPaymenttService.one(id);
        setIsLoading(true);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res.Data);
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    // 编辑提交
    const onFinish=(values)=>{
        props.dispatch({
            type:'ParkingPayment/edit',
            payload:{...values,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode===0){
                setIsLoading(false);
                message.success('修改成功')
                history.push('/appletManage/links')
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneLink(id)
    },[]);
    return(
        <div>
            <Spin spinning={isLoading}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    ref={formRef}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label="链接名称" name="ppName" rules={[{required: true, message: '请输入链接名称'}]}>
                        <Input placeholder="例:xx停车收费平台"/>
                    </Form.Item>
                    <Form.Item label="链接地址" name="ppLink" rules={[{required: true, message: '请输入链接地址'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="注意事项">
                        <span style={{color:'red'}}>链接地址必须是小程序AppID才能跳转,如不清楚AppID请到</span><a href='https://mp.weixin.qq.com/' target='_blank'>点击此链接查看AppID</a>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            修改
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
export default connect() (EditParkingPayment)