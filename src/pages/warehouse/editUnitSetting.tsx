import {Button, Form, Input, message, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as UnitSettingvice from "@/services/unitSetting";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditUnitSetting=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const [unitsCode,setUnitsCode]=useState('');
    const [uid,setUid]=useState('0');
    const formRef=useRef();

    const onFinish=(values)=>{
        setSpinning(true);
        props.dispatch({
            type:'UnitSetting/edit',
            payload: {...values,uid,unitsCode}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('编辑成功');
                history.push('/warehouse/warehouseAndType');
                setSpinning(false);
            } else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
    }, []);
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  UnitSettingvice.one(id);
        if (res.ErrorCode==0){
            console.log('详情',res.Data);
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setUnitsCode(data.unitsCode);
            setSpinning(false);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                onFinish={onFinish}
                layout="horizontal"
                size={'large'}
                style={{ marginTop: '1rem' }}
            >
                {/* 1. 单位名称 */}
                <Form.Item
                    name="unitsName"
                    label="单位名称"
                    rules={[
                        { required: true, message: '请输入单位名称' },
                        { max: 50, message: '名称长度不超过50字符' }
                    ]}
                >
                    <Input placeholder="请输入单位名称" />
                </Form.Item>
                <Form.Item
                    label="单位代码(选填)"
                >
                    <Input placeholder="请输入单位代码" value={unitsCode} onChange={(e)=>setUnitsCode(e.target.value)} />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(EditUnitSetting)
// export default AddUnitSetting
