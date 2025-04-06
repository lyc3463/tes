import {Button, Form, Input, InputNumber, message, Spin} from "antd";
import {connect, history} from "umi";
import {useEffect, useState} from "react";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddHouse=(props:any)=>{
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    // 可租面积
    const [rentable_area,setrentable_area]=useState(0);
    // 可增加面积
    const [residue_add_area,setresidue_add_area]=useState(0);
    // 单价
    const [price,setprice]=useState(0);
    // 不能低于租金
    const [noRents,setnoRents]=useState(0);
    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'House/add',
            payload:{...values,rentable_area,residue_add_area,price}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功')
            history.push('/houseManage/houseList')
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    const changeArea=(e:number)=>{
        setresidue_add_area(e);
        setrentable_area(e);
    };
    // 监听单价
    const changeprice=(e)=>{
        setprice(e);
    };
    useEffect(() => {
        setnoRents(rentable_area*price);
    }, [rentable_area,price]);
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
                <Form.Item label='房屋名称' name='house_name' rules={[{required: true, message: '请填写房屋名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area' rules={[{required: true, message: '请填写建筑面积'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡'>
                    <InputNumber onChange={changeArea} value={rentable_area}/>
                </Form.Item>
                <Form.Item label='单价/(元)'>
                    <InputNumber value={price} onChange={changeprice}/>
                </Form.Item>
                <Form.Item label='总租金/(元)' name='rents' rules={[
                    { required: true, message: '请填写总租金' },
                    {
                        validator: (_, value) => {
                            if (value < noRents) {
                                return Promise.reject(`不能低于 ${noRents}元`);
                            }
                            return Promise.resolve();
                        },
                    },
                ]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='注意'>
                   <span style={{fontSize:'12px',color:'#555'}}>总租金不能低于{noRents}元=单价*可租面积</span>
                </Form.Item>
                <Form.Item label='详细地址' name='address' rules={[{required: true, message: '请填写详细地址'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='总楼层/(层)' name='floors' rules={[{required: true, message: '请填写总楼层'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='剩余可增加面积㎡'>
                    <InputNumber value={residue_add_area} disabled/>
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
export default connect() (AddHouse)