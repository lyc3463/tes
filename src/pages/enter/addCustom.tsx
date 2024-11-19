import {Button, DatePicker, Form, Input, message} from "antd";
import {useState} from "react";
import {connect, history} from "umi";
import {phonePattern} from "@/utils/OpenTool";

const tailLayout = {
    wrapperCol: { offset: 4 },
};


const AddCustom=(props:any)=>{
    const [form] = Form.useForm();
    const [custom_date,setCustom_date]=useState('');
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Custom/add',
            payload:{...values,custom_date}
        });
        console.log(res)
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/enter/custom')
        }else {
            message.error(res.Data)
        }
    }
    const getDataInfo=(_,value)=>{
        setCustom_date(value)
    }
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                initialValues={{visitor_type: '',visitor_position:'',company_name:'',industry:'',visitor_channels:'',intermediary_name:'',office_area:'',reason_lease:'',demands:'',required_area:'',remark:''}}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='登记日期'>
                    <DatePicker onChange={getDataInfo}/>
                </Form.Item>
                <Form.Item label='客户姓名' name='custom_name' rules={[{required: true, message: '请输入客户姓名' }]}>
                    <Input placeholder='客户姓名'/>
                </Form.Item>
                <Form.Item label='访客类别' name='visitor_type'>
                    <Input placeholder='访客类别'/>
                </Form.Item>
                <Form.Item label='访客职位' name='visitor_position'>
                    <Input placeholder='访客职位'/>
                </Form.Item>
                <Form.Item label='公司名称' name='company_name'>
                    <Input placeholder='请填写公司'/>
                </Form.Item>
                <Form.Item label='行业' name='industry'>
                    <Input placeholder='行业'/>
                </Form.Item>
                <Form.Item label='联系方式' name='phone' rules={[{required: true, message: '请输入手机号' },{pattern: phonePattern, message: '请输入有效的手机号'}]}>
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
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (AddCustom)