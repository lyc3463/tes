import {Button, Form, Input, message, Spin} from "antd";
import {useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddUnitSetting=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const [unitsCode,setUnitsCode]=useState('');
    const onFinish=(values)=>{
        setSpinning(true);
        props.dispatch({
                type:'UnitSetting/add',
                payload: {...values, unitsCode}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    message.success('添加成功');
                    history.push('/warehouse/warehouseAndType');
                    setSpinning(false);
                } else {
                    message.error(res.ErrorCode + res.Data);
                    setSpinning(false);
                }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
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
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect()(AddUnitSetting)
// export default AddUnitSetting
