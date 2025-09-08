import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Space, Spin} from "antd";
import {useState} from "react";
import {history,connect,useNavigate} from "umi";
import {getCurrentDate} from "@/utils/OpenTool";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 4 },
};

const AddNotice=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const [noticeDate,setNoticeDate]=useState(getCurrentDate());
    const onFinish=async (values)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'Notice/add',
            payload:{...values,noticeDate}
        });
        if (res.ErrorCode==0){
            message.success('添加成功');
            history.push('/propertyServerManage/notice');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    const changeDate=(_,date)=>{
        setNoticeDate(date);
    };
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
                 <DatePicker defaultValue={dayjs(noticeDate)} onChange={changeDate}/>
             </Form.Item>
             <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                 <Input/>
             </Form.Item>
             <Form.Item label="通知内容" name="notice_content" rules={[{ required: true, message: '请输入通知内容' }]}>
                 <Input.TextArea/>
             </Form.Item>
             <Form.Item {...tailLayout}>
                 <Space>
                     <Button type="primary" htmlType="submit">
                         添加
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
export default connect() (AddNotice)