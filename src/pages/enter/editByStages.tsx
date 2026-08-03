import {Button, DatePicker, Form, Image, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as ByStagesService from '@/services/byStages';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import ImageUpload from "@/components/ImageUploader";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const editByStages=(props)=>{
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
    // 分期开始时间
    const [fqStartDate,setFqStartDate]=useState('2000-01');
    // 分期结束时间
    const [fqEndDate,setfqEndDate]=useState('2001-01');
    // 分期开始时间
    const [hkStartDate,sethkStartDate]=useState('');
    // 分期结束时间
    const [hkEndDate,sethkEndDate]=useState('');
    const [futureRent,setfutureRent]=useState(0);
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName,setImgName]=useState<string[]>([]);
    const getInfo=(e)=>{
        ByStagesService.one(e).then((res:TypeErrorCode)=>{
            setspinning(true);
            console.log('详情',res);
            if (res.ErrorCode==0){
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                // formRef.current.setFieldsValue(res.Data);
                // setStartDate(res.Data.refundData);
                setFqStartDate(res.Data.staBeginTime);
                setfqEndDate(res.Data.staEndTime);
                sethkStartDate(res.Data.staBeginTime2);
                sethkEndDate(res.Data.staEndTime2);
                setfutureRent(res.Data.staRent);
                setspinning(false);
                setImgName(res.Data.pdfImage.split("|"));
                setImgB64(res.Data.pdfImageBase64.split("|"));
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
            type:"ByStages/edit",
            payload:{uid,futureRent,fqStartDate,fqEndDate,hkEndDate,hkStartDate,imgList}
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
    const changeFqdate=(_:any,date:any)=>{
        setFqStartDate(date[0]+'-01');
        setfqEndDate(date[1]+'-01');
    };
    const changehkdate=(_:any,date:any)=>{
        sethkStartDate(date[0]+'-01');
        sethkEndDate(date[1]+'-01');
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
        const newName = [...imgName];
        const newB64 = [...imgB64];
        newB64.splice(index, 1);
        newB64.splice(index, 1);
        setImgName(newName);
        setImgB64(newB64);
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
                <Form.Item label='分期开始/结束时间'>
                    <DatePicker.RangePicker picker="month" onChange={changeFqdate} value={[dayjs(fqStartDate),dayjs(fqEndDate)]}/>
                </Form.Item>
                <Form.Item label='还款开始/结束时间'>
                    <DatePicker.RangePicker picker="month"  onChange={changehkdate} value={[dayjs(hkStartDate),dayjs(hkEndDate)]}/>
                </Form.Item>
                <Form.Item label='每月分期租金(元)'>
                    <InputNumber value={futureRent} min={0} onChange={(e)=>setfutureRent(e)}/>
                </Form.Item>
                <Form.Item label='图片'>
                    <ImageUpload onImageUpload={onImageUpload} oldBase64={oldBase64}/>
                    {/* 有图片才渲染预览区域 */}
                    {imgB64.length > 0 && (
                        <Space wrap size={10} style={{ marginTop: 10 }}>
                            {imgB64.map((item, index) => (
                                <div key={index} style={{ position: "relative" }}>
                                    <Image
                                        src={item}
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
                        <Button type="primary" htmlType="submit">
                            确定编辑
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
export default connect() (editByStages)