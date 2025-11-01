import {Button, Form, message, Radio, Spin} from "antd";
import {useEffect, useState} from "react";
import * as AppPzService from "@/services/appPz";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const SalesReviewSettings=()=>{
    const [isExamine,setAcValue]=useState(0);
    const [spinning,setspinning]=useState(false);
    const changeValue=(e)=>{
        setAcValue(e.target.value);
    };
    // 获取配置信息
    const getpeInfo=()=>{
        setspinning(true);
        AppPzService.fetchpz(8).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setAcValue(res.Data.isExamine);
                setspinning(false);
            }else if (res.ErrorCode==1493){
                setAcValue(0);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getpeInfo();
    }, []);
    const onFinish=()=>{
        setspinning(true);
        AppPzService.addpz(isExamine,8).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('保存成功');
                getpeInfo();
                setspinning(false);
            }else {
                message.error(res.Data);
                getpeInfo();
                setspinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form>
                <Form.Item label='是否开启'>
                    <Radio.Group value={isExamine} onChange={changeValue}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <span style={{color:'#999',fontSize:'12px'}}>注意:开启是，调拨申请不需要审核!</span>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' onClick={onFinish}>保存</Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default SalesReviewSettings;
