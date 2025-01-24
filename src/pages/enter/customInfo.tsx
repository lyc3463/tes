import * as CustomServer from "@/services/custom";
import dayjs from "dayjs";
import * as UmiHistory from "umi";

import {useEffect, useRef, useState} from "react";
import {Button, DatePicker, Form, Input, message, Select, Space} from "antd";
import {phonePattern} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const CustomInfo=()=>{
    const formRef=useRef();
    const [visitor_channels,setvisitor_channels]=useState(1);
    const [custom_date,setCustom_date]=useState('');
    const [visitor_type,setvisitor_type]=useState(1);
    // 获取单个客户信息
    const getOneCustom=async (id:string)=>{
        let res:any=await  CustomServer.one(id);
        if (res?.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setvisitor_channels(data.visitor_channels);
            setvisitor_type(data.visitor_type);
            setCustom_date(dayjs(data.custom_date).format('YYYY-MM-DD HH:MM:ss'))
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneCustom(id);
    },[]);

    const getDataInfo=(_,value)=>{
        setCustom_date(value);
    };
    const changechannels=(e)=>{
        setvisitor_channels(e);
    };
    const  changevisitor_type=(e)=>{
        setvisitor_type(e);
    };
    // 返回上一层
    const togoBack=()=>{
        window.history.back();
    };
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
                <Form.Item style={{display:'flex'}} {...tailLayout}>
                    <Space size='large'>
                        <Form.Item label='登记日期' style={{width:'200px'}}>
                            {
                                custom_date?<DatePicker onChange={getDataInfo} defaultValue={dayjs(custom_date)}/>:''
                            }
                        </Form.Item>
                        <Form.Item label='客户姓名' name='custom_name' rules={[{required: true, message: '请输入客户姓名' }]} style={{width:'200px'}}>
                            <Input placeholder='客户姓名'/>
                        </Form.Item>
                        <Form.Item label='联系方式' name='phone' rules={[{required: true, message: '请输入手机号' },{pattern: phonePattern, message: '请输入有效的手机号'}]} style={{width:'200px'}}>
                            <Input placeholder='联系方式'/>
                        </Form.Item>
                        <Form.Item label='来访渠道' style={{width:'200px'}}>
                            <Select onChange={changechannels} value={visitor_channels}>
                                <Select.Option value={1}>中介</Select.Option>
                                <Select.Option value={2}>自来</Select.Option>
                                <Select.Option value={3}>全民营销</Select.Option>
                                <Select.Option value={4}>线上</Select.Option>
                            </Select>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item style={{display:'flex'}} {...tailLayout}>
                    <Space size='large'>
                        <Form.Item label='公司名称' name='company_name' style={{width:'200px'}}>
                            <Input placeholder='请填写公司'/>
                        </Form.Item>
                        <Form.Item label='行业' name='industry' style={{width:'200px'}}>
                            <Input placeholder='行业'/>
                        </Form.Item>
                        <Form.Item label='客户类别'  style={{width:'200px'}}>
                            <Select onChange={changevisitor_type} value={visitor_type}>
                                <Select.Option value={2}>商业</Select.Option>
                                <Select.Option value={1}>办公</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='访客职位' name='visitor_position' style={{width:'200px'}}>
                            <Input placeholder='访客职位'/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item style={{display:'flex'}} wrapperCol={{offset: 4}}>
                    <Space size='large'>
                        <Form.Item label='需求面积' name='required_area' style={{width:'250px'}}>
                            <Select>
                                <Select.Option value={1}>精装修</Select.Option>
                                <Select.Option value={2}>简装</Select.Option>
                                <Select.Option value={3}>毛坯</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label='租赁原因' name='reason_lease' style={{width:'250px'}}>
                            <Select>
                                <Select.Option value={1}>首次经营</Select.Option>
                                <Select.Option value={2}>平迁</Select.Option>
                                <Select.Option value={3}>合同到期</Select.Option>
                                <Select.Option value={4}>扩大</Select.Option>
                                <Select.Option value={5}>缩小</Select.Option>
                                <Select.Option value={6}>开设分点</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='产品需求' name='demands' style={{width:'300px'}}>
                            <Select>
                                <Select.Option value={1}>商铺</Select.Option>
                                <Select.Option value={2}>办公</Select.Option>
                            </Select>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item style={{display:'flex'}} wrapperCol={{offset: 4}}>
                    <Space size='large'>
                        <Form.Item label='目前办公区域' name='office_area' style={{width:'300px'}}>
                            <Input placeholder='目前办公区域'/>
                        </Form.Item>
                        <Form.Item label='备注' name='remark' style={{width:'550px'}}>
                            <Input.TextArea placeholder='备注'/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item >
                    {
                        visitor_channels==1?
                            <Form.Item style={{display:'flex'}} wrapperCol={{offset: 4}}>
                                <Space>
                                    <Form.Item label='中介公司名称' name='intermediary_company' style={{width:'300px'}}>
                                        <Input placeholder='中介公司名称'/>
                                    </Form.Item>
                                    <Form.Item label='中介联系人' name='intermediary_name' style={{width:'260px'}}>
                                        <Input placeholder='中介联系人'/>
                                    </Form.Item>
                                    <Form.Item label='中介联系电话' name='intermediary_phone' style={{width:'260px'}}>
                                        <Input placeholder='中介联系电话'/>
                                    </Form.Item>
                                </Space>
                            </Form.Item>:''
                    }
                </Form.Item>
                <Form.Item  {...tailLayout}>
                   <Button onClick={togoBack} type='primary'>返回</Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default CustomInfo