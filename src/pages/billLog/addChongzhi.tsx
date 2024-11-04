import {connect,history} from "umi";
import {Button, Form, Input, InputNumber, Select, Radio, message} from "antd";
import {useEffect, useState} from "react";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddChongzhi=(props:any)=>{
    const [form] = Form.useForm();
    const [handType,setHandType]=useState(1);
    const onFinish=(vals:any)=>{
        props.dispatch({
            type:'ManualRecharge/add',
            payload:{...vals,handType}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/billLog/manualRecharge')
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        console.log(props)
    }, []);
    const changeHandAmount=(e)=>{
        console.log(e.target.value)
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
                <Form.Item label='选择用户' name='openId' >
                    <Select>
                        {props.AppUserList&&props.AppUserList.length>0?props.AppUserList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.openId} key={index}>
                                    {item.appUser_phone}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='充值类型'>
                    <Radio.Group defaultValue={handType} onChange={changeHandAmount}>
                        <Radio value={0}>积分</Radio>
                        <Radio value={1}>余额</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='金额/积分' name='handAmount'>
                  <InputNumber min={0}/>
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
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list
    }
};
export default  connect(mapStateToProps)(AddChongzhi)