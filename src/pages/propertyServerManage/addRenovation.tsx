import {Button, Col, DatePicker, Form, Image, message, Radio, Select, Space, Spin, Row, Modal} from "antd";
import React, {useEffect, useState} from "react";
import * as PostImgServer from "@/services/postImg";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {connect,history,useNavigate} from "umi";
import MultiImageUploader from "@/components/MultiImageUploader"; // 导入封装组件

const AddRenovation=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [zhuhuList,setZhuhuList]=useState([]);
    const [startDate,setStartDate]=useState('');
    const [endDate,setEndDate]=useState('');
    const [userID,setUserId]=useState(0);
    const [type,setType]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);//装修公司资质b64
    const [imgName, setImgName] = useState<string[]>([]);// 装修公司资质图片名称
    const [imageUrls2, setImageUrls2] = useState<string[]>([]);// 装修申请协议b64
    const [imgName2, setImgName2] = useState<string[]>([]);// 装修申请协议图片名称
    const [imageUrls3, setImageUrls3] = useState<string[]>([]); // 电力配力b64
    const [imgName3, setImgName3] = useState<string[]>([]);// 电力配力图片名称
    const [imageUrls4, setImageUrls4] = useState<string[]>([]);  // 装修预算b64
    const [imgName4, setImgName4] = useState<string[]>([]); // 装修预算图片名称
    const [imageUrls5, setImageUrls5] = useState<string[]>([]);// 施工图b64
    const [imgName5, setImgName5] = useState<string[]>([]);// 施工图图片名称
    const [imageUrls6, setImageUrls6] = useState<string[]>([]); // 效果图b64
    const [imgName6, setImgName6] = useState<string[]>([]);// 效果图图片名称
    const [imageUrls7, setImageUrls7] = useState<string[]>([]);// 保险单b64
    const [imgName7, setImgName7] = useState<string[]>([]); // 保险单图片名称
    const [imageUrls8, setImageUrls8] = useState<string[]>([]); // 高危作业人b64
    const [imgName8, setImgName8] = useState<string[]>([]);  // 高危作业人图片名称
    const [visible, setVisible] = useState(false);
    // 租户列表
    const getTenantList=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page:1,name:'',phone:'',pagecount:1000}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZhuhuList(res.Data.data);
            }
        })
    };
    // 装修公司资质
    const onImageUpload = (url:any) => {
        setImageUrls(prev => [...prev, url.base64]);
        setImgName(prev => [...prev, url.imgName]);
    };
    // 装修申请协议
    const onImageUpload2 = (url:any) => {
        setImageUrls2(prev => [...prev, url.base64]);
        setImgName2(prev => [...prev, url.imgName]);
    };
    // 电力配力
    const onImageUpload3 = (url:any) => {
        setImageUrls3(prev => [...prev, url.base64]);
        setImgName3(prev => [...prev, url.imgName]);
    };
    // 装修预算
    const onImageUpload4 = (url:any) => {
        setImageUrls4(prev => [...prev, url.base64]);
        setImgName4(prev => [...prev, url.imgName]);
    };
    // 施工图
    const onImageUpload5 = (url:any) => {
        setImageUrls5(prev => [...prev, url.base64]);
        setImgName5(prev => [...prev, url.imgName]);
    };
    // 效果图
    const onImageUpload6 = (url:any) => {
        setImageUrls6(prev => [...prev, url.base64]);
        setImgName6(prev => [...prev, url.imgName]);
    };
    // 保险单
    const onImageUpload7 = (url:any) => {
        setImageUrls7(prev => [...prev, url.base64]);
        setImgName7(prev => [...prev, url.imgName]);
    };
    // 高危作业人
    const onImageUpload8 = (url:any) => {
        setImageUrls8(prev => [...prev, url.base64]);
        setImgName8(prev => [...prev, url.imgName]);
    };
    const onOK=()=>{
        let newBase64=imgName.join('|');
        let newBase642=imgName2.join('|');
        let newBase643=imgName3.join('|');
        let newBase644=imgName4.join('|');
        let newBase645=imgName5.join('|');
        let newBase646=imgName6.join('|');
        let newBase647=imgName7.join('|');
        let newBase648=imgName8.join('|');
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/add',
            payload:{startDate,endDate,userID,type,newBase64,newBase642,newBase643,newBase644,newBase645,newBase646,newBase647,newBase648}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('添加成功');
                history.push('/propertyServerManage/renovationList/');
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const onFinish=()=>{
        if (startDate=='') return message.warning('请选择开始日期！');
        if (endDate=='') return message.warning('请选择结束日期！');
        if (userID==0) return message.warning('请选择租户！');
        if (type==0) return message.warning('请选择装修类型！');
        if ((type==1||type==3)&&imageUrls.length==0) return message.warning('请上传装修公司资质！');
        if ((type==1||type==2)&&imageUrls2.length==0) return message.warning('请上传装修申请协议！');
        if ((type==1||type==2)&&imageUrls3.length==0) return message.warning('请上传电力配力！');
        if ((type==1||type==2)&&imageUrls4.length==0) return message.warning('请上传装修预算！');
        if ((type==1||type==2)&&imageUrls5.length==0) return message.warning('请上传施工图！');
        if ((type==1||type==2)&&imageUrls6.length==0) return message.warning('请上传效果图！');
        if (imageUrls7.length==0) return message.warning('请上传保险单！');
        if (type==3&&imageUrls8.length==0) return message.warning('请上传高危作业人！');
        onOK();
    };
    const changeTenant=(e)=>{
        const selectedZhuhu = zhuhuList.find(item => item.id === e);
        if (selectedZhuhu.userId==0) {
             message.warning('该租户未登录过，请重新选择租户！');
            setUserId(0);
        }else {
            setUserId(selectedZhuhu.userId);
        }
    };
    const changeDate=(_:any,date:any)=>{
        setStartDate(date[0]);
        setEndDate(date[1]);
    };
    useEffect(() => {
        getTenantList();
    }, []);
    const changeType=(e)=>{
        setType(e.target.value);
    };
    // 装修公司资质删除
    const handleDeleteImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
        setImgName(prev => prev.filter((_, i) => i !== index));
    };
    // 装修申请协议删除
    const handleDeleteImage2 = (index: number) => {
        setImageUrls2(prev => prev.filter((_, i) => i !== index));
        setImgName2(prev => prev.filter((_, i) => i !== index));
    };
    // 电力配力删除
    const handleDeleteImage3 = (index: number) => {
        setImageUrls3(prev => prev.filter((_, i) => i !== index));
        setImgName3(prev => prev.filter((_, i) => i !== index));
    };
    // 装修预算删除
    const handleDeleteImage4 = (index: number) => {
        setImageUrls4(prev => prev.filter((_, i) => i !== index));
        setImgName4(prev => prev.filter((_, i) => i !== index));
    };
    // 施工图删除
    const handleDeleteImage5 = (index: number) => {
        setImageUrls5(prev => prev.filter((_, i) => i !== index));
        setImgName5(prev => prev.filter((_, i) => i !== index));
    };
    // 效果图删除
    const handleDeleteImage6 = (index: number) => {
        setImageUrls6(prev => prev.filter((_, i) => i !== index));
        setImgName6(prev => prev.filter((_, i) => i !== index));
    };
    // 保险单删除
    const handleDeleteImage7 = (index: number) => {
        setImageUrls7(prev => prev.filter((_, i) => i !== index));
        setImgName7(prev => prev.filter((_, i) => i !== index));
    };
    // 高危作业人删除
    const handleDeleteImage8 = (index: number) => {
        setImageUrls8(prev => prev.filter((_, i) => i !== index));
        setImgName8(prev => prev.filter((_, i) => i !== index));
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
                <Form.Item label='装修日期'>
                    <DatePicker.RangePicker onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='装修类型'>
                    <Radio.Group onChange={changeType} value={type}>
                        <Radio value={1}>公司装</Radio>
                        <Radio value={2}>自装</Radio>
                        <Radio value={3}>高危作业</Radio>
                    </Radio.Group>
                </Form.Item>
                <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                    {/* 公司资质 */}
                    {
                        type==1||type==3?<Col xs={24} sm={12} md={8} lg={6}> {/* 响应式布局：大屏6列/中屏8列/小屏12列/超小屏24列 */}
                            <Form.Item label='公司资质'>
                                <span>{imageUrls.length?imageUrls.length+'张':''}</span>
                                <MultiImageUploader onImageUpload={onImageUpload} multiple={true} />
                            </Form.Item>
                        </Col>:null
                    }
                    {
                        type==1||type==2?<>
                            {/* 申请协议 */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Form.Item label='申请协议'>
                                    <span>{imageUrls2.length?imageUrls2.length+'张':''}</span>
                                    <MultiImageUploader onImageUpload={onImageUpload2} multiple={true} />
                                </Form.Item>
                            </Col>
                            {/* 电力配力 */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Form.Item label='电力配力'>
                                    <span>{imageUrls3.length?imageUrls3.length+'张':''}</span>
                                    <MultiImageUploader onImageUpload={onImageUpload3} multiple={true} />
                                </Form.Item>
                            </Col>
                            {/* 装修预算 */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Form.Item label='装修预算'>
                                    <span>{imageUrls4.length?imageUrls4.length+'张':''}</span>
                                    <MultiImageUploader onImageUpload={onImageUpload4} multiple={true} />
                                </Form.Item>
                            </Col>
                            {/* 施工图 */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Form.Item label='施工图'>
                                    <span>{imageUrls5.length?imageUrls5.length+'张':''}</span>
                                    <MultiImageUploader onImageUpload={onImageUpload5} multiple={true} />
                                </Form.Item>
                            </Col>
                            {/* 效果图 */}
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Form.Item label='效果图'>
                                    <span>{imageUrls6.length?imageUrls6.length+'张':''}</span>
                                    <MultiImageUploader onImageUpload={onImageUpload6} multiple={true} />
                                </Form.Item>
                            </Col>
                        </>:''
                    }
                    {/* 保险单 */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label='保险单'>
                            <span>{imageUrls7.length?imageUrls7.length+'张':''}</span>
                            <MultiImageUploader onImageUpload={onImageUpload7} multiple={true} />
                        </Form.Item>
                    </Col>
                    {/* 高危作业人 */}
                    {
                        type==3? <Col xs={24} sm={12} md={8} lg={6}>
                                <Form.Item label='高危作业人'>
                                    <span>{imageUrls8.length?imageUrls8.length+'张':''}</span>
                                    <MultiImageUploader onImageUpload={onImageUpload8} multiple={true} />
                                </Form.Item>
                            </Col>:''
                    }

                </Row>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            添加装修申请
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                        <Button onClick={()=>setVisible(true)} type="primary">查看上传的资质</Button>
                    </Space>
                </Form.Item>
                <Modal title={'上传资质'} onOk={()=>setVisible(false)} open={visible} onCancel={()=>setVisible(false)}>
                    <Form>
                        {
                            type==1||type==3?
                                <Form.Item label='公司资质'>
                                    <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                        {imageUrls.map((url, index) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                                <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                                <Button onClick={() => handleDeleteImage(index)}>删除</Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Item>:''
                        }
                        {
                            type==2||type==1?<>
                                <Form.Item label='申请协议'>
                                    <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                        {imageUrls2.map((url, index) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                                <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                                <Button onClick={() => handleDeleteImage2(index)}>删除</Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Item>
                                <Form.Item label='电力配力'>
                                    <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                        {imageUrls3.map((url, index) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                                <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                                <Button onClick={() => handleDeleteImage3(index)}>删除</Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Item>
                                <Form.Item label='装修预算'>
                                    <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                        {imageUrls4.map((url, index) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                                <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                                <Button onClick={() => handleDeleteImage4(index)}>删除</Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Item>
                                <Form.Item label='施工图'>
                                    <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                        {imageUrls5.map((url, index) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                                <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                                <Button onClick={() => handleDeleteImage5(index)}>删除</Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Item>
                                <Form.Item label='效果图'>
                                    <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                        {imageUrls6.map((url, index) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                                <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                                <Button onClick={() => handleDeleteImage6(index)}>删除</Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Item>
                            </>:''
                        }
                        <Form.Item label='保险单'>
                            <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                {imageUrls7.map((url, index) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                        <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                        <Button onClick={() => handleDeleteImage7(index)}>删除</Button>
                                    </Col>
                                ))}
                            </Row>
                        </Form.Item>
                        {
                            type==3?<Form.Item label='高危作业人'>
                            <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                                {imageUrls8.map((url, index) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                        <Image src={url} alt={`Uploaded ${index}`} style={{ width: '100%' }} />
                                        <Button onClick={() => handleDeleteImage8(index)}>删除</Button>
                                    </Col>
                                ))}
                            </Row>
                        </Form.Item>:''
                        }
                    </Form>
                </Modal>
            </Form>

        </Spin>
    )
}
export default connect()(AddRenovation);
