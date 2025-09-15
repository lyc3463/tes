import {
    Button,
    Form,
    DatePicker,
    Input,
    InputNumber,
    message,
    Spin,
    Col,
    Row, Image, Radio
} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {PlusOutlined} from "@ant-design/icons";
import MultiImageUploader from "@/components/MultiImageUploader";
import * as OwnerInfoService from '@/services/ownerInfo';
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const EditOwnerlnfo=(props)=>{
    const formRef=useRef();
    const [isSpinning,setIsSpinning]=useState(false);
    const [form] = Form.useForm();
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2000-01-01');
    const [formItems, setFormItems] = useState([]);
    const [imageUrls7, setImageUrls7] = useState<string[]>([]);// 合同图片b64
    const [imgName7, setImgName7] = useState<string[]>([]); // 合同图片名称
    const [uid,setUid]=useState('0');
    const [pdfName,setPdfName]=useState('');
    const [payType,setPayType]=useState(1);
    const [dayNum,setDayNum]=useState(1);
    const onFinish= (values)=>{
        let jsonDate=JSON.stringify(formItems);
        let imgNames=imgName7.join('|');
        props.dispatch({
            type:'OwnerInfo/edit',
            payload:{...values,endDate,startDate,jsonDate,imgNames,uid,pdfName,payType,dayNum}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/contract/ownerInfo');
            }else {
                message.error(res.Data);
            }
        })
    };
    // 选择时间
    const changeData=(_,item)=>{
        setStartDate(item[0]);
        setEndDate(item[1]);
    };
    // 添加新行
    const addFormItem = () => {
        const newKey = formItems.length > 0 ? Math.max(...formItems.map(item => item.id)) + 1 : 1;
        setFormItems([...formItems, { id: newKey, beginTime: null, endTime: null, zuMoney: 0 }]);
    };

    // 删除行
    const removeFormItem = (key) => {
        setFormItems(formItems.filter(item => item.id !== key));
    };

    // 更新行数据
    const updateFormItem = (key, field, value) => {
        setFormItems(formItems.map(item =>
            item.id === key ? { ...item, [field]: value } : item
        ));
    };
    // 合同图片
    const onImageUpload = (url:any) => {
        setImageUrls7(prev => [...prev, url.base64]);
        setImgName7(prev => [...prev, url.imgName]);
    };
    // 合同图片删除
    const handleDeleteImage7 = (index: number) => {
        setImageUrls7(prev => prev.filter((_, i) => i !== index));
        setImgName7(prev => prev.filter((_, i) => i !== index));
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
    }, []);
    // 获取详情
    const getOne=(e)=>{
        setIsSpinning(true);
        OwnerInfoService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log(res.Data);
                setPdfName(res.Data[0].pdfName);
                formRef.current.setFieldsValue(res.Data[0]);
                setStartDate(res.Data[0].beginTime);
                setEndDate(res.Data[0].endTime);
                setImgName7(res.Data[0].contractImage.split('|'));
                setIsSpinning(false);
                setFormItems(res.Data[1]);
                setPayType(res.Data[0].rentType);
                setDayNum(res.Data[0].rentDate);

            }else {
                setIsSpinning(false);
                message.warning(res.Data);
            }
        })
    };
    return(
        <Spin spinning={isSpinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='名称' name='customerName' rules={[{ required: true, message: '请输入名称' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='联系方式' name='customerPhone' rules={[{ required: true, message: '请输入联系方式' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='地址' name='customerAddress' rules={[{ required: true, message: '请输入地址' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='租金' name='zuMoney' rules={[{ required: true, message: '请输入租金' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='管理费' name='manageFee' rules={[{ required: true, message: '请输入管理费' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='押金' name='deposit' rules={[{ required: true, message: '请输入押金' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='管理费押金' name='depositFee' rules={[{ required: true, message: '请输入管理费押金' }]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='交租方式'>
                    <Radio.Group value={payType} onChange={(e)=>setPayType(e.target.value)}>
                        <Radio value={1}>每个月</Radio>
                        <Radio value={3}>一个季度</Radio>
                        <Radio value={6}>半年</Radio>
                        <Radio value={12}>一年</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='几号交租'>
                    <InputNumber min={1} max={28} value={dayNum} onChange={(e)=>setDayNum(e)}/>
                </Form.Item>
                <Form.Item label='甲方名称' name='ownerName' rules={[{ required: true, message: '请输入甲方名称' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='户名' name='accountName' rules={[{ required: true, message: '请输入户名' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='预留手机号' name='ownerPhone' rules={[{ required: true, message: '请输入预留手机号' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='银行账号' name='ownerCard' rules={[{ required: true, message: '请输入银行账号' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='开户行' name='bankName' rules={[{ required: true, message: '请输入开户行' }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='起租日'>
                    <DatePicker.RangePicker onChange={changeData} value={[dayjs(startDate), dayjs(endDate)]}/>
                </Form.Item>
                {/* 动态增删表格区域 */}
                <Form.Item label="租金明细" style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="dashed" onClick={addFormItem} icon={<PlusOutlined />}>
                            添加租金记录
                        </Button>
                    </div>
                    {/* 表头 */}
                    <Row gutter={[16, 8]} style={{ fontWeight: 'bold', marginBottom: 8 }}>
                        <Col span={6}>开始时间</Col>
                        <Col span={6}>结束时间</Col>
                        <Col span={6}>租金金额</Col>
                        <Col span={6}>操作</Col>
                    </Row>
                    {/* 表格内容 */}
                    {formItems.map(item => (
                        <Row key={item.id} gutter={[16, 16]} align="middle">
                            <Col span={12}>
                                <DatePicker.RangePicker
                                    value={[dayjs(item.beginTime), dayjs(item.endTime)]}
                                    onChange={(dates) => {
                                        // 同时更新开始和结束时间
                                        setFormItems(prev => prev.map(i =>
                                            i.id === item.id
                                                ? { ...i, beginTime: dates?.[0] || null, endTime: dates?.[1] || null }
                                                : i
                                        ));
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    value={item.zuMoney}
                                    onChange={(value) => updateFormItem(item.id, 'zuMoney', value)}
                                    style={{ width: '100%' }}
                                    min={0}
                                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                                />
                            </Col>
                            <Col span={6}>
                                <Button
                                    type="text"
                                    danger
                                    onClick={() => removeFormItem(item.id)}
                                    disabled={formItems.length <= 1} // 至少保留一行
                                >
                                    删除
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Form.Item>
                <Form.Item label='上传合同图片'>
                    <span>{imageUrls7.length?imageUrls7.length+'张':''}</span>
                    <MultiImageUploader onImageUpload={onImageUpload} multiple={true} />
                </Form.Item>
                <Form.Item label='合同图片'>
                    <Row gutter={[16, 24]} style={{ width: '100%', marginTop: '1rem' }}>
                        {imageUrls7.map((url, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                <Image src={url} alt={`Uploaded ${index}`} style={{ width: '80px',height:"80px" }} />
                                <Button onClick={() => handleDeleteImage7(index)}>删除</Button>
                            </Col>
                        ))}
                    </Row>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (EditOwnerlnfo)