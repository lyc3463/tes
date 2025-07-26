import {useEffect, useRef, useState} from "react";
import * as ChangeParkServer from "@/services/changePark";
import * as AppUserService from "@/services/appUser";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {Button, Form, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {useNavigate} from 'umi';
import {add} from "@/services/changePark";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const ChangePark=(props)=>{
    const formRef=useRef();
    const navigate=useNavigate();
    const [phone,setPhone]=useState('');
    const [list,setList]=useState([]);
    const [parkId,setParkId]=useState(0);
    const [spinning,setSpinning]=useState(false);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOne(id);
        getList();
    }, []);
    // 获取用户信息
    const getOne=(id)=>{
        AppUserService.one(id).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                console.log('res',res);
                formRef.current.setFieldsValue(res.Data);
                setPhone(res.Data.appUser_phone)
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取园区列表
    const getList=()=>{
        ChangeParkServer.fenye1601().then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                setList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    const onFinish=()=>{
        setSpinning(true);
        ChangeParkServer.add(phone,parkId).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('更换成功');
                navigate(-1);
            }else {
                message.error(res.Data);
            }
        })
    };
    const  change=(e)=>{
        setParkId(e);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                initialValues={{remark:'',minimum_recharge:1}}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='姓名' name='appUser_name'>
                    <Input disabled/>
                </Form.Item>
                <Form.Item label='手机号'>
                    <Input value={phone} disabled/>
                </Form.Item>
                <Form.Item label='园区'>
                    <Select
                        onChange={change}
                        placeholder='请选择'
                        showSearch
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = list.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.park_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {list.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={item.id}>
                                    {item.park_name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            确定
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
export default ChangePark