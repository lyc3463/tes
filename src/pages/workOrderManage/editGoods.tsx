import {Button, Form, Input, InputNumber, message, Radio, Space, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {useNavigate,connect,useLocation} from "umi";
import * as GongsiService from '@/services/goods';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditGoods=(props)=>{
    const navigate=useNavigate();
    const location=useLocation();
    const formRef=useRef();
    const [uid,setUid]=useState<string|undefined>();
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    const [goodsMoney,setgoodsMoney]=useState(0);
    const [goodsType,setGoodsType]=useState(1);
    const changeGoodsMoney=(e)=>{
        setgoodsMoney(e);
    };
    const changeGoodsType=(e)=>{
        setGoodsType(e.target.value);
    };
    const onFinish=(val)=>{
        setspinning(true);
        props.dispatch({
            type:'Goods/edit',
            payload:{uid,...val,goodsMoney}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                setspinning(false);
                navigate(-1);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneInfo(id);
    }, []);
    const getOneInfo=(id:string)=>{
        setspinning(true);
        GongsiService.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                formRef.current.setFieldsValue(res.Data);
                setgoodsMoney(res.Data.goodMoney);
                setGoodsType(res.Data.goodType);
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                ref={formRef}
                initialValues={{reason:''}}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='物品名称' name='goodName' rules={[{required: true, message: '请输入' }]}>
                    <Input/>
                </Form.Item>
                {goodsType==1? <Form.Item label='物品金额(元)'>
                    <InputNumber min={0} value={goodsMoney} onChange={changeGoodsMoney}/>
                </Form.Item>:''}
                <Form.Item label='物品类型'>
                    <Radio.Group value={goodsType} onChange={changeGoodsType} disabled>
                        <Radio value={1}>固定金额</Radio>
                        <Radio value={2}>自定义金额</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            修改
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
export default connect() (EditGoods)