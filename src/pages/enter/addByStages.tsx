import {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, InputNumber, message, Select, Spin} from "antd";
import {connect,history} from "umi";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const fenqiList=[
    {value:1,label:'每月10号'},
    {value:2,label:'每月15号'},
    {value:3,label:'每月20号'}
]
const AddByStages=(props)=>{
    const [form] = Form.useForm();
    // 租户名字
    const [oldName,setOldName]=useState('');
    // 租户手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    // 原租金
    const [zuMoney,setZuMoney]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [futureRent,setfutureRent]=useState(0);
    // 合同起租日
    const [oldbeginTime,setbeginTime]=useState('2000-01');
    // 合同到期日
    const [oldendTime,setendTime]=useState('2099-01');
    // 分期开始时间
    const [fqStartDate,setFqStartDate]=useState('');
    // 分期结束时间
    const [fqEndDate,setfqEndDate]=useState('');
    // 分期开始时间
    const [hkStartDate,sethkStartDate]=useState('');
    // 分期结束时间
    const [hkEndDate,sethkEndDate]=useState('');
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'ByStages/add',
            payload:{...vals,tenantId,futureRent,fqStartDate,fqEndDate,hkEndDate,hkStartDate}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('提交成功');
                history.push("/enter/afterSales");
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
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
    const change=(e)=>{
        setspinning(true);
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setOldName(res.Data[0].tenant_name);
                setOldPhone(res.Data[0].tenant_phone);
                setTenantID(res.Data[0].tenantId);
                setZuMoney(res.Data[0].zuMoney);
                setbeginTime(res.Data[0].beginTime);
                setendTime(res.Data[0].endTime);
            }else {
                setspinning(false);
                message.error(res.Data)
            }
        })
    };
    const disabledDate = (current) => {
        return current && (current < dayjs(oldbeginTime) || current > dayjs(oldendTime));
    };
    const changeFqdate=(_:any,date:any)=>{
        setFqStartDate(date[0]+'-01');
        setfqEndDate(date[1]+'-01');
    };
    const changehkdate=(_:any,date:any)=>{
        sethkStartDate(date[0]+'-01');
        sethkEndDate(date[1]+'-01');
    };
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
                <Form.Item label='租户名字'>
                    <Input placeholder='租户名字' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='租户手机号'>
                    <Input placeholder='租户手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='原租金/月'>
                    <InputNumber  value={zuMoney} disabled/>元
                </Form.Item>
                <Form.Item label='分期开始/结束时间'>
                    <DatePicker.RangePicker picker="month" disabledDate={disabledDate} onChange={changeFqdate}/>
                </Form.Item>
                <Form.Item label='还款开始/结束时间'>
                    <DatePicker.RangePicker picker="month"  onChange={changehkdate}/>
                </Form.Item>
                <Form.Item label='每月分期租金(元)'>
                    <InputNumber value={futureRent} min={0} onChange={(e)=>setfutureRent(e)}/>
                </Form.Item>
                <Form.Item label='备注'>
                    <span style={{fontSize:'12px',color:'#555'}}>分期开始/结束月份每月分期租金分配给还款开始/结束日期</span>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>

            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.CheckHetong.list,

    }
};
export default connect(mapStateToProps) (AddByStages)