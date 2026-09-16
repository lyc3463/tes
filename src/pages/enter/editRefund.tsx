import {Button, Form, Input, InputNumber, message, Space, Spin, Image} from "antd";
import {useEffect, useState} from "react";
import {connect, history, useNavigate} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as RefundService from "@/services/refund";
import ImageUploadPng from "@/components/ImageUploadPng";
import * as PaymentLogService from "@/services/paymentLog";

const tailLayout = {
    wrapperCol: {offset: 4},
};

const EditRefund = (props: any) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [uid, setUid] = useState('');
    // 图片上传
    const [pdfImage, setPdfImage] = useState('');
    // base64 用来显示图片
    const [fileBase64,setFileBase64]=useState('');
    // 获取图片base64
    const getImgBase64=(item:any)=>{
        setFileBase64(item);
    };

    // 获取退款申请详情
    const getOne = async (id: string) => {
        setSpinning(true);
        const res: any = await RefundService.one({uid: id});
        setSpinning(false);
        if (res.ErrorCode === 0) {
            const data = res.Data;
            setUid(data.id);
            setPdfImage(data.pdfImage || '');
            form.setFieldsValue({
                tenantId: data.tenantId,
                applyAmount: data.applyAmount,
                applyReason: data.applyReason || '',
                orderId: data.woId || '',
            });
        } else {
            message.error(res.Data);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        if (id) {
            getOne(id);
        }
    }, []);

    // 图片上传回调
    const handleImageUpload = (imgName: string) => {
        setPdfImage(imgName);
    };

    const onFinish = (values: any) => {
        setSpinning(true);
        if (!values.orderId) {
            message.warning('请先选择订单');
            setSpinning(false);
            return;
        }
        if(values.applyAmount>values.orderAmount || values.applyAmount <= 0){
            message.warning('退款金额必须大于0且不超过订单金额');
            setSpinning(false);
            return;
        }
        // 超过24小时则不允许退款
        const now = Date.now();
        PaymentLogService.fetch({orderNum: values.orderNum}).then((res: any) => {
            if (res.ErrorCode === 0) {
                const order = res.Data;
                const orderCreatedTime = new Date(order.created).getTime();
                if (now - orderCreatedTime > 24 * 60 * 60 * 1000) {
                    message.warning('超过24小时不允许退款');
                    setSpinning(false);
                    return;
                }
            }
        });
        // 请填写原因并上传订单图片
        if (!values.applyReason || !pdfImage) {
            message.warning('请填写原因并上传订单图片');
            setSpinning(false);
            return;
        }
        const params = {
            id: uid,
            applyAmount: values.applyAmount,
            applyReason: values.applyReason || '',
            pdfImage: pdfImage,
            orderId: values.orderId || '',
            jsonData: '',
        };
        RefundService.refundEdit(params).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('修改成功');
                history.push('/enter/afterSales/');
            } else {
                message.error(res.Data);
            }
        });
    };

    return (
        <Spin spinning={spinning}>
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{marginTop: '1rem'}}
            >
                <Form.Item label="租户ID" name="tenantId" hidden>
                    <Input disabled placeholder="租户ID"/>
                </Form.Item>
                <Form.Item label="订单ID" name="orderId" hidden>
                    <Input disabled placeholder="订单ID"/>
                </Form.Item>
                <Form.Item label="退款金额(元)" name="applyAmount"
                           rules={[{required: true, message: '请填写退款金额'}]}>
                    <InputNumber min={0} disabled style={{width: '100%'}} placeholder="退款金额"/>
                </Form.Item>
                <Form.Item label="退款原因" name="applyReason">
                    <Input.TextArea placeholder="退款原因"/>
                </Form.Item>
                <Form.Item label="订单图片" name="pdfImage" 
                            rules={[{required: true, message: '请上传订单图片'}]}>
                    <Space style={{display:'flex'}}>
                       <Space style={{display:'flex'}}>
                           <ImageUploadPng onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                           {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                       </Space>
                   </Space>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                        <Button type="primary" onClick={() => navigate(-1)}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default EditRefund;
