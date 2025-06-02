import {Button, DatePicker, Form, Input, InputNumber, message, Radio, Space, Spin} from "antd";
import {useState} from "react";
import {useNavigate,history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddGoods=(props)=>{
    const navigate=useNavigate();
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
            type:'Goods/add',
            payload:{...val,userId:-1,goodsMoney,goodsType}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                navigate(-1);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
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
                initialValues={{reason:''}}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='物品名称' name='goodsName' rules={[{required: true, message: '请输入' }]}>
                    <Input/>
                </Form.Item>
                {goodsType==1? <Form.Item label='物品金额(元)'>
                    <InputNumber min={0} value={goodsMoney} onChange={changeGoodsMoney}/>
                </Form.Item>:''}
                <Form.Item label='物品类型'>
                    <Radio.Group value={goodsType} onChange={changeGoodsType}>
                        <Radio value={1}>固定金额</Radio>
                        <Radio value={2}>自定义金额</Radio>
                    </Radio.Group>
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
};
export default connect() (AddGoods)