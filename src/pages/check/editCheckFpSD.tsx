import {Button, DatePicker, Form, Image, Input, InputNumber, message, Modal, Select, Spin, Tag} from "antd";
import {useEffect, useRef, useState} from "react";
import {history,useLocation,connect} from "umi";
import * as CheckFpService from '@/services/checkFpSD';
import dayjs from "dayjs";
import ImageUploader from "@/components/ImageUploader";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCheckFpSD=(props:any)=>{
    const location=useLocation();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [rise_type,setRise_type]=useState(0);
    const [duty_paragraph,setDuty_paragraph]=useState('');
    const [emailOrPhone,setEmailOrPhone]=useState('');
    const [bankDeposit,setBankDeposit]=useState('');
    const [bankCard,setBankCard]=useState('');
    const [work_phone,setWork_phone]=useState('');
    const [work_address,setWork_address]=useState('');
    const [consumptionType,setConsumptionType]=useState(0);
    const [consumptionMoney,setConsumptionMoney]=useState(0);
    const [openID,setOpenid]=useState('');
    const [open,setOpen]=useState(false);
    const [upimg,setUpImg]=useState('');
    const [imgB64,setImgB64]=useState('');
    const [email,setemail]=useState('');
    const [phone,setphone]=useState('');
    const [invoiceType,setinvoiceType]=useState(0);
    const [rise_name,setrise_name]=useState('');
    const [isSpinning,setIsSpinning]=useState(false);
    const [tenant_name,settenant_name]=useState('');
    // 获取发票详情
    const getOneCustom=async (id:string)=>{
        let res:any=await  CheckFpService.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            console.log("发票详情",data);
            setRise_type(data[1].rise_type);
            setDuty_paragraph(data[1].duty_paragraph);
            setphone(data[1].phone);
            setemail(data[1].email);
            setBankDeposit(data[1].bankDeposit);
            setBankCard(data[1].bankCard);
            setWork_phone(data[1].work_phone);
            setWork_address(data[1].work_address);
            setOpenid(data[0].openId);
            setConsumptionType(data[0].consumptionType);
            setConsumptionMoney(data[0].consumptionMoney);
            setinvoiceType(data[0].invoiceType);
            setrise_name(data[0].rise_name);
            settenant_name(data[0].tenant_name);
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id);
    },[]);
    const bianji=(item)=>{
        let consumptionTypeText;
        switch (item) {
            case 1:
                consumptionTypeText = <Input value='电费'/>;
                break;
            case 2:
                consumptionTypeText =<Input value='水费'/>;
                break;
            default:
                consumptionTypeText =<Input value='未知类型'/>;
        }
        return (
            consumptionTypeText
        );
    };
    const onOK=(val)=>{
        setIsSpinning(true);
        props.dispatch({
            type:'TenantInfo/add',
            payload:{...val,openID,upimg}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('发送成功');
                setOpen(false);
                setIsSpinning(false);
                chekOk();
                history.push('/check/checkFp/')
            }else {
                message.error(res.Data);
                setOpen(false);
            }
        })
    };
    const onimgname=(item:string)=>{
        setUpImg(item);
    };
    const onb64=(item:string)=>{
        setImgB64(item);

    };
    const onFs=()=>{
        setOpen(true);
    };
    const chekOk=()=>{
        props.dispatch({
            type:'CheckFp/check',
            payload:{uid,stutes:2}
        })
    };
    return(
        <Spin spinning={isSpinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='租户姓名'>
                    <Input value={tenant_name}/>
                </Form.Item>
                <Form.Item label='抬头名称'>
                    <Input value={rise_name}/>
                </Form.Item>
                <Form.Item label='抬头类型'>
                    <Input value={rise_type==1?'企业':'个人'}/>
                </Form.Item>
                <Form.Item label='账单类型'>
                    {bianji(consumptionType)}
                </Form.Item>
                <Form.Item label='发票类型'>
                    <Input value={invoiceType==1?'专票':'普票'}/>
                </Form.Item>
                <Form.Item label='开票金额(元)'>
                    <InputNumber placeholder='开票金额' value={consumptionMoney}/>
                </Form.Item>
                <Form.Item label='税号'>
                    <Input placeholder='税号' value={duty_paragraph}/>
                </Form.Item>
                <Form.Item label='邮箱'>
                    <Input placeholder='手机/邮箱' value={email}/>
                </Form.Item>
                <Form.Item label='手机号'>
                    <Input placeholder='手机/邮箱' value={phone}/>
                </Form.Item>
                <Form.Item label='(选填信息)'>
                </Form.Item>
                <Form.Item label='开户银行'>
                    <Input placeholder='开户银行' value={bankDeposit}/>
                </Form.Item>
                <Form.Item label='银行卡号'>
                    <Input placeholder='银行卡号' value={bankCard}/>
                </Form.Item>
                <Form.Item label='单位号码'>
                    <Input placeholder='单位号码' value={work_phone}/>
                </Form.Item>
                <Form.Item label='单位地址'>
                    <Input placeholder='单位地址' value={work_address}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" onClick={onFs}>
                        发送
                    </Button>
                </Form.Item>
            </Form>
            <Modal open={open} onCancel={()=>setOpen(false)}  title={'发送'} footer={null}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size={'large'}
                    style={{ marginTop: '1rem' }}
                    onFinish={onOK}
                >
                    <Form.Item label='消息内容' name='conten' rules={[{required: true, message: '请填写内容'}]}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item label='图片'>
                        <ImageUploader onImageUpload={onimgname} oldBase64={onb64}/>
                        {imgB64?<Image src={imgB64} style={{width:'100px',height:'100px'}}/>:''}
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary"  htmlType="submit">
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}
// const mapStateToProps = (state: any) => {
//     return {
//         CustomList: state.checkOutRent.list,
//         count: state.checkOutRent.count
//     }
// };
export default connect() (EditCheckFpSD)