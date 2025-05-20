import {Button, DatePicker, Form, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history,useNavigate} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as ByStagesService from '@/services/byStages';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
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
    const getInfo=(e)=>{
        ByStagesService.one(e).then((res:TypeErrorCode)=>{
            setspinning(true);
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
        props.dispatch({
            type:"ByStages/edit",
            payload:{uid,futureRent,fqStartDate,fqEndDate,hkEndDate,hkStartDate}
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
                <Form.Item label='备注'>
                    <span style={{fontSize:'12px',color:'#555'}}>分期开始/结束月份每月分期租金分配给还款开始/结束日期</span>
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