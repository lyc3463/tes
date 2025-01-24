import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
import {connect,history} from "umi";
import {useEffect, useRef, useState} from "react";
import * as GateServer from "@/services/gate";
import dayjs from "dayjs";
import {Button, Form, Input, message, Select, Spin} from "antd";
const Editdevice=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState('0');
    const [isLoading,setIsLoading]=useState(false);
    const formRef=useRef();
    // 获取单个信息详情
    const getOneCustom=async (id:string)=>{
        let res:any=await  GateServer.one(id);
        if (res.ErrorCode==0){
            console.log("闸机详情",res);
            formRef.current.setFieldsValue(res?.Data);
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id);
        getHouseList();
    },[]);
    // 提交闸机信息
    const onFinish=(vals:any)=>{
        props.dispatch({
            type:'Gate/edit',
            payload:{...vals,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/gateManage/device');
                setIsLoading(false);
            }else{
                message.error(res.Data)
                setIsLoading(false);
            }
        })
    };
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch',
        })
    };
    return(
        <Spin spinning={isLoading}>
            <Form
                labelCol={{ span: 4 }}
                ref={formRef}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='房屋' name='house_id' >
                    <Select>
                        {props.HouseList?props.HouseList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.house_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='闸机编号' name='deviceSn' rules={[{required: true, message: '请填写闸机编号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='闸机地点' name='position' rules={[{required: true, message: '请填写闸机地点'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit" >
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
};

const mapStateToProps = (state: any) => {
    return {
        HouseList: state.House.list
    }
};
export default connect(mapStateToProps)(Editdevice)