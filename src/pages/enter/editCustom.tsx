import {connect, history,useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import * as CustomServer from "@/services/custom";
import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {phonePattern, replaceEnglishCommasWithChinese} from "@/utils/OpenTool";
dayjs.extend(customParseFormat);
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCustom=(props)=>{
    const navigate=useNavigate();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [custom_date,setCustom_date]=useState('');
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
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                initialValues={{intermediary_company:'',required_area:1,visitor_position:'',company_name:'',industry:'',visitor_channels:1,intermediary_name:'',office_area:'',reason_lease:1,demands:1,remark:'',visitor_type:1,intermediary_phone:''}}
                size={'large'}
                onFinish={onFinish}
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
                        <Form.Item label='客户类别' style={{width:'200px'}}>
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
                        <Form.Item label='需求面积' style={{width:'250px'}}>
                            <Select onChange={changerequired_area} value={required_area}>
                                <Select.Option value={1}>100以下</Select.Option>
                                <Select.Option value={2}>101-200</Select.Option>
                                <Select.Option value={3}>201-350</Select.Option>
                                <Select.Option value={4}>351-500</Select.Option>
                                <Select.Option value={5}>501-1000</Select.Option>
                                <Select.Option value={6}>1000以上</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='租赁原因' style={{width:'250px'}}>
                            <Select onChange={changereason_lease} value={reason_lease}>
                                <Select.Option value={1}>首次经营</Select.Option>
                                <Select.Option value={2}>平迁</Select.Option>
                                <Select.Option value={3}>合同到期</Select.Option>
                                <Select.Option value={4}>扩大</Select.Option>
                                <Select.Option value={5}>缩小</Select.Option>
                                <Select.Option value={6}>开设分点</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='产品需求'  style={{width:'300px'}}>
                            <Select onChange={changedemands} value={demands}>
                                <Select.Option value={1}>精装修</Select.Option>
                                <Select.Option value={2}>简装</Select.Option>
                                <Select.Option value={3}>毛坯</Select.Option>
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
                            <Input.TextArea placeholder='备注' value={remark} onChange={changeremark}/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item>
                    {
                        visitor_channels==2?
                            <>
                                <Form.Item label='中介公司名称' name='intermediary_company' style={{display:'none',width:'200px'}}>
                                    <Input placeholder='中介公司名称'/>
                                </Form.Item>
                                <Form.Item label='中介名称' name='intermediary_name' style={{display:'none',width:'200px'}}>
                                    <Input placeholder='中介名称'/>
                                </Form.Item>
                                <Form.Item label='中介联系电话' name='intermediary_phone' style={{display:'none',width:'200px'}}>
                                    <Input placeholder='中介联系电话'/>
                                </Form.Item>

                            </>
                            :
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
                            </Form.Item>

                    }
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit" disabled={disp}>
                            确定修改
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
export default connect()(EditCustom)