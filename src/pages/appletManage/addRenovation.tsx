import {useState} from "react";
import {Button, Form, Input, message, Radio, Select, Spin} from "antd";
import * as RenovationService from '@/services/renovation';
import {history} from "@@/core/history";
const park_id=sessionStorage.getItem('park_id')
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddRenovation=()=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    // 是否显示在小程序
    const [isxianshi,setIsxianshi]=useState(1)
    const change=(e)=>{
        setIsxianshi(e.target.value)
    }
    const onFinish=async (values)=>{
        let obj={name:values.name,park_id,stutes:isxianshi}
        let res=await RenovationService.add(obj)
        if (res?.ErrorCode==0){
            message.success('添加成功')
            history.push('/appletManage/renovation')
        }else {
            message.error(res.Data)
        }
    }
    return(
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
                {/*<Form.Item label="所属园区" name="name">*/}
                {/*    <Select/>*/}
                {/*</Form.Item>*/}
                <Form.Item label="特色名称" name="name">
                    <Input placeholder="例:豪华装修"/>
                </Form.Item>
                <Form.Item label="是否显示在小程序" >
                    <Radio.Group onChange={(e)=>{change(e)}} defaultValue={isxianshi}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
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
export default AddRenovation