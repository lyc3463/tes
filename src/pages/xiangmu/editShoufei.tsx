import {connect,history} from "umi";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, message, Radio} from "antd";
import * as GongsiService from "@/services/gongsi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditShoufei=(props:any)=>{
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState('')
    // 收费类型 1周期性收费 2一次性收费 3押金类收费
    const [itemType,setItemType]=useState();
    // 月金额计算方式 1固定金额 2按照单价收费 3每户手动输入
    const [monthly_amount,setMonthly_amount]=useState();
    // 扣款方式类型 1当期收当期 2当期收上期 3当期收下期
    const [deduction_method,setDeduction_method]=useState();
    //  收费间隔
    const [item_interval,setItem_interval]=useState();
    // 单价
    const [price,setPrice]=useState();
    // 预支付金额
    const [prepaidAmount,setPrepaidAmount]=useState();
    // 计量方式
    const [count_method,setCountMethod]=useState();
    const [form] = Form.useForm();
    // 收费类型
    const shoufeiType=(e:any)=>{
        setItemType(e.target.value)
    };

    // 月金额计算方式类型
    const jierType=(e:any)=>{
        setMonthly_amount(e.target.value)
    };
    // 扣款方式类型
    const koukuanType=(e:any)=>{
        setDeduction_method(e.target.value)
    };
    // 收费间隔
    const changeJianGe=(e)=>{
        setItem_interval(e)
    };
    //  单价
    const changePrice=(e)=>{
        setPrice(e)
    };
    // 预支付金额
    const ChangePrepaidAmount=(e)=>{
        setPrepaidAmount(e)
    };
    // 计量方式
    const changeCountMethod=(e)=>{
        setCountMethod(e.target.value)
    };
    const onFinish = async (values: any) => {
        let res=await props.dispatch({
            type:'Gongsi/edit',
            payload:{...values,itemType,monthly_amount,deduction_method,item_interval,price,prepaidAmount,count_method,uid}
        })
        if (res.ErrorCode==0){
            message.success('修改成功')
            history.push('/xiangmu/gongsiguanli')
        }else {
            message.error(res.Data);
        }
    };
    const getAccounOne=async (e:any)=>{
        let res:any=await GongsiService.one(e)
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setItemType(data.itemType);
            setItem_interval(data.item_interval);
            setDeduction_method(data.deduction_method);
            setPrepaidAmount(data.prepaidAmount);
            setMonthly_amount(data.monthly_amount);
            setPrice(data.price);
            setCountMethod(data.count_method)
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getAccounOne(id)
    }, []);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='收费项目名称' name='item_name' rules={[{required: true, message: '请输入收费项目名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='收费类型' name='itemType'>
                    <Radio.Group onChange={shoufeiType} defaultValue={itemType} disabled>
                        <Radio value={1}>周期性收费</Radio>
                        <Radio value={2}>一次性收费</Radio>
                        <Radio value={3}>押金类收费</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    itemType==1?<><Form.Item label='收费间隔'>
                        每<InputNumber controls={false} defaultValue={item_interval} onChange={changeJianGe}/>个月收费一次
                        <p style={{color:'#555',fontSize:'12px'}}>注意：下方单价和固定金额为每月数额 。</p>
                    </Form.Item>
                        {/*<Form.Item label='扣款方式'>*/}
                        {/*    <Radio.Group onChange={koukuanType} defaultValue={deduction_method}>*/}
                        {/*        <Radio value={1}>当期收当期(预付费)</Radio>*/}
                        {/*        <Radio value={2}>当期收上期(后付费)</Radio>*/}
                        {/*        <Radio value={3}>当期收下期(预付费且押一个周期)</Radio>*/}
                        {/*    </Radio.Group>*/}
                        {/*</Form.Item>*/}
                        </>:''
                }
                {/*{*/}
                {/*    itemType==1?   <Form.Item label='预付金额(元)'>*/}
                {/*        <InputNumber defaultValue={prepaidAmount}  onChange={ChangePrepaidAmount}/>*/}
                {/*    </Form.Item>:''*/}
                {/*}*/}
                <Form.Item label='月金额计算方式' name='monthly_amount'>
                    <Radio.Group onChange={jierType} defaultValue={monthly_amount}>
                        <Radio value={1}>固定金额</Radio>
                        <Radio value={2}>按照单价计算</Radio>
                        <Radio value={3}> 每户手动输入</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    monthly_amount==1?<Form.Item label='固定金额(元)'>
                        <InputNumber onChange={changePrice} defaultValue={price} />
                    </Form.Item>:''
                }
                {
                    monthly_amount==2?
                        <>
                            <Form.Item label='计量方式' name='count_method'>
                                <Radio.Group onChange={changeCountMethod} defaultValue={count_method}>
                                    <Radio value={1}>建筑面积</Radio>
                                    <Radio value={2}>套内面积</Radio>
                                    <Radio value={3}>公摊面积</Radio>
                                    <Radio value={4}>按电费</Radio>
                                    <Radio value={5}>按水费</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </>:''
                }
                {
                    monthly_amount==2?
                        <Form.Item label='单价(元)'>
                            <Input onChange={changePrice} defaultValue={price}/>
                        </Form.Item>:''
                }
                <Form.Item label='添加备注' name='remark' rules={[{required: true, message: '请输入备注'}]}>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect()(EditShoufei)