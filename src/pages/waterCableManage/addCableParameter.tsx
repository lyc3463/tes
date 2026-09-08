import {Button, Form, Input, InputNumber, message, Radio, Space, Spin} from "antd";
import {useCallback, useEffect, useState} from "react";
import {connect, history,useNavigate} from "umi";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

// 缓存key
const CACHE_KEY = "AddCableParameter_form_cache";

const AddCableParameter=(props:any)=>{
    const navigate=useNavigate();
    const we_type=2;
    const [changeValue,setChangeValue]=useState(3)
    //价格总数=基础价+附加单价
    const [totalPrice,setTotalPrice]=useState(0)
    // 收费类型
    const [lossType,setLossType]=useState(1)
    //  每月多少号收费
    const [fixed_fee,setFixed_fee]=useState(1)
    // 基础价格
    const [base_price1,setBase_price1]=useState(0)
    // 附加单价
    const [additional_price1,setAdditional_price1]=useState(0)
    // 损耗
    const [loss,setLoss]=useState(0)
    // 损耗每多少小时扣费
    const [every_price,setEvery_price]=useState(1)
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
    const [spinning,setspinning]=useState(false);

    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存全部state+表单字段到缓存
    const saveCache = useCallback(() => {
        const data = {
            changeValue,
            lossType,
            fixed_fee,
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
            additional_price9,
            minute_price,
            formValues: form.getFieldsValue()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, [
        changeValue, lossType, fixed_fee,
        base_price1, additional_price1, loss, every_price,
        base_price2, additional_price2, base_price3, additional_price3,
        base_price4, additional_price4, base_price5, additional_price5,
        step_value1, base_price6, additional_price6,
        step_value2, base_price7, additional_price7,
        step_value3, base_price8, additional_price8,
        step_value4, base_price9, additional_price9,
        minute_price, form
    ]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setChangeValue(3);
        setLossType(1);
        setFixed_fee(1);
        setBase_price1(0);
        setAdditional_price1(0);
        setLoss(0);
        setEvery_price(1);
        setBase_price2(0);
        setAdditional_price2(0);
        setBase_price3(0);
        setAdditional_price3(0);
        setBase_price4(0);
        setAdditional_price4(0);
        setBase_price5(0);
        setAdditional_price5(0);
        setStep_value1(0);
        setBase_price6(0);
        setAdditional_price6(0);
        setStep_value2(0);
        setBase_price7(0);
        setAdditional_price7(0);
        setStep_value3(0);
        setBase_price8(0);
        setAdditional_price8(0);
        setStep_value4(0);
        setBase_price9(0);
        setAdditional_price9(0);
        setMinute_price(0);
        form.resetFields();
    };

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
    // 监听阶梯水价4 基础价
    const setpListenbasicPrice4=(e)=>{
        setBase_price9(e)
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
    // 监听阶梯水价4 附加单价
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
    ])

    // 页面初始化：加载缓存回填所有state与表单字段
    useEffect(() => {
        const cache = loadCache();
        if (cache) {
            setChangeValue(cache.changeValue ?? 3);
            setLossType(cache.lossType ?? 1);
            setFixed_fee(cache.fixed_fee ?? 1);
            setBase_price1(cache.base_price1 ?? 0);
            setAdditional_price1(cache.additional_price1 ?? 0);
            setLoss(cache.loss ?? 0);
            setEvery_price(cache.every_price ?? 1);
            setBase_price2(cache.base_price2 ?? 0);
            setAdditional_price2(cache.additional_price2 ?? 0);
            setBase_price3(cache.base_price3 ?? 0);
            setAdditional_price3(cache.additional_price3 ?? 0);
            setBase_price4(cache.base_price4 ?? 0);
            setAdditional_price4(cache.additional_price4 ?? 0);
            setBase_price5(cache.base_price5 ?? 0);
            setAdditional_price5(cache.additional_price5 ?? 0);
            setStep_value1(cache.step_value1 ?? 0);
            setBase_price6(cache.base_price6 ?? 0);
            setAdditional_price6(cache.additional_price6 ?? 0);
            setStep_value2(cache.step_value2 ?? 0);
            setBase_price7(cache.base_price7 ?? 0);
            setAdditional_price7(cache.additional_price7 ?? 0);
            setStep_value3(cache.step_value3 ?? 0);
            setBase_price8(cache.base_price8 ?? 0);
            setAdditional_price8(cache.additional_price8 ?? 0);
            setStep_value4(cache.step_value4 ?? 0);
            setBase_price9(cache.base_price9 ?? 0);
            setAdditional_price9(cache.additional_price9 ?? 0);
            setMinute_price(cache.minute_price ?? 0);
            if (cache.formValues) {
                form.setFieldsValue(cache.formValues);
            }
        }
    }, []);
    // 任意state变动自动存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);
    // 表单字段变动也立即存
    const handleFormChange = () => {
        saveCache();
    };

    const onFinish = async (values: any) => {
        if (lossType==2&&fixed_fee<1) return message.warning('请输入正确的号数')
        if (lossType==2&&fixed_fee>28) return message.warning('请输入正确的号数')
        setspinning(true);
        let res=await props.dispatch({
            type:'CableParameter/add',
            payload:{...values,
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
                additional_price9,
                minute_price,
                fixed_fee,
                lossType
            }
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功');
            // 添加成功后清空草稿缓存
            clearCache();
            history.push('/waterCableManage/parameter')
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    const changelossType=(e)=>{
        setLossType(e.target.value)
    };
    const changefixed_fee=(e)=>{
        setFixed_fee(e)
    }
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                onValuesChange={handleFormChange}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='名称' name='price_name'>
                    <Input placeholder='请输入名称' />
                </Form.Item>
                <Form.Item label='类型' name='price_type'>
                    <Radio.Group onChange={(e)=>{setChangeValue(e.target.value)}} value={changeValue}>
                        <Radio value={3}>单费率电价</Radio>
                        <Radio value={4}>多费率电价</Radio>
                        <Radio value={5}>阶梯电价</Radio>
                    </Radio.Group>
                </Form.Item>
                {changeValue===3?
                    <>
                        <Form.Item label='价格'>
                            <InputNumber  style={{width:'80px'}} value={totalPrice}  disabled/>
                            <span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>(元/kWh) =基础价
                            <InputNumber style={{width:'80px'}} min={0} value={base_price1} onChange={listenbasicPrice}/>+附加单价
                            <InputNumber style={{width:'80px'}} min={0} value={additional_price1} onChange={listenadditionalPrice}/>
                            {/*(每<InputNumber step={1} precision={0} min={0} style={{width:'80px'}} value={minute_price} onChange={changeMinute}/>小时收费一次)*/}
                            <span style={{fontSize:'12px',color:'#555'}}>(每1小时收费一次)</span>
                        </Form.Item>

                    </>
                    :''}
                {changeValue===3||changeValue===4||changeValue===5?
                    <Form.Item label='损耗'>
                        <InputNumber value={loss} style={{width:'80px'}} onChange={changeLoss}/>
                        (元/kWh)<span style={{fontSize:"12px",color:'#999',fontStyle: 'italic'}}></span>
                        <Radio.Group value={lossType} onChange={changelossType} style={{width:"100px"}}>
                            <Radio value={2}>固定日期</Radio>
                            <Radio value={1}>固定天数</Radio>
                        </Radio.Group>
                        {
                            lossType==1?<span>
                                每<InputNumber value={every_price} style={{width:'80px'}} step={1} precision={0} min={1} onChange={changPrice}/>天收费一次
                            </span>:''
                        }
                        {
                            lossType==2?<span>
                                每月<InputNumber value={fixed_fee} min={1} max={28} onChange={changefixed_fee}/>号收费一次
                            </span>:''
                        }
                        <span style={{marginLeft:'10px',color:'red'}}>注:切换新类型需执行完已生效类型</span>
                    </Form.Item>:''
                }
                {
                    changeValue===4?<>
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
                    changeValue===5?<>
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
                    <Space>
                        <Button type="primary"  htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                        <Button danger onClick={resetAllFormData}>
                            清空草稿
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddCableParameter)