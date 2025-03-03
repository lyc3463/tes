import {Button, Form, Input, message, Spin} from "antd";
import {useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {history,connect} from "umi";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddParkingPayment=(props)=>{
    const [form] = Form.useForm();
    const [isLoading,setIsLoading]=useState(false);
    // 确定添加
    const onFinish=(e)=>{
        setIsLoading(true);
        props.dispatch({
            type:'ParkingPayment/add',
            payload:{...e}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/appletManage/links');
                setIsLoading(false);
            }else {
                message.error(res.Data);
                setIsLoading(false);
            }
        })
    };
    return(
        <div>
            <Spin spinning={isLoading}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    layout="horizontal"
                    size={'large'}
                    onFinish={onFinish}
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item label="链接名称" name="ppName" rules={[{required: true, message: '请输入链接名称'}]}>
                        <Input placeholder="例:xx停车收费平台"/>
                    </Form.Item>
                    <Form.Item label="链接地址" name="ppLink" rules={[{required: true, message: '请输入链接地址'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="注意事项">
                        <span style={{color:'red'}}>链接地址必须是小程序AppID才能跳转,如不清楚AppID请到</span><a href='https://mp.weixin.qq.com/' target='_blank'>点击此链接查看AppID</a>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
export default connect() (AddParkingPayment)