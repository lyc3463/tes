import {useEffect, useState} from "react";
import {Button, Form, Input, message, Select} from "antd";
import {history} from "@@/core/history";
import {connect} from "@@/exports";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddSubjectList=(props:any)=>{
    const [form] = Form.useForm();
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Subject/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/financeManage/list')
        }
    };

    return(
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            form={form}
            layout="horizontal"
            size={'large'}
            onFinish={onFinish}
            style={{ marginTop: '1rem' }}
        >
            <Form.Item label="科目名称" name="name" rules={[{required: true, message: '请输入科目名称'}]}>
                <Input placeholder="例:xx项目"/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary"  htmlType="submit">
                    添加
                </Button>
            </Form.Item>
        </Form>
    )
}

export default  connect()(AddSubjectList)