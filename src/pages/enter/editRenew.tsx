import {Button, DatePicker, Form, Input, message, Select, Spin} from "antd";
import {connect,history} from 'umi'
import {useEffect, useRef, useState} from "react";
import * as RenewService from '@/services/renew';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditRenew=(props)=>{
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

    const getInfo=(e)=>{
        setspinning(true);
        RenewService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log("res",res);
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setspinning(false);
                setStartDate(res.Data.beginData);
                setEndDate(res.Data.endDate);
            }else {
                message.error(res.Data);
                setspinning(false);
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
            type:'Renew/edit',
            payload:{uid,startDate,endDate}
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
                {/*<Form.Item label='原合同开始时间' >*/}
                {/*    <Input placeholder='原合同开始时间' value={oldStartDate?dayjs(oldStartDate).format("YYYY-MM-DD"):''} disabled style={{width:"200px"}}/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label='原合同结束时间' >*/}
                {/*    <Input placeholder='原合同结束时间' value={oldEndDate?dayjs(oldEndDate).format("YYYY-MM-DD"):''} disabled style={{width:"200px"}}/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='续租合同开始时间' >
                    <Input placeholder='续租合同开始时间' value={startDate?dayjs(startDate).format("YYYY-MM-DD"):''} disabled style={{width:"200px"}}/>
                </Form.Item>
                <Form.Item label='续租结束时间'>
                    <DatePicker onChange={changeDate} value={dayjs(endDate)} minDate={startDate?dayjs(startDate,"YYYY-MM-DD"):'2099-01-01'}/>
                </Form.Item>
                <Form.Item label='注意'>
                    <span style={{color:'red',fontSize:'12px'}}>合同结束日期三个月内才允许续签</span>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定编辑
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (EditRenew)