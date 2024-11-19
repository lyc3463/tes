import {Button, DatePicker, Form, Input, message} from "antd";
import {useEffect, useRef, useState} from "react";
import {history,useLocation,connect} from "umi";
import * as CheckFpService from '@/services/checkFp';

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCheckFp=(props:any)=>{
    const location=useLocation();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const onFinish=async (values)=>{

    };
    // 获取发票详情
    const getOneCustom=async (id:string)=>{
        let res:any=await  CheckFpService.one(id);
        console.log(res)
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            // setCustom_date(dayjs(data.custom_date).format('YYYY-MM-DD'))
        }else {
            message.error(res.Data)
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id)
    },[]);
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
                <Form.Item label='抬头类型' name='custom_name'>
                    <Input placeholder='客户姓名'/>
                </Form.Item>
                <Form.Item label='税号' name='visitor_type'>
                    <Input placeholder='访客类别'/>
                </Form.Item>
                <Form.Item label='手机/邮箱' name='visitor_type'>
                    <Input placeholder='访客类别'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (EditCheckFp)