import {Button, DatePicker, Form, Input, message, Select, Space, Spin, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {connect, history} from "umi";
import {getCurrentDate, phonePattern,replaceEnglishCommasWithChinese} from "@/utils/OpenTool";
import dayjs from "dayjs";

const tailLayout = {
    wrapperCol: { offset: 4 },
};


const AddCustom=(props:any)=>{
    const [form] = Form.useForm();
    const [custom_date,setCustom_date]=useState(getCurrentDate());
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
    const [remark,setremarks]=useState('');
    const [spinning,setspinning]=useState(false);
    // 客户名字
    const [custom_name,setcustom_name]=useState('');
    // 公司名称
    const [company_name,setcompany_name]=useState('');
    useEffect(() => {
        setCustom_date(getCurrentDate());
    }, []);
    const onFinish=async (values)=>{
        setDisp(true);
        setspinning(true);
        let res=await props.dispatch({
            type:'Custom/add',
            payload:{...values,custom_date,visitor_channels,visitor_type,reason_lease,required_area,demands,remark,custom_name,company_name}
        });
        if (res.ErrorCode==0){
            setDisp(false);
            setspinning(false);
            message.success('添加成功')
            history.push('/enter/custom')
        }else {
            setDisp(false);
            setspinning(false);
            message.error(res.Data);
        }
    }
    const getDataInfo=(_,value)=>{
        setCustom_date(value)
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
    const changeremarks=(e)=>{
        let a=replaceEnglishCommasWithChinese(e.target.value);
        setremarks(a);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                initialValues={{intermediary_company:'',required_area:1,visitor_position:'',industry:'',visitor_channels:1,intermediary_name:'',office_area:'',reason_lease:1,demands:1,remark:'',visitor_type:1,intermediary_phone:''}}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item style={{display:'flex'}} {...tailLayout}>
                    <Space size='large'>
                        <Form.Item label='登记日期' style={{width:'200px'}}>
                            <DatePicker onChange={getDataInfo} defaultValue={dayjs(custom_date)}/>
                        </Form.Item>
                        <Form.Item label='客户姓名' style={{width:'200px'}}>
                            <Tooltip title={custom_name} >
                                <Input placeholder='客户姓名' onChange={(e)=>setcustom_name(e.target.value)}/>
                            </Tooltip>
                        </Form.Item>
                        <Form.Item label='联系方式' name='phone' rules={[{required: true, message: '请输入手机号' },{pattern: phonePattern, message: '请输入有效的手机号'}]} style={{width:'250px'}}>
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
                        <Form.Item label='公司名称' style={{width:'200px'}}>
                            <Tooltip title={company_name} >
                                <Input placeholder='请填写公司' onChange={(e)=>setcompany_name(e.target.value)}/>
                            </Tooltip>
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
                            <Input.TextArea placeholder='备注' value={remark} onChange={changeremarks}/>
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
                            </Form.Item>
                            :
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
                    }
                </Form.Item>
                <Form.Item  style={{textAlign:'center'}}>
                    <Button type="primary" htmlType="submit"  disabled={disp}>
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddCustom)