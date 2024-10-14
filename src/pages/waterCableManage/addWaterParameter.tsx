import {Button, Form, Input, InputNumber, message, Radio} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

const AddWaterParameter=(props:any)=>{
    // 捡钱类型 1水价 2电价
    const we_type=1;
    const [changeValue,setChangeValue]=useState(1)
    //价格总数=基础价+附加单价
    const [totalPrice,setTotalPrice]=useState(0)
    // 基础价格
    const [base_price1,setBase_price1]=useState(0)
    // 附加单价
    const [additional_price1,setAdditional_price1]=useState(0)
    // 损耗
    const [loss,setLoss]=useState(0)
    // 损耗每多少小时扣费
    const [every_price,setEvery_price]=useState(0)
    // 第一阶梯单价总数=阶梯1基础价+阶梯1附加单价
    const [stepPrice1,setStepPrice1]=useState(0)
    // 阶梯1基础价格
    const [base_price6,setBase_price6]=useState(0)
    // 阶梯1附加单价
    const [additional_price6,setAdditional_price6]=useState(0)
    // 第二阶梯单价总数=阶梯2基础价+阶梯2附加单价
    const [stepPrice2,setStepPrice2]=useState(0)
    // 阶梯2基础价格
    const [base_price7,setBase_price7]=useState(0)
    // 阶梯2附加单价
    const [additional_price7,setAdditional_price7]=useState(0)
    // 第三阶梯单价总数=阶梯3基础价+阶梯3附加单价
    const [stepPrice3,setStepPrice3]=useState(0)
    // 阶梯3基础价格
    const [base_price8,setBase_price8]=useState(0)
    // 阶梯3附加单价
    const [additional_price8,setAdditional_price8]=useState(0)
    // 监听阶梯值2
    const [step_value2,setStep_value2]=useState(0)
    // 监听阶梯值3
    const [step_value3,setStep_value3]=useState(0)
    const [minute_price,setMinute_price]=useState(0)
    const [form] = Form.useForm();
    // 监听水价基础价
    const listenbasicPrice=(e)=>{
        setBase_price1(e)
    }
    // 监听水价附加单价
    const listenadditionalPrice=(e)=>{
        setAdditional_price1(e)
    }
    // 监听阶梯水价1 基础价
    const setpListenbasicPrice1=(e)=>{
        setBase_price6(e)
    }
    // 监听阶梯水价2 基础价
    const setpListenbasicPrice2=(e)=>{
        setBase_price7(e)
    }
    // 监听阶梯水价3 基础价
    const setpListenbasicPrice3=(e)=>{
        setBase_price8(e)
    }
    // 监听阶梯水价1 附加单价
    const setpListenadditionalPrice1=(e)=>{
        setAdditional_price6(e)
    }
    // 监听阶梯水价2 附加单价
    const setpListenadditionalPrice2=(e)=>{
        setAdditional_price7(e)
    }
    // 监听阶梯水价3 附加单价
    const setpListenadditionalPrice3=(e)=>{
        setAdditional_price8(e)
    }
    // 监听损耗用量
    const changeLoss=(e)=>{
        setLoss(e)
    }
    // 监听每多少小时扣费
    const changPrice=(e)=>{
        setEvery_price(e*24*60)
    }
    // 监听阶梯值2
    const changeStep_value2=(e)=>{
        setStep_value2(e)
    }
    // 监听阶梯值3
    const changeStep_value3=(e)=>{
        setStep_value3(e)
    }
    // 每多少分钟收费
    const changeMinute=(e)=>{
        setMinute_price(e*60)
    }
    useEffect(()=>{
        // 计算水价价格  基础价+附加单价
        setTotalPrice(base_price1+additional_price1);
        // 计算第一阶梯单价 阶梯1基础价+阶梯1附加单价
        setStepPrice1(base_price6+additional_price6)
        // 计算第二阶梯单价 阶梯2基础价+阶梯2附加单价
        setStepPrice2(base_price7+additional_price7)
        // 计算第三阶梯单价 阶梯3基础价+阶梯3附加单价
        setStepPrice3(base_price8+additional_price8)
    },[base_price1,additional_price1,base_price6,additional_price6,base_price7,additional_price7,base_price8,additional_price8])

    const onFinish = async (values: any) => {
        let res=await props.dispatch({
            type:'CableParameter/add',
            payload:{...values,
                we_type,
                base_price1,
                additional_price1,
                loss,every_price,
                base_price2:0,
                additional_price2:0,
                base_price3:0,
                additional_price3:0,
                base_price4:0,
                additional_price4:0,
                base_price5:0,
                additional_price5:0,
                step_value1:0,
                base_price6,
                additional_price6,
                step_value2,
                base_price7,
                additional_price7,
                step_value3,
                base_price8,
                additional_price8,
                step_value4:0,
                base_price9:0,
                additional_price9:0,
                minute_price
            }
        })
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/waterCableManage/parameter')
        }else {
            message.error(res.Data);
        }

    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='水价参数名称' name='price_name'>
                    <Input placeholder='请输入名称' />
                </Form.Item>
                <Form.Item label='类型' name='price_type'>
                    <Radio.Group  onChange={(e)=>{setChangeValue(e.target.value)}}>
                        <Radio value={1}>水价</Radio>
                        <Radio value={2}>阶梯水价</Radio>
                    </Radio.Group>
                </Form.Item>
                {changeValue===1?
                    <>
                        <Form.Item label='价格'>
                            <Input value={totalPrice}  style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (元/m³) =基础价(元)<InputNumber style={{width:'80px'}} onChange={listenbasicPrice}/>
                            +附加单价(元)<InputNumber onChange={listenadditionalPrice} style={{width:'80px'}}/>
                            (每<InputNumber step={1} precision={0} min={0} style={{width:'80px'}} onChange={changeMinute}/>小时收费一次)
                        </Form.Item>
                        <Form.Item label='损耗'>
                            <InputNumber defaultValue={loss} style={{width:'80px'}} onChange={changeLoss}/>
                            (m³)<span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            每<InputNumber style={{width:'80px'}} step={1} precision={0} min={0} onChange={changPrice}/>天收费一次
                        </Form.Item>
                    </>
                    :''}
                {
                    changeValue===2?<>
                        <Form.Item label='第一阶梯单价'>
                            <InputNumber value={stepPrice1} style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (元/m³) =基础价<InputNumber style={{width:'80px'}} onChange={setpListenbasicPrice1}/>
                            +附加单价<InputNumber style={{width:'80px'}} onChange={setpListenadditionalPrice1}/>
                        </Form.Item>
                        <Form.Item label='第二阶梯起始值(m³)'>
                            <InputNumber  style={{width:'80px'}} onChange={changeStep_value2}/>
                        </Form.Item>
                        <Form.Item label='第二阶梯单价'>
                            <InputNumber value={stepPrice2} style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (元/m³) =基础价<InputNumber style={{width:'80px'}} onChange={setpListenbasicPrice2}/>
                            +附加单价<InputNumber style={{width:'80px'}} onChange={setpListenadditionalPrice2}/>
                        </Form.Item>
                        <Form.Item label='第三阶梯起始值(m³)'>
                            <InputNumber  style={{width:'80px'}} onChange={changeStep_value3}/>
                        </Form.Item>
                        <Form.Item label='第三阶梯单价'>
                            <InputNumber  value={stepPrice3} style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (元/m³) =基础价<InputNumber style={{width:'80px'}} onChange={setpListenbasicPrice3}/>
                            +附加单价<InputNumber style={{width:'80px'}} onChange={setpListenadditionalPrice3}/>
                        </Form.Item>
                    </>:''
                }
                <Form.Item label='附加价格组成说明' name='add_price_remark'>
                    <Input.TextArea placeholder='说明' style={{width:'20vw'}}/>
                </Form.Item>
                <Form.Item label='APP端展示水价' name='is_appPrice'>
                    <Radio.Group >
                        <Radio value={1}>展示</Radio>
                        <Radio value={2}>不展示</Radio>
                    </Radio.Group>
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
export default connect() (AddWaterParameter)