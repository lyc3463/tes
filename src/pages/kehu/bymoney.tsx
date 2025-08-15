import {Button, Form, InputNumber, message, Space, Input, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect,history,useNavigate} from "umi";
import * as ZuhuServer from "@/services/zuhu";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Bymoney=(props)=>{
    const navigate=useNavigate();
    const [uid,setUid]=useState('0');
    // 预留金额
    const [reserved_amount,setreserved_amount]=useState(0);
    // 警告金额
    const [warn_amount,setwarn_amount]=useState(0);
    // 最低充值金额
    const [minimum_recharge,setminimum_recharge]=useState(100);
    const formRef=useRef();
    // 租户金额
    const [tenantAmount,settenantAmount]=useState(0);
    // 原先预留金额
    const [oldreserved_amount,setoldreserved_amount]=useState(0);
    const  [spinning,setspinning]=useState(false);
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data[0]);
            settenantAmount(data[0].tenantAmount);
            setminimum_recharge(data[0].minimum_recharge);
            setoldreserved_amount(data[0].reserved_amount);
            setreserved_amount(data[0].reserved_amount);
            setwarn_amount(data[0].warn_amount);
        }else {
            message.error(res.Data);
        }
    };
    useEffect(() => {
        setUid(props.id);
        getOneCustom(props.id);
    }, [props.id]);
    const onFinish=(vals)=>{
        let neuNub;
        if (reserved_amount!=0&&reserved_amount!=oldreserved_amount){
            neuNub=reserved_amount+1
        }else {
            neuNub=reserved_amount;
        }
        setspinning(true);
        props.dispatch({
            type:'Zuhu/newbyzhuhu',
            payload:{...vals,uid,tenantAmount,warn_amount,reserved_amount:neuNub,oldreserved_amount}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('绑定成功');
                setspinning(false);
                // getOneCustom(uid);
                history.push('/kehu/zuhuguanlian');
            }else {
                setspinning(false);
                message.error(res.Data);
                getOneCustom(uid);
            }
        })
    };
    const changeReservedAmount=(e)=>{
        setreserved_amount(e);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                initialValues={{remark:'',minimum_recharge:1}}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='预留金额(元)'  rules={[{required: true, message: '请填写'}]}>
                    <InputNumber min={0} precision={0} value={reserved_amount} onChange={changeReservedAmount}/><span style={{color:'#999',fontSize:'12px',marginLeft:'10px'}}>注意:用户余额低于预留金额会发消息到小程序提醒用户(修改预留金额会在当前金额上+1元)</span>
                </Form.Item>
                <Form.Item label='警告金额(元)' rules={[{required: true, message: '请填写'}]}>
                    <InputNumber min={0} value={warn_amount} onChange={(e:number)=>setwarn_amount(e)}/><span style={{color:'#999',fontSize:'12px',marginLeft:'10px'}}>注意:用户余额低于警告金额会发短信到用户手机提醒用户</span>
                </Form.Item>
                <Form.Item label='最低充值(元)'  name='minimum_recharge' rules={[{required: true, message: '请填写'},{min:1,transform: (value) => Number(value), message: '最低充值不能低于100'}]}>
                    <Space>
                        <InputNumber min={1} value={minimum_recharge} onChange={(e)=>setminimum_recharge(e)}/>
                        {/*<Button type='primary' onClick={byRearge}>确定修改</Button>*/}
                        {/*<span style={{fontSize:'12px',color:'#999'}}>注:有账单欠费的情况下,只能通过该确定按钮修改最低充值,下面确定关联按钮修改不了最低充值</span>*/}
                        <span style={{fontSize:'12px',color:'#999'}}>租户最低充值金额</span>
                    </Space>
                </Form.Item>
                <Form.Item label='备注' name='remark'>
                    <Input.TextArea style={{width:'400px'}}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                   <Space>
                       <Button type="primary" htmlType="submit">
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
export default connect() (Bymoney)