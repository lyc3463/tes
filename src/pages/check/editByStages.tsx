import {connect} from "umi";
import {useEffect, useState} from "react";
import * as byStages from "@/services/byStages";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Spin} from "antd";
import dayjs from "dayjs";
import {history} from "@@/core/history";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditByStages=(props)=>{
    const [uid,setUid]=useState<string|undefined>('0');
    // 分期金额
    const [staRent,setstaRent]=useState(0);
    // 分期类型
    const [preType,setpreType]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 租户姓名
    const [tenant_name,settenant_name]=useState('');
    // 租户手机号
    const [tenant_phone,settenant_phone]=useState('');
    // 分期开始月份
    const [startDate,setStartDate]=useState('2000-01-01');
    // 分期结束月份
    const [endDate,setEndDate]=useState('2000-02-01');
    // 还款开始月份
    const [startDate1,setStartDate1]=useState('2000-01-01');
    // 还款结束月份
    const [endDate1,setEndDate1]=useState('2000-02-01');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInfo(id);
    }, []);
    const getInfo=(id:string)=>{
        setspinning(true);
        byStages.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                console.log('props',res)
                setstaRent(res.Data.staRent);
                setUid(res.Data.id);
                // setpreType(res.Data.preType);
                settenant_name(res.Data.tenant_name);
                settenant_phone(res.Data.tenant_phone);
                setStartDate(res.Data.staBeginTime);
                setEndDate(res.Data.staEndTime);
                setStartDate1(res.Data.staBeginTime2);
                setEndDate1(res.Data.staEndTime2);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'ByStages/edit',
            payload:{uid,staRent,startDate,endDate,startDate1,endDate1}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                history.push('/check/checkAfterSales/');
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    const  changeDate=(_,data)=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate(dayjs(startDate).format('YYYY-MM-DD'));
            setEndDate(dayjs(endDate).format('YYYY-MM-DD'));
        } else {
            setStartDate(dayjs(data[0]).format('YYYY-MM-DD'));
            setEndDate(dayjs(data[1]).format('YYYY-MM-DD'));
        }
    };
    const  changeDate1=(_,data)=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate1(dayjs(startDate1).format('YYYY-MM-DD'));
            setEndDate1(dayjs(endDate1).format('YYYY-MM-DD'));
        } else {
            setStartDate1(dayjs(data[0]).format('YYYY-MM-DD'));
            setEndDate1(dayjs(data[1]).format('YYYY-MM-DD'));
        }
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                {/*<Form.Item label='合同名称'>*/}
                {/*    <Input/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='租户姓名'>
                    <Input value={tenant_name}/>
                </Form.Item>
                <Form.Item label='租户手机号'>
                    <Input value={tenant_phone}/>
                </Form.Item>
                <Form.Item label='分期开始-结束月份'>
                    <DatePicker.RangePicker picker="month" value={[dayjs(startDate),dayjs(endDate)]} onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='还款开始-结束月份'>
                    <DatePicker.RangePicker picker="month" value={[dayjs(startDate1),dayjs(endDate1)]} onChange={changeDate1}/>
                </Form.Item>
                {/*<Form.Item label='优惠结束月份'>*/}
                {/*    <DatePicker picker="month" value={dayjs(endDate)}/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='分期金额(元)'>
                    <InputNumber value={staRent} onChange={(e)=>setstaRent(e)}/>
                </Form.Item>
                <Form.Item label='注意:'>
                   <span style={{fontSize:'12px',color:"#555"}}>如果选择分期开始月份为租金账单已出的，并不会计算到分期月份</span>
                </Form.Item>
                {/*<Form.Item label='优惠类型'>*/}
                {/*    <Radio.Group value={preType} onChange={(e)=>setpreType(e.target.value)}>*/}
                {/*        <Radio value={2}>未满合同优惠</Radio>*/}
                {/*        <Radio value={1}>满合同优惠</Radio>*/}
                {/*    </Radio.Group>*/}
                {/*</Form.Item>*/}
                <Form.Item {...tailLayout}>
                    <Button type="primary" onClick={onOK}>
                        确定修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(EditByStages)