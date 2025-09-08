import {Button, DatePicker, Form, Image, message, Radio, Select, Space, Spin, Upload} from "antd";
import {CloseOutlined, UploadOutlined} from "@ant-design/icons";
import Icon from "antd/es/icon";
import React, {useEffect, useState} from "react";
import {compressBase64, getBase64} from "@/utils/OpenTool";
import * as PostImgServer from "@/services/postImg";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {connect,history,useNavigate} from "umi";

const editRenovation=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [zhuhuList,setZhuhuList]=useState([]);
    const [startDate,setStartDate]=useState('');
    const [userID,setUserId]=useState(0);
    const [type,setType]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    // 租户列表
    const getTenantList=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page:1,name:'',phone:'',pagecount:1000}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZhuhuList(res.Data);
            }
        })
    };
    // 定义图片上传成功后的处理函数（收集URL）
    const onImageUpload = (url: string) => {
        if (url) {
            setImageUrls(prev => [...prev, url]); // 追加新图片URL
        }
    };
    const beforeUpload = async file => {
        const fileType = file.type;
        const isImage = fileType.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片！');
            return  false;
        }
        // 转换为 Base64
        try {
            const base64:any = await getBase64(file);
            const newBase64:any=await compressBase64(base64);
            onImageUpload(newBase64);
        } catch (error) {
            message.error('Failed to convert file to Base64.');
        }
        return false;
    };
    const onOK=()=>{
        let newBase64=imageUrls.join('|');
        setspinning(true);
        PostImgServer.addList(newBase64).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                addRenovation(res.Data);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        });
    };
    const addRenovation=(item)=>{
        props.dispatch({
            type:'ApplyRenovation/add',
            payload:{startDate,userID,type,imgName:item}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/propertyServerManage/renovationList/');
            }else {
                message.error(res.Data);
            }
        })
    };
    const onFinish=()=>{
        if (startDate=='') return message.warning('请选择日期！');
        if (userID==0) return message.warning('请选择租户！');
        if (imageUrls.length==0) return message.warning('请上传图片');
        onOK();
    };
    const changeTenant=(e)=>{
        const selectedZhuhu = zhuhuList.find(item => item.id === e);
        if (selectedZhuhu.userId==0) return message.warning('该租户未登录过，请重新选择租户！');
        setUserId(selectedZhuhu.userId);
    };
    const changeDate=(_:any,date:any)=>{
        setStartDate(date);
    };
    useEffect(() => {
        getTenantList();
    }, []);
    // 添加图片删除处理函数
    const handleDeleteImage = (index: number) => {
        // 过滤掉要删除的图片URL
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };
    const changeType=(e)=>{
        setType(e);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' ,width:'50vw',margin:'0 auto'}}
            >
                <Form.Item label='选择租户'>
                    <Select
                        onChange={changeTenant}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =zhuhuList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {zhuhuList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.tenant_name}-{item.tenant_phone}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='选择装修日期'>
                    <DatePicker onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='装修类型'>
                    <Radio.Group onChange={changeType} value={type}>
                        <Radio value={1}>公司装</Radio>
                        <Radio value={2}>自装</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='上传图片'>
                    <Upload
                        name="file"
                        multiple={true} // 启用多图上传
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false} // 隐藏默认上传列表（使用自定义展示）
                        beforeUpload={beforeUpload}
                    >
                        {/* 添加一个提示或占位图 */}
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ccc' }}>
                            <Icon type="plus" style={{ fontSize: 24 }} />
                            <div style={{ marginTop: 8 }}>点击上传</div>
                        </div>
                    </Upload>
                    {/* 显示已上传图片列表 */}
                    {imageUrls.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            {imageUrls.map((url, index) => (
                                // 用相对定位容器包裹图片和删除按钮
                                <div key={index} style={{ position: 'relative' }}>
                                    <Image
                                        src={url}
                                        alt={`上传图片${index+1}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            border: '1px solid #eee'
                                        }}
                                    />
                                    {/* 删除按钮 - 定位在图片右上角 */}
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined style={{ color: 'red' }} />}
                                        onClick={() => handleDeleteImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            编辑
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
export default connect()(editRenovation);
