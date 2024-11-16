import {Button, Form, Input, InputNumber, Radio, Select, Spin, message, Image, Space} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {connect,history} from 'umi'
import CmpImageUploader from "@/components/ImageUploader";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddResources=(props:any)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [form] = Form.useForm();
    // 是否显示在小程序
    const [isxianshi,setIsxianshi]=useState(1)
    // 单图
    const [single, setSingle] = useState<string | undefined>(undefined);
    // 单图b64
    const [b64,setB64]=useState('');
    // 多图
    const [imgs, setImgs] = useState([]);
    // 多图B64
    const [b64s,setB64s]=useState([]);
    // 添加提交
    const onFinish=async (values)=>{
        let singles=imgs.join(',');
        let res=await props.dispatch({
            type:'Resources/add',
            payload:{...values,single,singles}
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/appletManage/resources')
        }else {
            message.error(res.Data)
        }
    };
    // 单图
    const handleImageUpload = (val: string) => {
        setSingle(val); // 将base64字符串保存到状态中
    };
    // 多图
    const handleImageUploads=(val:string)=>{
        setImgs([...imgs,val]);
    };
    // 单图B64
    const getImgBase64=(val:string)=>{
      setB64(val);
    };
    const getImgBase64s=(val:string)=>{
        setB64s([...b64s,val]);
    };
    const handleDelete=(index:number)=>{
        const newImages = [...imgs];
        newImages.splice(index, 1);
        setImgs(newImages);
        const newB64 = [...b64s];
        newB64.splice(index, 1);
        setB64s(newB64);
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
                <Form.Item label="所属楼盘" name="properties_id">
                    <Select>
                        {props.PropertiesList&&props.PropertiesList.length>0?props.PropertiesList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.properties_title}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label="房源编号" name="housing_name">
                    <Input/>
                </Form.Item>
                <Form.Item label="房源类型" name="housing_type">
                    <Radio.Group>
                        <Radio value={0}>办公</Radio>
                        <Radio value={1}>商业</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="房源面积(m²)" name="housing_extent">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="房源单价" name="price">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="房源租金" name="rent">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="付款方式" name="payment_method">
                    <Input placeholder="例:押一付一"/>
                </Form.Item>
                <Form.Item label="最短租期" name="shortest_tenancy">
                    <Input placeholder="例:24个月"/>
                </Form.Item>
                <Form.Item label="装修" name="decoration_situation">
                    <Input/>
                </Form.Item>
                <Form.Item label="周边配套" name="surrounding_facilities">
                    <Input/>
                </Form.Item>
                <Form.Item label="房源格局" name="housing_layout">
                    <Input/>
                </Form.Item>
                <Form.Item label="房源特色" name="housing_characteristic">
                    <Input/>
                </Form.Item>
                <Form.Item label="状态" name="housing_status">
                   <Radio.Group>
                       <Radio value={0}>上架</Radio>
                       <Radio value={1}>下架</Radio>
                   </Radio.Group>
                </Form.Item>
                <Form.Item label="排序" name="sort">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="封面图">
                    <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                    {b64?<Image src={b64} style={{width:'80px',height:"80px"}}/>:''}
                </Form.Item>
                <Form.Item label="多图">
                    <CmpImageUploader onImageUpload={handleImageUploads} oldBase64={getImgBase64s}/>
                    <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                        {b64s.length>0?b64s.map((item:any,index:number)=>{
                            return(
                                <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                    <Image src={item} style={{ width: '80px', height: '80px' }} />
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={() => handleDelete(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            zIndex: 1,
                                            padding: '2px 4px',
                                            transform: 'translate(-50%, -50%)', // 使按钮居中于图片的左上角
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
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PropertiesList: state.Properties.list,
    }
};
export default connect(mapStateToProps)(AddResources)