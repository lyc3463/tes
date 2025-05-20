import {useLocation,connect,history,useNavigate} from "umi";
import CmpImageUploader from "@/components/ImageUploader";
import {Button, Form, Image, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useEffect, useRef, useState} from "react";
import * as resourcesServer from "@/services/resources";

const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditResources=(props:any)=>{
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
    const formRef=useRef()
    const location=useLocation();
    // 单图
    const [img, setImg] = useState<string | undefined>(undefined);
    // 多图
    const [imgs, setImgs] = useState([]);
    // 显示的单图
    const [housing_image,setHousing_image]=useState('');
    // 显示的多图
    const [fileData,setFileData]=useState([]);
    // 需要修改的id
    const [uid,setUid]=useState('');
    // 房源租金
    const [rent,setrent]=useState(0);
    // 房源单价
    const [price,setprice]=useState(0);
    // 房源面积
    const [housing_extent,sethousing_extent]=useState(0);

    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneProperties(id);
    },[]);
    // 修改的详情
    const getOneProperties=async (id:string)=>{
        setIsLoading(true);
        let res:any=await resourcesServer.one(id);
        if (res?.ErrorCode==0){
            setIsLoading(false);
            formRef.current.setFieldsValue(res?.Data)
            setImg(res?.Data.fileName);
            setImgs(res?.Data.fileNames.split(","));
            setFileData(res.Data.fileData);
            setHousing_image(res.Data.housing_image);
            setprice(res.Data.price);
            setrent(res.Data.rent);
            sethousing_extent(res.Data.housing_extent);
        }else {
            setIsLoading(false);
            message.error(res.Data);
        }
    }
    // 单图名字
    const handleImageUpload = (val: string) => {
        setImg(val);
    };
    // 多图名字
    const handleImageUploads=(val:string)=>{
        setImgs([...imgs,val]);
    };
    const onFinish=async (values:any)=>{
        let singles=imgs.join(",");
        setIsLoading(true);
        let res:any=await props.dispatch({
            type:'Resources/edit',
            payload:{...values,uid,img,singles,price,rent,housing_extent}
        });
        if (res.ErrorCode==0){
            message.success('修改成功');
            history.push('/appletManage/resources');
            setIsLoading(false);
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    // 单图base64
    const handBase64=(vals:string)=>{
        setHousing_image(vals);
    };
    // 多图base64
    const handBase64s=(vals:string)=>{
        setFileData([...fileData,vals]);
    };
    const handleDelete=(index:number)=>{
        const newImages = [...imgs];
        newImages.splice(index, 1);
        setImgs(newImages);
        const newB64 = [...fileData];
        newB64.splice(index, 1);
        setFileData(newB64);
    };
    useEffect(() => {
        setrent(price*housing_extent);
    }, [price,housing_extent]);
    return(
        <Spin spinning={isLoading}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
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
                <Form.Item label="房源面积(m²)">
                    <InputNumber min={0} value={housing_extent} onChange={(e)=>sethousing_extent(e)}/>
                </Form.Item>
                <Form.Item label="房源单价">
                    <InputNumber min={0} value={price} onChange={(e)=>setprice(e)}/>
                </Form.Item>
                <Form.Item label="房源租金" >
                    <InputNumber min={0} value={rent} onChange={(e)=>setrent(e)}/>
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
                        <Radio value={1}>上架</Radio>
                        <Radio value={0}>下架</Radio>
                    </Radio.Group>

                </Form.Item>
                <Form.Item label="排序" name="sort">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="封面图" >
                    <Space>
                        <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={handBase64}/>
                        {housing_image?<Image src={housing_image} style={{width:'80px',height:'80px'}}/>:''}
                    </Space>
                </Form.Item>
                <Form.Item label="多图">
                    <CmpImageUploader onImageUpload={handleImageUploads} oldBase64={handBase64s}/>
                    <Space style={{display:'flex',flexWrap:'wrap'}}>
                        <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                            {fileData.length>0?fileData.map((item:any,index:number)=>{
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
                    </Space>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            修改
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
const mapStateToProps = (state: any) => {
    return {
        PropertiesList: state.Properties.list,
    }
};
export default connect(mapStateToProps)(EditResources)