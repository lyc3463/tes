import {Button, Form, InputNumber, message, Radio, Spin} from "antd";
import {useEffect, useState} from "react";
import * as AppPzService from "@/services/appPz";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ThenBuckleSettings=()=>{
    const [isExamine,setAcValue]=useState(100);
    const [spinning,setspinning]=useState(false);
    const [isAddOrEdit,setIsAddOrEdit]=useState(true);
    const changeValue=(e)=>{
        setAcValue(e);
    };
    // 获取配置信息
    const getpeInfo=()=>{
        AppPzService.thenBuckleOne().then((res:TypeErrorCode)=>{
            if (res.ErrorCode === 0 && res.Data !== null && res.Data.parkIdOut!==0){
                setAcValue(res.Data.discount);
                setIsAddOrEdit(false);
            }else {
                setIsAddOrEdit(true);
            }
        })
    };
    useEffect(() => {
        getpeInfo();
    }, []);
    // 添加
    const getpeAdd=()=>{
        AppPzService.addThenBuckle(isExamine).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode === 0 ){
                getpeInfo();
                message.success('保存成功');
            }else {
                message.error(res.Data);
            }
            setspinning(false);
        })
    };
    // 编辑
    const getpeEdit=()=>{
        AppPzService.editThenBuckle(isExamine).then((res:TypeErrorCode)=>{
            setspinning(true);
            if (res.ErrorCode === 0 ){
                getpeInfo();
                message.success('保存成功');
            }else {
                message.error(res.Data);
            }
            setspinning(false);
        })
    };
    // 保存
    const onFinish=()=>{
        if (isAddOrEdit){
            getpeAdd();
        }else {
            getpeEdit();
        }
    };
    return(
        <Spin spinning={spinning}>
            <Form>
                <Form.Item label='折扣率'>
                    <InputNumber value={isExamine} onChange={changeValue} min={0} max={100}/>%
                </Form.Item>
                <Form.Item>
                    <span style={{color:'#999',fontSize:'12px'}}>注意:不能低于0,不能大于100！</span>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' onClick={onFinish}>保存</Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default ThenBuckleSettings;
