import {Button, Form, Input, InputNumber, message, Spin} from "antd";
import {connect, history} from "umi";
import {useState} from "react";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddHouse=(props:any)=>{
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'House/add',
            payload:values
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功')
            history.push('/houseManage/houseList')
        }else {
            message.error(res.Data);
            setspinning(false);
        }
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
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='房屋名称' name='house_name'>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡' name='rentable_area'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='单价/(元)' name='price'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='总租金/(元)' name='rents'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='详细地址' name='address'>
                    <Input/>
                </Form.Item>
                <Form.Item label='总楼层/(层)' name='floors'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='剩余可增加面积㎡' name='residue_add_area'>
                    <InputNumber/>
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