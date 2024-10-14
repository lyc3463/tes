import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Spin} from "antd";
import {useState} from "react";
import {history,connect} from "umi";
import {getCurrentDate} from "@/utils/OpenTool";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const AddNotice=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    const [noticeDate,setNoticeDate]=useState(getCurrentDate())
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Notice/add',
            payload:{...values,noticeDate}
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/propertyServerManage/notice')
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
             <Form.Item label="时间">
                 <DatePicker />
             </Form.Item>
             <Form.Item label="通知内容" name="notice_content">
                 <Input.TextArea/>
             </Form.Item>
             <Form.Item label="状态" name="park_status">
                 <Radio.Group>
                     <Radio value={1}>发布到小程序</Radio>
                     <Radio value={0}>不发布</Radio>
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
export default connect() (AddNotice)