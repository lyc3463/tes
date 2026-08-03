import {connect} from "umi";
import * as CarManageService from '@/services/carManage';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {EventMgr} from "@/Event/EventMgr";
import {info_event} from "@/Event/EventEnum";
import {Button, Form, Image, Input, InputNumber, message, Spin, Tag} from "antd";
import {useEffect, useRef, useState} from "react";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const  CarInfo=(props)=>{
    const [spinning,setspinning]=useState(false);
    const formRef=useRef();
    const [carNoColor,setcarNoColor]=useState('');// 车辆颜色
    const [carType,setcarType]=useState('');// 车辆类型
    const [driverLicenseBase64,setdriverLicenseBase64]=useState('');//驾驶证
    const [drivingLicenseBase64,setdrivingLicenseBase64]=useState('');//行驶证
    const getCarInfo=(e:string)=>{
        setspinning(true);
        CarManageService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res',res)
                formRef.current.setFieldsValue(res.Data);
                setspinning(false);

                setdriverLicenseBase64(res.Data.driverLicense);
                setdrivingLicenseBase64(res.Data.drivingLicense);
                setcarNoColor(res.Data.carNoColor);
                setcarType(res.Data.carType);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const colorText=(item)=>{
        let consumptionTypeText;
        switch (item) {
            case 'BLUE':
                consumptionTypeText = <Tag >蓝色</Tag>;
                break;
            case 'GREEN':
                consumptionTypeText = <Tag>绿色</Tag>;
                break;
            case 'WHITE':
                consumptionTypeText = <Tag>白色</Tag>;
                break;
            case 'YELLOW':
                consumptionTypeText = <Tag>黄色</Tag>;
                break;
            case 'BLACK':
                consumptionTypeText = <Tag>黑色</Tag>;
                break;
            default:
                consumptionTypeText = <Tag>其余颜色</Tag>;
        }
        return (
            consumptionTypeText
        );
    };
    const carTypeList=(item)=>{
        let consumptionTypeText;
        switch (item) {
            case 'CAR':
                consumptionTypeText = <Tag >小车</Tag>;
                break;
            case 'LARGE':
                consumptionTypeText = <Tag>大车</Tag>;
                break;
            case 'EXTRA_LARGE':
                consumptionTypeText = <Tag>超大车</Tag>;
                break;
            default:
                consumptionTypeText = <Tag>其余类型</Tag>;
        }
        return (
            consumptionTypeText
        );
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getCarInfo(id);
    }, []);
    const toList=()=>{
        history.back();
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                initialValues={{remark:'',minimum_recharge:1}}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='车牌' name='carNo'>
                    <Input/>
                </Form.Item>
                <Form.Item label='颜色'>
                    {colorText(carNoColor)}
                </Form.Item>
                <Form.Item label='车辆类型'>
                    {carTypeList(carType)}
                </Form.Item>
                <Form.Item label='驾驶证'>
                    <Image src={`${window.ServerConfig.imgServer}${driverLicenseBase64}.png` } style={{height:'80px',width:'80px'}}/>
                </Form.Item>
                <Form.Item label='行驶证'>
                    <Image src={`${window.ServerConfig.imgServer}${drivingLicenseBase64}.png` } style={{height:'80px',width:'80px'}}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" onClick={toList}>
                        返回
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (CarInfo)