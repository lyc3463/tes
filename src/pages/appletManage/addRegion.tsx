import {useState} from "react";
import {Button, Form, Input, Radio, Select, Spin,message} from "antd";
import * as RegionService from '@/services/region';
import {history,connect} from "umi";

const park_id=sessionStorage.getItem('park_id')

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddRegion=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    // 是否显示在小程序
    const [stutes,setStutes]=useState(1)
    const change=(e)=>{
        setStutes(e.target.value)
    }
    const onFinish=async (values)=>{
        let res=await  props.dispatch({
            type:'Region/add',
            payload:values
        })
       if (res.ErrorCode==0){
           message.success('添加成功')
           history.push('/appletManage/propertyDescription/')
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
                <Form.Item label="区域名称" name="name">
                    <Input placeholder="例:天河区"/>
                </Form.Item>
                <Form.Item label="是否显示在小程序" name='stutes'>
                    <Radio.Group>
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
export default connect() (AddRegion)