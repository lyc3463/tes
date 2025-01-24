import {Button, Form, Input, InputNumber, message, Radio, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect, history,useLocation} from "umi";
import * as CableParameterServer from "@/services/cableParameter";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCableParameter=(props)=>{
    const [isSpinning,setIsSpinning]=useState(false);
    const we_type=2;
    const location=useLocation();
    const formRef =useRef();
    const [uid,setUid]=useState('');
    // 价钱类型  1水价，2阶梯水价，3单费率电价，4多费率电价，5阶梯电价
    const [price_type,setPrice_type]=useState();
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
    // 第四阶梯单价总数=阶梯4基础价+阶梯4附加单价
    const [stepPrice4,setStepPrice4]=useState(0)
    // 阶梯4基础价格
    const [base_price9,setBase_price9]=useState(0)
    // 阶梯4附加单价
    const [additional_price9,setAdditional_price9]=useState(0)
    // 监听阶梯值1
    const [step_value1,setStep_value1]=useState(0)
    // 监听阶梯值2
    const [step_value2,setStep_value2]=useState(0)
    // 监听阶梯值3
    const [step_value3,setStep_value3]=useState(0)
    // 监听阶梯值4
    const [step_value4,setStep_value4]=useState(0)
    // 监听尖单价 基础价
    const [base_price2,setBase_price2]=useState(0)
    // 监听尖单价 附加单价
    const [additional_price2,setAdditional_price2]=useState(0)
    // 尖单价=尖单价基础价+尖单价附加单价
    const [jianDanPrice,setJianDanPrice]=useState(0)
    // 监听峰单价 基础价
    const [base_price3,setBase_price3]=useState(0)
    // 监听峰单价 附加单价
    const [additional_price3,setAdditional_price3]=useState(0)
    // 峰单价=峰单价基础价+峰单价附加单价
    const [fengDanPrice,setFengDanPrice]=useState(0)
    // 监听平单价 基础价
    const [base_price4,setBase_price4]=useState(0)
    // 监听平单价 附加单价
    const [additional_price4,setAdditional_price4]=useState(0)
    // 平单价=平单价基础价+平单价附加单价
    const [pingDanPrice,setPingDanPrice]=useState(0)
    // 监听谷单价 基础价
    const [base_price5,setBase_price5]=useState(0)
    // 监听谷单价 附加单价
    const [additional_price5,setAdditional_price5]=useState(0)
    // 谷单价=谷单价基础价+谷单价附加单价
    const [guDanPrice,setGuDanPrice]=useState(0)

    const [minute_price,setMinute_price]=useState(0)
    const [form] = Form.useForm();
    // 监听电价基础价
    const listenbasicPrice=(e)=>{
        setBase_price1(e)
    }
    // 监听电价附加单价
    const listenadditionalPrice=(e)=>{
        setAdditional_price1(e)
    }
    // 监听阶梯电价1 基础价
    const setpListenbasicPrice1=(e)=>{
        setBase_price6(e)
    }
    // 监听阶梯电价2 基础价
    const setpListenbasicPrice2=(e)=>{
        setBase_price7(e)
    }
    // 监听阶梯电价3 基础价
    const setpListenbasicPrice3=(e)=>{
        setBase_price8(e)
    }
    // 监听阶梯电价4 基础价
    const setpListenbasicPrice4=(e)=>{
        setBase_price9(e)
    }
    // 监听阶梯电价1 附加单价
    const setpListenadditionalPrice1=(e)=>{
        setAdditional_price6(e)
    }
    // 监听阶梯电价2 附加单价
    const setpListenadditionalPrice2=(e)=>{
        setAdditional_price7(e)
    }
    // 监听阶梯电价3 附加单价
    const setpListenadditionalPrice3=(e)=>{
        setAdditional_price8(e)
    }
    // 监听阶梯电价4 附加单价
    const setpListenadditionalPrice4=(e)=>{
        setAdditional_price9(e)
    }
    // 监听损耗用量
    const changeLoss=(e)=>{
        setLoss(e)
    }
    // 监听每多少小时扣费
    const changPrice=(e)=>{
        setEvery_price(e)
    }
    // 监听阶梯值1
    const changeStep_value1=(e)=>{
        setStep_value1(e)
    }
    // 监听阶梯值2
    const changeStep_value2=(e)=>{
        setStep_value2(e)
    }
    // 监听阶梯值3
    const changeStep_value3=(e)=>{
        setStep_value3(e)
    }
    // 监听阶梯值4
    const changeStep_value4=(e)=>{
        setStep_value4(e)
    }
    // 每多少分钟收费
    const changeMinute=(e)=>{
        setMinute_price(e*60)
    }
    // 尖单件 基础价
    const changeJianJIchu=(e)=>{
        setBase_price2(e)
    }
    // 尖单件 附加单价
    const changeJianfujia=(e)=>{
        setAdditional_price2(e)
    }
    // 峰单件 基础价
    const changeFengJIchu=(e)=>{
        setBase_price3(e)
    }
    // 峰单件 附加单价
    const changeFengfujia=(e)=>{
        setAdditional_price3(e)
    }
    // 平单价 基础价
    const changePingJIchu=(e)=>{
        setBase_price4(e)
    }
    // 平单价 附加单价
    const changePingfujia=(e)=>{
        setAdditional_price4(e)
    }
    // 古单价 基础价
    const changeGuJIchu=(e)=>{
        setBase_price5(e)
    }
    // 古单价 附加单价
    const changeGufujia=(e)=>{
        setAdditional_price5(e)
    }

    useEffect(()=>{
        // 计算水价价格  基础价+附加单价
        setTotalPrice(base_price1+additional_price1);
        // 计算第一阶梯单价 阶梯1基础价+阶梯1附加单价
        setStepPrice1(base_price6+additional_price6);
        // 计算第二阶梯单价 阶梯2基础价+阶梯2附加单价
        setStepPrice2(base_price7+additional_price7);
        // 计算第三阶梯单价 阶梯3基础价+阶梯3附加单价
        setStepPrice3(base_price8+additional_price8);
        // 计算第四阶梯单价 阶梯4基础价+阶梯4附加单价
        setStepPrice4(base_price9+additional_price9);
        // 计算尖单价  尖单价基础价+尖单件附加单价
        setJianDanPrice(base_price2+additional_price2);
        // 计算峰单价  峰单价基础价+峰单件附加单价
        setFengDanPrice(base_price3+additional_price3);
        // 计算平单价  平单价基础价+平单件附加单价
        setPingDanPrice(base_price4+additional_price4);
        // 计算谷单价  谷单价基础价+谷单件附加单价
        setGuDanPrice(base_price5+additional_price5);
    },[base_price1,
        additional_price1,
        base_price6,
        additional_price6,
        base_price7,
        additional_price7,
        base_price8,
        additional_price8,
        base_price9,
        additional_price9,
        base_price2,
        additional_price2,
        base_price3,
        additional_price3,
        base_price4,
        additional_price4,
        base_price5,
        additional_price5,
    ]);
    // 获取单个价格详情
    const getOneCollerctor=async (id:string)=>{
        let res:any=await  CableParameterServer.one(id);
        if (res?.ErrorCode==0){
            console.log("参数详情",res)
            let Data=res.Data;
            formRef.current.setFieldsValue(res?.Data);
            // 损耗 多少天收费
            setEvery_price(Data.every_price);
            // 损耗 单价
            setLoss(Data.loss);
            //价钱类型
            setPrice_type(Data.price_type);
            //基础价格
            setBase_price1(Data.base_price1);
            setBase_price2(Data.base_price2);
            setBase_price3(Data.base_price3);
            setBase_price4(Data.base_price4);
            setBase_price5(Data.base_price5);
            setBase_price6(Data.base_price6);
            setBase_price7(Data.base_price7);
            setBase_price8(Data.base_price8);
            setBase_price9(Data.base_price9);
            //附加单价
            setAdditional_price1(Data.additional_price1);
            setAdditional_price2(Data.additional_price2);
            setAdditional_price3(Data.additional_price3);
            setAdditional_price4(Data.additional_price4);
            setAdditional_price5(Data.additional_price5);
            setAdditional_price6(Data.additional_price6);
            setAdditional_price7(Data.additional_price7);
            setAdditional_price8(Data.additional_price8);
            setAdditional_price9(Data.additional_price9);

            setStep_value1(Data.step_value1);
            setStep_value2(Data.step_value2);
            setStep_value3(Data.step_value3);
            setStep_value4(Data.step_value4);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCollerctor(id);
    }, []);
    const onFinish = (values: any) => {
        setIsSpinning(true);
        props.dispatch({
            type:'CableParameter/edit',
            payload:{...values,
                uid,
                we_type,
                base_price1,
                additional_price1,
                loss,
                every_price,
                base_price2,
                additional_price2,
                base_price3,
                additional_price3,
                base_price4,
                additional_price4,
                base_price5,
                additional_price5,
                step_value1,
                base_price6,
                additional_price6,
                step_value2,
                base_price7,
                additional_price7,
                step_value3,
                base_price8,
                additional_price8,
                step_value4,
                base_price9,
                additional_price9
            }
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setIsSpinning(false);
                message.success('修改成功');
                history.push('/waterCableManage/parameter')
            }else {
                message.error(res.Data);
                setIsSpinning(false);
            }
        })


    };
    return(
        <Spin spinning={isSpinning}>
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
                <Form.Item label='名称' name='price_name'>
                    <Input placeholder='请输入名称' />
                </Form.Item>
                <Form.Item label='类型'  defaultValue={price_type} name='price_type'>
                    <Radio.Group onChange={(e)=>{setPrice_type(e.target.value)}} disabled>
                        <Radio value={3}>单费率电价</Radio>
                        <Radio value={4}>多费率电价</Radio>
                        <Radio value={5}>阶梯电价</Radio>
                    </Radio.Group>
                </Form.Item>
                {price_type===3?
                    <>
                        <Form.Item label='价格'>
                            <InputNumber  style={{width:'80px'}} value={totalPrice}  disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>(元/kWh) =基础价
                            <InputNumber style={{width:'80px'}} value={base_price1} min={0} onChange={listenbasicPrice}/>+附加单价
                            <InputNumber style={{width:'80px'}} value={additional_price1} min={0}  onChange={listenadditionalPrice}/>
                            {/*(每<InputNumber step={1} precision={0} min={0} style={{width:'80px'}} onChange={changeMinute}/>小时收费一次)*/}
                            <span style={{fontSize:'12px',color:'#555'}}>(每1小时收费一次)</span>
                        </Form.Item>
                    </>
                    :''}
                {price_type===3||price_type===4||price_type===5?
                    <Form.Item label='损耗'>
                        <InputNumber value={loss} style={{width:'80px'}} onChange={changeLoss}/>
                        (元/kWh)<span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                        每<InputNumber value={every_price} style={{width:'80px'}} step={1} precision={0} min={1} onChange={changPrice}/>天收费一次
                        {/*<span style={{fontSize:'12px',color:'#555'}}>(每1天收费一次)</span>*/}
                    </Form.Item>:''
                }

                {
                    price_type===4?<>
                        <Form.Item label='尖单价'>
                            <InputNumber  style={{width:'80px'}}  value={jianDanPrice} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (kWh) =基础价<InputNumber style={{width:'80px'}} value={base_price2} onChange={changeJianJIchu}/>
                            +附加单价<InputNumber style={{width:'80px'}} value={additional_price2} onChange={changeJianfujia}/>
                        </Form.Item>
                        <Form.Item label='峰单价'>
                            <InputNumber  style={{width:'80px'}} value={fengDanPrice} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (kWh) =基础价<InputNumber style={{width:'80px'}} value={base_price3} onChange={changeFengJIchu}/>
                            +附加单价<InputNumber style={{width:'80px'}} value={additional_price3} onChange={changeFengfujia}/>
                        </Form.Item>
                        <Form.Item label='平单价'>
                            <InputNumber  style={{width:'80px'}} value={pingDanPrice} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (kWh) =基础价<InputNumber style={{width:'80px'}} value={base_price4} onChange={changePingJIchu}/>
                            +附加单价<InputNumber style={{width:'80px'}} value={additional_price4} onChange={changePingfujia}/>
                        </Form.Item>
                        <Form.Item label='谷单价'>
                            <InputNumber  style={{width:'80px'}} value={guDanPrice} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                            (kWh) =基础价<InputNumber style={{width:'80px'}} value={base_price5} onChange={changeGuJIchu}/>
                            +附加单价<InputNumber style={{width:'80px'}} value={additional_price5} onChange={changeGufujia}/>
                        </Form.Item>
                    </>:''
                }
                {
                    price_type===5?<>
                        <Form.Item label='第一阶梯值(kWh)'>
                            <InputNumber  style={{width:'80px'}} value={step_value1} onChange={changeStep_value1}/>
                        </Form.Item>
                        <Form.Item label='第一阶梯值(kWh)'>
                            <InputNumber value={stepPrice1} style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>(kWh) =基础价
                            <InputNumber style={{width:'80px'}} value={base_price6} onChange={setpListenbasicPrice1}/>+附加单价
                            <InputNumber style={{width:'80px'}} value={additional_price6} onChange={setpListenadditionalPrice1}/>
                        </Form.Item>
                        <Form.Item label='第二阶梯值(kWh)'>
                            <InputNumber  style={{width:'80px'}} value={step_value2} onChange={changeStep_value2}/>
                        </Form.Item>
                        <Form.Item label='第二阶梯单价'>
                            <InputNumber value={stepPrice2} style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>(kWh) =基础价
                            <InputNumber style={{width:'80px'}} value={base_price7} onChange={setpListenbasicPrice2}/>+附加单价
                            <InputNumber style={{width:'80px'}} value={additional_price7} onChange={setpListenadditionalPrice2}/>
                        </Form.Item>
                        <Form.Item label='第三阶梯值(kWh)'>
                            <InputNumber  style={{width:'80px'}} value={step_value3} onChange={changeStep_value3}/>
                        </Form.Item>
                        <Form.Item label='第三阶梯单价'>
                            <InputNumber  value={stepPrice3} style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>(kWh) =基础价
                            <InputNumber style={{width:'80px'}} value={base_price8} onChange={setpListenbasicPrice3}/>+附加单价
                            <InputNumber style={{width:'80px'}} value={additional_price8} onChange={setpListenadditionalPrice3}/>
                        </Form.Item>
                        <Form.Item label='第四阶梯值(kWh)'>
                            <InputNumber  style={{width:'80px'}} value={step_value4} onChange={changeStep_value4}/>
                        </Form.Item>
                        <Form.Item label='第四阶梯单价'>
                            <InputNumber  value={stepPrice4} style={{width:'80px'}} disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>(kWh) =基础价
                            <InputNumber style={{width:'80px'}} value={base_price9} onChange={setpListenbasicPrice4}/>+附加单价
                            <InputNumber style={{width:'80px'}} value={additional_price9} onChange={setpListenadditionalPrice4}/>
                        </Form.Item>
                    </>:''
                }
                <Form.Item label='附加价格组成说明' name='add_price_remark'>
                    <Input.TextArea placeholder='说明' style={{width:'20vw'}}/>
                </Form.Item>
                <Form.Item label='APP端展示电价' name='is_appPrice'>
                    <Radio.Group >
                        <Radio value={1}>展示</Radio>
                        <Radio value={2}>不展示</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (EditCableParameter)