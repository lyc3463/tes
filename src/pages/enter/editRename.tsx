import {Button, Form, Image, Input, message, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as RenameService from '@/services/rename';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import ImageUploadPng from "@/components/ImageUploadPng";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditRename=(props)=>{
    const navigate=useNavigate();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const [renameStatus,setRenameStatus]=useState<number|undefined>();
    const formRef=useRef();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    const [customCard,setcustomCard]=useState('');
    const [spinning,setspinning]=useState(false);
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName,setImgName]=useState<string[]>([]);
    const getInfo=(e)=>{
        RenameService.one(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode==0){
                console.log("详细信息",res);
                setUid(res.Data.id);
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setcustomCard(res.Data.customCard);
                formRef.current.setFieldsValue(res.Data);
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
        const renameStatus = searchParams.get('renameStatus');
        setRenameStatus(Number(renameStatus));
        getInfo(id);
    }, []);
    const onFinish=(val)=>{
        setspinning(true);
        const imgList=imgName.join('|');
        props.dispatch({
            type:"Rename/edit",
            payload:{uid,...val,imgList}
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
    // 图片base64
    const onImageUpload=(base64:any)=>{
        setImgName([...imgName,base64]);
    };
    const oldBase64=(base64:any)=>{
        setImgB64([...imgB64,base64]);
    };
    // 删除租户证件图片
    const handleDeletezuhu=(index:number)=>{
        const newB64 = [...imgName];
        newB64.splice(index, 1);
        setImgName(newB64);
    };
    return(
        <Spin spinning={spinning}>
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
                <Form.Item label='原名字'>
                    <Input placeholder='原名字' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='原手机号'>
                    <Input placeholder='原手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='原身份证'>
                    <Input placeholder='原身份证' value={customCard} disabled/>
                </Form.Item>
                <Form.Item label='更改后的名字' name='rename' rules={[ {required: true, message: '请填写更改后的名字'}]}>
                    <Input placeholder='更改后的名字'/>
                </Form.Item>
                <Form.Item label='更改后的身份证' name='reCard' rules={[ {required: true, message: '请填写更改后的身份证'}]}>
                    <Input placeholder='更改后的身份证'/>
                </Form.Item>
                <Form.Item label='更改后的手机号' name='rephone' rules={[ {required: true, message: '请填写更改后的手机号'},{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                    <Input placeholder='更改后的手机号'/>
                </Form.Item>
                <Form.Item label='图片'>
                    <ImageUploadPng onImageUpload={onImageUpload} oldBase64={oldBase64}/>
                    {/* 有图片才渲染预览区域 */}
                    {imgName.length > 0 && (
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
                    )}
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        {
                            renameStatus!==2? <Button type="primary" htmlType="submit">确定编辑</Button>:''
                        }
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (EditRename)