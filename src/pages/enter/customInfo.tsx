import * as CustomServer from "@/services/custom";
import dayjs from "dayjs";
import {connect, history,useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";
import {phonePattern} from "@/utils/OpenTool";

const CustomInfo=()=>{
    const navigate=useNavigate();
    const formRef=useRef();
    const [visitor_channels,setvisitor_channels]=useState(1);
    const [custom_date,setCustom_date]=useState('2020-01-01');
    const [visitor_type,setvisitor_type]=useState(1);
    const [demands,setdemands]=useState(1);
    const [required_area,setrequired_area]=useState(1);
    const [reason_lease,setreason_lease]=useState(1);


    // 获取单个客户信息
    const getOneCustom=async (id:string)=>{
        let res:any=await  CustomServer.one(id);
        if (res?.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setvisitor_channels(data.visitor_channels);
            setvisitor_type(data.visitor_type);
            setdemands(res.Data.demands);
            setreason_lease(res.Data.reason_lease);
            setrequired_area(res.Data.required_area);
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
    const BlockRadio = ({ active, onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding: '5px 16px',
                border: '1px solid #e5e7eb',
                background: active ? '#1677ff' : '#f5f7fa',
                color: active ? '#ffffff' : '#333333',
                borderRadius: 2,
                marginRight: 6,
                cursor: 'pointer',
                fontSize: 14
            }}
        >
            {children}
        </button>
    )
    return(
            <div style={{ padding: '20px' }}>
                <Form
                    ref={formRef}
                    initialValues={{intermediary_company:'',required_area:1,visitor_position:'',company_name:'',industry:'',visitor_channels:1,intermediary_name:'',office_area:'',reason_lease:1,demands:1,remark:'',visitor_type:1,intermediary_phone:''}}
                    layout="horizontal"
                    size={'large'}
                >
                    <div style={{ border: '2px solid #4096ff', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
                        <h3 style={{ color: '#1677ff', margin: '0 0 24px 0', fontSize: '18px' }}>01 职位基本信息</h3>
                        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', alignItems: 'center' }}>
                            <Form.Item label="登记日期" style={{ marginBottom: 0, width: '260px' }}>
                                <DatePicker style={{ width: '100%' }} onChange={getDataInfo} value={dayjs(custom_date)} />
                            </Form.Item>
                            <Form.Item label="客户姓名" style={{ marginBottom: 0, flex: 1 }} name='custom_name' rules={[{required: true, message: '请输入客户姓名' }]}>
                                <Input placeholder="客户姓名"/>
                            </Form.Item>
                            <Form.Item
                                label="联系方式"
                                name="phone"
                                rules={[{ required: true, message: '请输入手机号' }, { pattern: phonePattern, message: '请输入有效的手机号' }]}
                                style={{ marginBottom: 0, flex: 1 }}
                            >
                                <Input placeholder="联系方式" />
                            </Form.Item>
                        </div>

                        {/* 第二行：公司名称、行业、客户类别、访客职位 */}
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <Form.Item label="公司名称" style={{ marginBottom: 0, flex: 2 }} name='company_name'>
                                <Input placeholder="请填写公司" />
                            </Form.Item>
                            <Form.Item label="行 业:" name="industry" style={{ marginBottom: 0, flex: 1 }}>
                                <Input placeholder="行业" />
                            </Form.Item>
                            <Form.Item label="客户类别" style={{ marginBottom: 0, width: '220px' }}>
                                <Space size={0}>
                                    <BlockRadio active={visitor_type === 1} onClick={() => changevisitor_type(1)}>办公</BlockRadio>
                                    <BlockRadio active={visitor_type === 2} onClick={() => changevisitor_type(2)}>商业</BlockRadio>
                                </Space>
                            </Form.Item>
                            <Form.Item label="访客职位" style={{ marginBottom: 0, flex: 1 }} name='visitor_position'>
                                <Input placeholder="访客职位" />
                            </Form.Item>
                        </div>
                    </div>

                    <div style={{ border: '2px solid #4096ff', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
                        <h3 style={{ color: '#1677ff', margin: '0 0 24px 0', fontSize: '18px' }}>02 办公租赁需求信息</h3>
                        <Form.Item label="来访渠道" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={visitor_channels === 1} onClick={() => changechannels(1)}>中介</BlockRadio>
                                <BlockRadio active={visitor_channels === 2} onClick={() => changechannels(2)}>自来</BlockRadio>
                                <BlockRadio active={visitor_channels === 3} onClick={() => changechannels(3)}>全民营销</BlockRadio>
                                <BlockRadio active={visitor_channels === 4} onClick={() => changechannels(4)}>线上</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="需求面积" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={required_area === 1}>100m²以下</BlockRadio>
                                <BlockRadio active={required_area === 2}>101-200m²</BlockRadio>
                                <BlockRadio active={required_area === 3}>201-350m²</BlockRadio>
                                <BlockRadio active={required_area === 4}>351-500m²</BlockRadio>
                                <BlockRadio active={required_area === 5}>501-1000m²</BlockRadio>
                                <BlockRadio active={required_area === 6}>1000m²以上</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="租赁原因" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={reason_lease === 1}>首次经营</BlockRadio>
                                <BlockRadio active={reason_lease === 2}>平迁</BlockRadio>
                                <BlockRadio active={reason_lease === 3}>合同到期</BlockRadio>
                                <BlockRadio active={reason_lease === 4}>扩大</BlockRadio>
                                <BlockRadio active={reason_lease === 5}>缩小</BlockRadio>
                                <BlockRadio active={reason_lease === 6}>开设分点</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="产品需求" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={demands === 1}>精装修</BlockRadio>
                                <BlockRadio active={demands === 2}>简装</BlockRadio>
                                <BlockRadio active={demands === 3}>毛坯</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="目前办公区域" name="office_area" style={{ marginBottom: '16px' }}>
                            <Input placeholder="目前办公区域" style={{ maxWidth: '320px' }} />
                        </Form.Item>

                        <Form.Item label="备注:" name="remark" style={{ marginBottom: 0 }}>
                            <Input.TextArea
                                placeholder="备注"
                                rows={1}
                            />
                        </Form.Item>
                    </div>
                    {/* ========== 03 合作中介信息 区块 仅中介渠道显示 ========== */}
                    {visitor_channels === 1 && (
                        <div style={{ border: '2px solid #4096ff', padding: '20px', borderRadius: '6px', marginBottom: '32px' }}>
                            <h3 style={{ color: '#1677ff', margin: '0 0 24px 0', fontSize: '18px' }}>03 合作中介信息</h3>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <Form.Item label="中介公司名称" name="intermediary_company" style={{ marginBottom: 0, flex: 1 }}>
                                    <Input placeholder="中介公司名称" />
                                </Form.Item>
                                <Form.Item label="中介联系人" name="intermediary_name" style={{ marginBottom: 0, flex: 1 }}>
                                    <Input placeholder="中介联系人" />
                                </Form.Item>
                                <Form.Item label="中介联系电话" name="intermediary_phone" style={{ marginBottom: 0, flex: 1 }}>
                                    <Input placeholder="中介联系电话" />
                                </Form.Item>
                            </div>
                        </div>
                    )}
                    <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
    )
}
export default CustomInfo