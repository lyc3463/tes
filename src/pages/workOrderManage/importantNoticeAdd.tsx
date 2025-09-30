import {Button, Form, Image, Input, message, Space, Spin} from "antd";
import {useNavigate,history,connect} from "umi";
import {useState} from "react";
import NoyasuoImgCmp from "@/components/NoyasuoImgCmp";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const ImportantNoticeAdd=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    const [unitImages,setunitImgName]=useState([]);
    const [unitB64,setuintB64]=useState([]);
    const onFinish=(val)=>{
        setspinning(true);
        let joinImg=unitImages.join('|');
        props.dispatch({
            type:'ImportantNotice/add',
            payload:{...val,imgs:joinImg}
        }).then((res)=>{
            if(res.ErrorCode==0||res.ErrorCode==9038){
                message.success('添加成功');
                history.push('/workOrderManage/worlOrder/');
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const getunitImgName=(e:string)=>{
        setunitImgName((prevItems=>[...prevItems,e]))
    };
    const getunitB64=(e:string)=>{
        setuintB64((prevItems=>[...prevItems,e]))
    };
    const handleDeleteunitImg=(index:number)=>{
        const newImages = [...unitImages];
        newImages.splice(index, 1);
        setunitImgName(newImages);
        const newB64 = [...unitB64];
        newB64.splice(index, 1);
        setuintB64(newB64);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                initialValues={{reason:''}}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='标题' name='title' rules={[{required: true, message: '请输入' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='内容' name='content' rules={[{required: true, message: '请输入' }]}>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='图片(选填)'>
                    <NoyasuoImgCmp onImageUpload={getunitImgName} oldBase64={getunitB64}/>
                    <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                        {unitB64.length>0?unitB64.map((item:any,index:number)=>{
                            return(
                                <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                    <Image src={item} style={{ width: '80px', height: '80px' }} />
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={() => handleDeleteunitImg(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            zIndex: 1,
                                            padding: '2px 4px',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        删除
                                    </Button>
                                </div>
                            )
                        }):''}
                    </Space>
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
export default connect() (ImportantNoticeAdd);
