import {Button, DatePicker, Form, Image, Input, message, Select, Space, Spin} from "antd";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as RenewService from '@/services/renew';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import ImageUpload from "@/components/ImageUploader";
import ImageUploadPng from "@/components/ImageUploadPng";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditRenew=(props)=>{
    const navigate=useNavigate();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    // 原合同开始时间
    const [oldStartDate,setoldStartDate]=useState('');
    // 原合同结束时间
    const [oldEndDate,setoldEndDate]=useState('');
    // 续租开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 到期时间
    const [endDate,setEndDate]=useState('2000-01-01');
    const [spinning,setspinning]=useState(false);
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName,setImgName]=useState<string[]>([]);
    const [renewStatus,setRenewStatus]=useState(0);

    const getInfo=(e)=>{
        setspinning(true);
        RenewService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setspinning(false);
                setStartDate(res.Data.beginData);
                setEndDate(res.Data.endDate);
                setImgName(res.Data.pdfImage.split("|"));
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        const renewStatus = searchParams.get('renewStatus');
        setRenewStatus(Number(renewStatus));
        setUid(id);
        getInfo(id);
    }, []);
    const onFinish=(val)=>{
        console.log('res',val);
        setspinning(true);
        const imgList=imgName.join('|');
        props.dispatch({
            type:'Renew/edit',
            payload:{uid,startDate,endDate,val,imgList}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('提交成功');
                history.push("/enter/afterSales");
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data)
            }
        })
    };
    const changeDate=(_:any,date:any)=>{
        setEndDate(date);
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
                <Form.Item label='租户姓名'>
                    <Input placeholder='租户姓名' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='租户手机号'>
                    <Input placeholder='租户手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='续租合同开始时间' >
                    <Input placeholder='续租合同开始时间' value={startDate?dayjs(startDate).format("YYYY-MM-DD"):''} disabled style={{width:"200px"}}/>
                </Form.Item>
                <Form.Item label='续租结束时间'>
                    <DatePicker onChange={changeDate} value={dayjs(endDate)} minDate={startDate?dayjs(startDate,"YYYY-MM-DD"):'2099-01-01'}/>
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
                <Form.Item label='注意'>
                    <span style={{color:'red',fontSize:'12px'}}>合同结束日期三个月内才允许续签</span>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        {
                            renewStatus==2? <Button type="primary" htmlType="submit">
                                确定编辑
                            </Button>:''
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
export default connect() (EditRenew)