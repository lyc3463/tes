import {connect,useLocation,history} from 'umi';
import * as HouseServer from "@/services/house";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, message} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditHouse=(props:any)=>{
    const location=useLocation()
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef()
    // 路由参数
    const [uid,setUid]=useState<string|undefined>()
    // 获取单个房屋详情
    const getOneBanner=async (id:string)=>{
        let res:any=await  HouseServer.one(id);
        console.log("房屋详情",res)
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }else {
            message.error(res.Data)
        }
    };
    // 编辑提交
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'House/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/houseManage/houseList')
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneBanner(id)
    }, []);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                ref={formRef}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='房屋名称' name='house_name'>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡' name='rentable_area'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='单价/(元)' name='price'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='总租金/(元)' name='rents'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='详细地址' name='address'>
                    <Input/>
                </Form.Item>
                <Form.Item label='总楼层/(层)' name='floors'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='剩余可增加面积㎡' name='residue_add_area'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect()(EditHouse)