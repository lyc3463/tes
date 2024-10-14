import * as CustomServer from "@/services/custom";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {Button, DatePicker, Form, Input} from "antd";
const CustomInfo=()=>{
    const formRef=useRef();
    const [custom_date,setCustom_date]=useState('');
    // 获取单个客户信息
    const getOneCustom=async (id:string)=>{
        let res=await  CustomServer.one(id);
        if (res?.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setCustom_date(dayjs(data.custom_date).format('YYYY-MM-DD HH:MM:ss'))
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneCustom(id);
    },[]);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='登记日期'>
                    {custom_date? <DatePicker defaultValue={dayjs(custom_date)}/>:''}
                </Form.Item>
                <Form.Item label='客户姓名' name='custom_name'>
                    <Input placeholder='客户姓名'/>
                </Form.Item>
                <Form.Item label='访客类别' name='visitor_type'>
                    <Input placeholder='访客类别'/>
                </Form.Item>
                <Form.Item label='访客职位' name='visitor_position'>
                    <Input placeholder='访客类别'/>
                </Form.Item>
                <Form.Item label='公司名称' name='company_name'>
                    <Input placeholder='请填写公司'/>
                </Form.Item>
                <Form.Item label='行业' name='industry'>
                    <Input placeholder='行业'/>
                </Form.Item>
                <Form.Item label='联系方式' name='phone'>
                    <Input placeholder='联系方式'/>
                </Form.Item>
                <Form.Item label='来访渠道' name='visitor_channels'>
                    <Input placeholder='来访渠道'/>
                </Form.Item>
                <Form.Item label='中介名称' name='intermediary_name'>
                    <Input placeholder='中介名称'/>
                </Form.Item>
                <Form.Item label='目前办公区域' name='office_area'>
                    <Input placeholder='目前办公区域'/>
                </Form.Item>
                <Form.Item label='租赁原因' name='reason_lease'>
                    <Input placeholder='租赁原因'/>
                </Form.Item>
                <Form.Item label='产品需求' name='demands'>
                    <Input placeholder='产品需求'/>
                </Form.Item>
                <Form.Item label='需求面积' name='required_area'>
                    <Input placeholder='需求面积'/>
                </Form.Item>
                <Form.Item label='备注' name='remark'>
                    <Input.TextArea placeholder='备注'/>
                </Form.Item>
            </Form>
        </div>
    )
}
export default CustomInfo