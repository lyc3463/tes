import {Button, DatePicker, Form, Input, message, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import * as RechargeService from '@/services/recharge';
import {StaticInfo} from "@/StaticInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {useNavigate,connect} from "umi";
import styles from "@/pages/message/recharge.less";
import Myqrcode from "@/components/Myqrcode";
import ErrorCodeType from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const RenewPark=(props)=>{
    const navigate=useNavigate();
    const [spinning,setspinning]=useState(false);
    const [original_price,setoriginal_price]=useState(0);//原价格
    const [set_meal_price,setset_meal_price]=useState(0);//优惠后价格
    const [set_meal_name,setset_meal_name]=useState('');// 套餐名称
    const [describe,setdescribe]=useState('');// 套餐描述
    const [iszhifu,setiszhifu]=useState(true);
    const [isTihuan,setIsTihuan]=useState(false);
    const [code,setCode]=useState('');
    const [bengiTime,setBengiTime]=useState(StaticInfo.beginTime||'2001-01-01');
    const [endDate,setEndDate]=useState(StaticInfo.endTime||'2001-01-01');

    const getMeunInfo=()=>{
        setspinning(true);
        RechargeService.infoMealId(StaticInfo.meal_id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setoriginal_price(res.Data.original_price);
                setset_meal_price(res.Data.set_meal_price);
                setset_meal_name(res.Data.set_meal_name);
                setset_meal_name(res.Data.set_meal_name);
                setdescribe(res.Data.describe);
                setiszhifu(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getMeunInfo();
    }, []);
    const tozhifu=()=>{
        if (set_meal_price<0){
            message.warning('金额错误');
        }else {
            let newMoney=set_meal_price*100;
            let remarks=`园区续费一年，金额${set_meal_price}元`;
            const originalDate = dayjs(endDate);
            const startDate = originalDate.add(1, 'year');
            props.dispatch({
                type:'Recharge/addchongzhi',
                payload:{newMoney,remarks,numberItems:0,rechargetype:4,startDate:dayjs(startDate).format('YYYY-MM-DD')}
            }).then((res:ErrorCodeType)=>{
                if (res.ErrorCode==0){
                    setCode(res.Data);
                    setIsTihuan(true);
                }else {
                    message.error(res.Data);
                }
            });
        }
    };
    const cancelOk=()=>{
        setIsTihuan(false);
    };
    return(
        <Spin spinning={spinning}>
            {
                isTihuan?<div style={{  paddingLeft:'100px'}}>
                    <div><span style={{fontSize:'16px',color:'red'}}>请使用微信扫码支付↓</span></div>
                    <div className={styles.qrBox}>
                        <Myqrcode value={code}></Myqrcode>
                    </div>
                    <div className={styles.okCss}>付款成功后,如没反应请退出重新登录查看园区有效期</div>
                    <Space>
                        <Button type='primary' onClick={cancelOk}>离开</Button>
                    </Space>
                </div>: <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size={'large'}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label='套餐名称'>
                        <Input value={set_meal_name} disabled/>
                    </Form.Item>
                    <Form.Item label='套餐描述'>
                        <Input value={describe} disabled/>
                    </Form.Item>
                    <Form.Item label='原价格(元)'>
                        <Input value={original_price} disabled/>
                    </Form.Item>
                    <Form.Item label='优惠价格(元)'>
                        <Input value={set_meal_price} disabled/>
                    </Form.Item>
                    <Form.Item label='园区有效期'>
                        <DatePicker.RangePicker disabled defaultValue={[dayjs(bengiTime),dayjs(endDate)]}/>
                    </Form.Item>
                    {/*<Form.Item label='注意'>*/}
                    {/*    <span>续费园区时长一年</span>*/}
                    {/*</Form.Item>*/}
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" onClick={tozhifu} disabled={iszhifu}>
                                续费
                            </Button>
                            <Button type="primary" onClick={()=>navigate(-1)}>
                                返回
                            </Button>
                        </Space>

                    </Form.Item>
                </Form>
            }
        </Spin>
    )
}
export default connect() (RenewPark)