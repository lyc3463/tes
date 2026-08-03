import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as OutRentService from '@/services/outRent';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import ImageUpload from "@/components/ImageUploader";
import ImageUploadPng from "@/components/ImageUploadPng";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const editOutRent=(props)=>{
    const navigate=useNavigate();

    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    const [spinning,setspinning]=useState(false);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName,setImgName]=useState<string[]>([]);
    // 1正常退租,2强制退租
    const [type,settype]=useState(2);
    const getInfo=(e)=>{
        OutRentService.one(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                console.log('详情',res)
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                formRef.current.setFieldsValue(res.Data);
                setStartDate(res.Data.refundData);
                setImgName(res.Data.pdfImage.split("|"));
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInfo(id);
    }, []);
    const onFinish=(val)=>{
        setspinning(true);
        const imgList=imgName.join('|');
        props.dispatch({
            type:"OutRent/edit",
            payload:{uid,startDate,...val,imgList,type}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setspinning(false);
                history.push(`/enter/afterSales`);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeDate=(_:any,date:any)=>{
      setStartDate(date);
    };

    // 图片base64
    const onImageUpload=(base64:any)=>{
        setImgName([...imgName,base64]);
    };
    const oldBase64=(base64:any)=>{
        setImgB64([...imgB64,base64]);
    };
    // 删除租户证件图片
    const handleDeletezuhu=(index:number)=>{
        const newImages = [...imgB64];
        newImages.splice(index, 1);
        setImgB64(newImages);
        const newB64 = [...imgName];
        newB64.splice(index, 1);
        setImgName(newB64);
    };
    const changeType=(e)=>{
        settype(e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                initialValues={{refundReason:''}}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='姓名'>
                    <Input placeholder='姓名' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='手机号'>
                    <Input placeholder='手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='退租时间'>
                    <DatePicker value={dayjs(startDate)} onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='退租原因' name='refundReason' rules={[ {required: true, message: '请填写原因'}]}>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='图片'>
                    <ImageUploadPng onImageUpload={onImageUpload} oldBase64={oldBase64} />
                    <Space wrap size={10} style={{ marginTop: 10 }}>
                        {imgName.map((item, index) => (
                            <div key={index} style={{ position: "relative" }}>
                                <Image
                                    src={`${window.ServerConfig.imgServer}${item}.png`}
                                    width={70}
                                    height={70}
                                    style={{ borderRadius: 6, objectFit: "cover" }}
                                    preview
                                />
                                <Button
                                    danger
                                    size="small"
                                    style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, padding: 0 }}
                                    onClick={() => handleDeletezuhu(index)}
                                >
                                    ×
                                </Button>
                            </div>
                        ))}
                    </Space>
                </Form.Item>
                <Form.Item label='退租类型'>
                    <Radio.Group value={type} onChange={changeType} disabled>
                        <Radio value={1}>正常退租</Radio>
                        <Radio value={2}>强制退租</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                 <Space>
                     <Button type="primary" htmlType="submit">
                         编辑
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
export default connect() (editOutRent)