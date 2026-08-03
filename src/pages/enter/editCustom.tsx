import {connect, history,useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import * as CustomServer from "@/services/custom";
import {Button, DatePicker, Form, Input, message, Select, Space, Spin, Tooltip} from "antd";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {phonePattern, replaceEnglishCommasWithChinese} from "@/utils/OpenTool";
dayjs.extend(customParseFormat);

const EditCustom=(props)=>{
    const navigate=useNavigate();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [custom_date,setCustom_date]=useState('2000-01-10');
    // 来访渠道
    const [visitor_channels,setvisitor_channels]=useState(1);
    // 客户类别
    const [visitor_type,setvisitor_type]=useState(1);
    // 租赁原因
    const [reason_lease,setreason_lease]=useState(1);
    // 需求面积
    const [required_area,setrequired_area]=useState(1);
    // 监听产品需求
    const [demands,setdemands]=useState(1);
    const [disp,setDisp]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [remark,setremark]=useState('');
    // 获取单个信息详情
    const getOneCustom=async (id:string)=>{
        let res:any=await  CustomServer.one(id);
        if (res.ErrorCode==0){
            console.log("客户详情",res);
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setvisitor_channels(res.Data.visitor_channels);
            setreason_lease(res.Data.reason_lease);
            setrequired_area(res.Data.required_area);
            setdemands(res.Data.demands);
            setremark(res.Data.remark);
            setCustom_date(dayjs(data.custom_date).format('YYYY-MM-DD'))
        }else {
            message.error(res.Data);
        }
    };
    const onFinish=async (values)=>{
        setDisp(true);
        setspinning(true);
        let res=await props.dispatch({
            type:'Custom/edit',
            payload:{...values,custom_date,uid,visitor_channels,visitor_type,reason_lease,required_area,demands,remark}
        })
        if (res.ErrorCode==0){
            setDisp(false);
            setspinning(false);
            message.success('修改成功');
            history.push('/enter/custom');
        }else {
            setspinning(false);
            setDisp(false);
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneCustom(id)
    },[]);
    const getDataInfo=(_,value)=>{
        setCustom_date(value);
    };
    // 监听来访渠道
    const changechannels=(e)=>{
        setvisitor_channels(e);
    };
    // 监听客户类别
    const  changevisitor_type=(e)=>{
        setvisitor_type(e);
    };
    // 监听客户类别
    const changereason_lease=(e)=>{
        setreason_lease(e);
    };
    // 监听需求面积
    const changerequired_area=(e)=>{
        setrequired_area(e);
    };
    // 监听产品需求
    const changedemands=(e)=>{
        setdemands(e);
    };
    // 监听输入的文本
    const changeremark=(e)=>{
        let a=replaceEnglishCommasWithChinese(e.target.value);
        setremark(a);
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
        <Spin spinning={spinning}>
            <div style={{ padding: '20px' }}>
                <Form
                    ref={formRef}
                    initialValues={{intermediary_company:'',required_area:1,visitor_position:'',company_name:'',industry:'',visitor_channels:1,intermediary_name:'',office_area:'',reason_lease:1,demands:1,remark:'',visitor_type:1,intermediary_phone:''}}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
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
                                <BlockRadio active={required_area === 1} onClick={() => changerequired_area(1)}>100m²以下</BlockRadio>
                                <BlockRadio active={required_area === 2} onClick={() => changerequired_area(2)}>101-200m²</BlockRadio>
                                <BlockRadio active={required_area === 3} onClick={() => changerequired_area(3)}>201-350m²</BlockRadio>
                                <BlockRadio active={required_area === 4} onClick={() => changerequired_area(4)}>351-500m²</BlockRadio>
                                <BlockRadio active={required_area === 5} onClick={() => changerequired_area(5)}>501-1000m²</BlockRadio>
                                <BlockRadio active={required_area === 6} onClick={() => changerequired_area(6)}>1000m²以上</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="租赁原因" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={reason_lease === 1} onClick={() => changereason_lease(1)}>首次经营</BlockRadio>
                                <BlockRadio active={reason_lease === 2} onClick={() => changereason_lease(2)}>平迁</BlockRadio>
                                <BlockRadio active={reason_lease === 3} onClick={() => changereason_lease(3)}>合同到期</BlockRadio>
                                <BlockRadio active={reason_lease === 4} onClick={() => changereason_lease(4)}>扩大</BlockRadio>
                                <BlockRadio active={reason_lease === 5} onClick={() => changereason_lease(5)}>缩小</BlockRadio>
                                <BlockRadio active={reason_lease === 6} onClick={() => changereason_lease(6)}>开设分点</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="产品需求" style={{ marginBottom: '16px' }}>
                            <Space size={0}>
                                <BlockRadio active={demands === 1} onClick={() => changedemands(1)}>精装修</BlockRadio>
                                <BlockRadio active={demands === 2} onClick={() => changedemands(2)}>简装</BlockRadio>
                                <BlockRadio active={demands === 3} onClick={() => changedemands(3)}>毛坯</BlockRadio>
                            </Space>
                        </Form.Item>

                        <Form.Item label="目前办公区域" name="office_area" style={{ marginBottom: '16px' }}>
                            <Input placeholder="目前办公区域" style={{ maxWidth: '320px' }} />
                        </Form.Item>

                        <Form.Item label="备注:" name="remark" style={{ marginBottom: 0 }}>
                            <Input.TextArea
                                placeholder="备注"
                                value={remark}
                                onChange={changeremark}
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
                            <Button type="primary" htmlType="submit" disabled={disp}>
                                修改
                            </Button>
                            <Button onClick={() => navigate(-1)}>
                                返回
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}
export default connect()(EditCustom)