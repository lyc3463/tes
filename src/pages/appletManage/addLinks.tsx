import {Button, Form, Image, Input, InputNumber, message, Radio, Spin} from "antd";
import CmpImageUploader from "@/components/ImageUploader";
import {useState} from "react";
import {history,connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddLinks=(props:any)=>{
    const [form] = Form.useForm();
    const [isLoading,setIsLoading]=useState(false);
    // 单图
    const [single, setSingle] = useState<string | undefined>(undefined);
    const [b64,setB64]=useState('');
    // 单图
    const handleImageUpload = (val: string) => {
        setSingle(val); // 将base64字符串保存到状态中
    };
    // 确定按钮
    const onFinish=async (values)=>{
        if (!b64){
            message.warning('请添加图片');
        }else {
            setIsLoading(true);
             props.dispatch({
                type:'Links/add',
                payload:{...values,single}
            }).then((res:TypeErrorCode)=>{
                 if (res.ErrorCode==0){
                     message.success('添加成功');
                     history.push('/appletManage/links');
                     setIsLoading(false);
                 }else {
                     message.error(res.Data);
                     setIsLoading(false)
                 }
             })

        }

    };
    const handBase64=(val:string)=>{
        setB64(val);
    };
    return(
        <div>
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
                    <Form.Item label="链接名称" name="link_name" rules={[{required: true, message: '请输入链接名称'}]}>
                        <Input placeholder="例:xx小程序"/>
                    </Form.Item>
                    <Form.Item label="链接地址" name="link_address" rules={[{required: true, message: '请输入链接地址'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="注意事项">
                        <span style={{color:'red'}}>链接地址必须是小程序AppID才能跳转,如不清楚AppID请到</span><a href='https://mp.weixin.qq.com/' target='_blank'>点击此链接查看AppID</a>
                    </Form.Item>
                    <Form.Item label="封面图" >
                        <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={handBase64}/>
                        {b64?<Image src={b64} style={{width:'80px',height:'80px'}}/>:''}
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}
export default connect()(AddLinks)