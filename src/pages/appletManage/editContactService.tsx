import {useEffect, useRef, useState} from "react";
import {Button, Form, Image, Input, message, Radio, Spin} from "antd";
import {history, useLocation,connect} from "umi";
import  * as ContactService from "@/services/contactService";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditContactService=(props)=>{
    const location=useLocation()
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 获取单个联系客服
    const getOneLink=async (id:string)=>{
        let res:any=await  ContactService.one(id);
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
            type:'ContactService/edit',
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
                    <Form.Item label="链接名称" name="csName" rules={[{required: true, message: '请输入链接名称'}]}>
                        <Input placeholder="例:xx客服"/>
                    </Form.Item>
                    <Form.Item label="链接地址" name="csLink" rules={[{required: true, message: '请输入链接地址'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="链接类型" name="csType">
                        <Radio.Group>
                            <Radio value={1}>物业客服</Radio>
                            <Radio value={2}>招商客服</Radio>
                        </Radio.Group>
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
export default connect() (EditContactService)