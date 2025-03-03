import {Button, Form, Select, Input, Radio, message, Image, Spin} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import ImageUploader from "@/components/ImageUploader";
import * as TenantInfoService from '@/services/tenantInfo';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddTenantInfo=(props)=>{
    const [form] = Form.useForm();
    const [upimg,setUpImg]=useState('');
    const [imgB64,setImgB64]=useState('');
    const [spinning,setspinning]=useState(false);
    // 用户列表
    const [list,setList]=useState([]);
    const onFinish=(values)=>{
        setspinning(true);
        props.dispatch({
            type:'TenantInfo/add',
            payload:{...values,upimg}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('添加成功');
                history.push('/propertyServerManage/tenantInfo')
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const onimgname=(item:string)=>{
        setUpImg(item);
    };
    const onb64=(item:string)=>{
        setImgB64(item);
    };
    // 获取列表
    const getUserList=()=>{
        setspinning(true);
        TenantInfoService.userList().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setList(res.Data);
                console.log('res',res)
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getUserList();
    }, []);
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='选择租户' name='tenantId'>
                    <Select>
                        {
                            list.map((item:any,index:number)=>{
                                return(
                                    <Select.Option value={item.tenantId} key={index}>
                                        {item.appUser_phone}
                                    </Select.Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='消息内容' name='conten'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='图片'>
                    <ImageUploader onImageUpload={onimgname} oldBase64={onb64}/>
                     {imgB64?<Image src={imgB64} style={{width:'100px',height:'100px'}}/>:''}
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定发送
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddTenantInfo)