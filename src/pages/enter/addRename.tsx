import {connect, history,useNavigate} from "umi";
import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";
import * as StaffService from '@/services/staff';
import {useEffect, useState} from "react";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddRename=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原身份证
    const [oldcustomCard,setoldcustomCard]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'Rename/add',
            payload:{...vals,tenantId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('提交成功');
                history.push("/enter/afterSales");
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const change=(e)=>{
        setspinning(true);
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setOldName(res.Data[0].tenant_name);
                setOldPhone(res.Data[0].tenant_phone);
                setoldcustomCard(res.Data[0].customCard);
                setTenantID(res.Data[0].tenantId);
            }else {
                setspinning(false);
                message.error(res.Data)
            }
        })
    };
    // 合同列表
    const getContntList=()=>{
        setspinning(true);
        props.dispatch({
            type:'SeleHetong/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setHetongList(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getContntList();
    }, []);
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='选择合同' name='contractId'>
                    <Select
                        onChange={change}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =hetongList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {hetongList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.identifier}-{item.tenant_name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='原名字'>
                    <Input placeholder='原名字' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='原手机号'>
                    <Input placeholder='原手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='原身份证'>
                    <Input placeholder='原身份证' value={oldcustomCard} disabled/>
                </Form.Item>
                <Form.Item label='更改后的名字' name='name' rules={[ {required: true, message: '请填写更改后的名字'}]}>
                    <Input placeholder='更改后的名字'/>
                </Form.Item>
                <Form.Item label='更改后的手机号' name='phone' rules={[ {required: true, message: '请填写更改后的手机号'},{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                    <Input placeholder='更改后的手机号'/>
                </Form.Item>
                <Form.Item label='更改后的身份证' name='customCard' rules={[ {required: true, message: '请填写更改后的身份证'}]}>
                    <Input placeholder='更改后的身份证'/>
                </Form.Item>
                <Form.Item label='注意'>
                    <span style={{color:'red',fontSize:'12px'}}>该租户如有账单未结清，不能更名</span>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            添加
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
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.SeleHetong.list,
    }
};
export default connect(mapStateToProps) (AddRename)