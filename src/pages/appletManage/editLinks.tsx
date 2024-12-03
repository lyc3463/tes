import {Button, Form, Image, Input, message, Radio, Spin} from "antd";
import {history, useLocation,connect} from "umi";
import CmpImageUploader from "@/components/ImageUploader";
import * as LinksServer from "@/services/links";
import {useEffect, useRef, useState} from "react";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const EditLinks=(props:any)=>{
    const location=useLocation()
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef()
    // 路由参数
    const [uid,setUid]=useState<string|undefined>()
    // 单图名字
    const [single, setSingle] = useState<string | undefined>(undefined);
    // 图片地址
    const [b64,setB64]=useState('');
    // 获取单个友情图详情
    const getOneLink=async (id:string)=>{
        let res:any=await  LinksServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res.Data);
            setSingle(res.Data.fileName);
            setB64(res.Data.link_image)
        }else {
            message.error(res.Data)
        }
    };
    // 编辑提交
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Links/edit',
            payload:{...values,single,uid}
        })
        if (res.ErrorCode===0){
            message.success('修改成功')
            history.push('/appletManage/links')
        }
    };
    // 单图
    const handleImageUpload = (val: string) => {
        setSingle(val); // 将base64字符串保存到状态中
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneLink(id)
    },[]);
    const setOldB64=(e)=>{
        setB64(e);
    };
    return(
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
                <Form.Item label="链接名称" name="link_name" rules={[{required: true, message: '请输入链接名称'}]}>
                    <Input placeholder="例:xx小程序"/>
                </Form.Item>
                <Form.Item label="链接地址" name="link_address" rules={[{required: true, message: '请输入链接地址'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="封面图" >
                    <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={setOldB64}/>
                    {b64?<Image src={b64} style={{height:'80px',width:'80px'}}/>:''}
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (EditLinks)