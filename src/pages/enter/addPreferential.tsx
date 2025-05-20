import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import {connect,history,useNavigate} from "umi";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddPreferential=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 租户名字
    const [oldName,setOldName]=useState('');
    // 租户手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [zuMoney,setmoney]=useState(0);
    // 优惠类型
    const [youhuiType,setyouhuiType]=useState(1);
    const [startDate,setStartDate]=useState('');
    const [endDate,setEndDate]=useState('');
    const [discountMoney,setdiscountMoney]=useState(0);
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'Preferential/add',
            payload:{...vals,tenantId,startDate,endDate,youhuiType,discountMoney}
        }).then((res)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('提交成功');
                history.push("/enter/afterSales")
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
                setTenantID(res.Data[0].tenantId);
                setmoney(res.Data[0].zuMoney);
            }else {
                setspinning(false);
                message.error(res.Data);
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
    const onRadioChange=(e)=>{
        setyouhuiType(e.target.value);
    };
    const changeDate=(_:any,date:any)=>{
        setStartDate(date[0]+'-01');
        setEndDate(date[1]+'-01');
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                initialValues={{discountMoney:0}}
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
                <Form.Item label='租户名字'>
                    <Input placeholder='租户名字' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='租户手机号'>
                    <Input placeholder='租户手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='合同租金'>
                    <InputNumber value={zuMoney} disabled/>元
                </Form.Item>
                <Form.Item label='每月优惠金额'>
                    <InputNumber min={0} max={zuMoney} value={discountMoney} onChange={(e)=>setdiscountMoney(e)}/>元
                </Form.Item>
                <Form.Item label='优惠开始/结束月份'>
                    <DatePicker.RangePicker picker="month" onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='优惠类型'>
                    <Radio.Group value={youhuiType} onChange={onRadioChange}>
                        <Radio  value={1}>满合同优惠</Radio>
                        <Radio  value={2}>未满合同优惠</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='注意'>
                    <span style={{color:'red',fontSize:'12px'}}>满合同优惠，中途退租，合同未到期，历史优惠金额算到账单一起出</span>
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
export default connect(mapStateToProps) (AddPreferential)