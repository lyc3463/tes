import {useEffect, useRef, useState} from "react";
import {history, useLocation,connect} from "umi";
import * as propertiesServer from "@/services/properties";
import {Button, Form, Image, Input, InputNumber, message, Radio, Space, Upload,Spin} from "antd";
import CmpImageUploader from "@/components/ImageUploader";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditProperties=(props:any)=>{
    const formRef=useRef();
    const location=useLocation();
    const [isLoading,setIsLoading]=useState(false);
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
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneProperties(id);
    },[]);
    const getOneProperties=async (id:string)=>{
        let res:any=await propertiesServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
            setImg(res?.Data.fileName);
            setImgs(res?.Data.fileNames.split(","));
            setFileData(res.Data.fileData);
            setHousing_image(res.Data.properties_image);
        }else {
            message.error(res.Data)
        }
    };
    const onFinish=(values:any)=>{
        let singles=imgs.join(",");
        props.dispatch({
            type:'Properties/edit',
            payload:{...values,uid,img,singles}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                history.push('/appletManage/properties');
            }else {
                message.error(res.Data);
            }
        })
    };
    // 单图名字
    const handleImageUpload = (val: string) => {
        setImg(val);
    };
    // 多图名字
    const handleImageUploads=(val:string)=>{
        setImgs([...imgs,val]);
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
    return(
        <Spin spinning={isLoading}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                ref={formRef}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label="楼盘标题" name="properties_title">
                    <Input placeholder="例:楼盘1"/>
                </Form.Item>
                <Form.Item label="详细地址" name="properties_address">
                    <Input placeholder="例:天河区"/>
                </Form.Item>
                <Form.Item label="开发集团" name="group">
                    <Input placeholder="例:天河区"/>
                </Form.Item>
                <Form.Item label="物业公司" name="property_company">
                    <Input placeholder="例:xx开发商"/>
                </Form.Item>
                <Form.Item label="区域" name="area_id">
                    <Radio.Group defaultValue={1}>
                        {props.RegionList?props.RegionList.map((item:any,index:number)=>{
                            return(
                                <Radio key={index} value={item.id}>{item.area_name}</Radio>
                            )
                        }):''}
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="装修" name="renovation_id">
                    <Radio.Group>
                        {props.RenovationList?props.RenovationList.map((item:any,index:number)=>{
                            return(
                                <Radio key={index} value={item.id}>{item.renovation_name}</Radio>
                            )
                        }):''}
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="特色" name="feature_id">
                    <Radio.Group >
                        {props.CharacteristicList?props.CharacteristicList.map((item:any,index:number)=>{
                            return(
                                <Radio key={index} value={item.id}>{item.feature_name}</Radio>
                            )
                        }):''}
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="楼盘面积m²" name="extent">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="每平方单价m²/元" name="price">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="工商注册（是、否）" name="business_register">
                    <Radio.Group defaultValue={1}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="楼盘层高(层)" name="floor_height">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="绿化率%" name="green_rate">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="得房率%" name="get_room_rate">
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label="楼盘状态" name="properties_status">
                    <Radio.Group defaultValue={0}>
                        <Radio value={1}>上架</Radio>
                        <Radio value={0}>下架</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="封面图" >
                    <CmpImageUploader onImageUpload={handleImageUpload} oldBase64={handBase64}/>
                    {housing_image?<Image src={housing_image} style={{width:'80px',height:'80px'}}/>:''}
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
                <Form.Item label="排序" name="sort">
                    <InputNumber placeholder={'越大排越前'} min={0}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RegionList: state.Region.list,
        RenovationList: state.Renovation.list,
        CharacteristicList: state.Characteristic.list
    }
};
export default connect(mapStateToProps)(EditProperties)