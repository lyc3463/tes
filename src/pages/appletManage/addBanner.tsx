import {Button, DatePicker, Form, Image, Input, message, Radio, Select, Spin, Upload} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";

import CmpImageUploader from "@/components/ImageUploader";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddBanner=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    // 单图
    const [single, setSingle] = useState<string | undefined>(undefined);
    // 不上传轮播图不能点击添加
    const [upImg, setUpImg] = useState<string | undefined>(undefined);
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Banner/add',
            payload:{...values,single}
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/appletManage/banner')
        }else {
            message.error(res.Data)
        }
    }

    // 单图
    const handleImageUpload = (val: string) => {
        setSingle(val); // 将base64字符串保存到状态中
        setUpImg(val);
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
                <Form.Item label="轮播图编号" name="biaohao" rules={[{required: true, message: '请输入轮播图编号'}]}>
                    <Input placeholder="例如:001"/>
                </Form.Item>
                <Form.Item label='缩略图'>
                   <CmpImageUploader onImageUpload={handleImageUpload}/>
                    <Image/>
                </Form.Item>
                <Form.Item label="是否显示在小程序" name='isxianshi'>
                    <Radio.Group >
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit" disabled={!upImg}>
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddBanner)