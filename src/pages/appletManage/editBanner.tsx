import {Button, Form, Image, Input, message, Radio, Spin, Upload} from "antd";
import {useEffect, useRef, useState} from "react";
import * as BannerServer from "@/services/banner";
import {history, useLocation,connect} from "umi";
import CmpImageUploader from "@/components/ImageUploader";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const EditBanner=(props:any)=>{
    const location=useLocation()
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef()
    // 路由参数
    const [uid,setUid]=useState<string|undefined>()
    // 图片地址
    const [single, setSingle] = useState<string | undefined>(undefined);
    // 图片64
    const [imgBase64,setImgBase64]=useState('');
    // 编辑提交
    const onFinish=(values)=>{
        props.dispatch({
            type:'Banner/edit',
            payload:{...values,single,uid}
        }).then((res)=>{
            if (res.ErrorCode===0){
                message.success('修改成功')
                history.push('/appletManage/banner')
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取单个轮播图详情
    const getOneBanner=async (id:string)=>{
        let res=await  BannerServer.one(id);
        if (res?.ErrorCode==0){
            console.log(res)
            formRef.current.setFieldsValue(res?.Data)
            setImgBase64(res?.Data.carousel_image);
            setSingle(res?.Data.fileName);
        }
    };

    // 图片名称修改时候传给数据库
    const handleImageUpload = (val: string) => {
        setSingle(val);
    };
    // base64 用来显示在页面
    const getImgBase64=(val:string)=>{
        console.log(val)
        setImgBase64(val);
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneBanner(id)
    },[]);


    return(
        <Spin spinning={isLoading}>
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
                <Form.Item label="轮播图编号" name="carousel_name" rules={[{required: true, message: '请输入轮播图编号'}]}>
                    <Input placeholder="例如:001"/>
                </Form.Item>
                <Form.Item label='缩略图'>
                    <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                    {imgBase64?<Image src={imgBase64} style={{width:'80px',height:"80px"}}/>:''}
                </Form.Item>
                <Form.Item label="是否显示在小程序" name='carouselStatus'>
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
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
export default connect() (EditBanner)