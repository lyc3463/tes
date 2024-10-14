import {useEffect, useRef, useState} from "react";
import {history, useLocation,connect} from "umi";
import * as propertiesServer from "@/services/properties";
import {Button, Form, Image, Input, InputNumber, message, Radio, Upload} from "antd";
import CmpImageUploader from "@/components/ImageUploader";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditProperties=(props:any)=>{
    const formRef=useRef()
    const location=useLocation()
    // 单图
    const [single, setSingle] = useState<string | undefined>(undefined);
    // 多图
    const [singles, setSingles] = useState<string | undefined>(undefined);
    // 需要修改的id
    const [uid,setUid]=useState('')
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneProperties(id)
    },[])
    const getOneProperties=async (id:string)=>{
        let res=await propertiesServer.one(id)
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
            setSingle(res.Data.image)
            setSingles(res.Data.images)
        }
    }
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Properties/edit',
            payload:{
                ...values,uid,single,singles
            }
        })
        if (res.ErrorCode==0){
            message.success('修改成功');
            history.push('/appletManage/properties')
        }else {
            message.error(res.Data)
        }
    }
    // 单图
    const handleImageUpload = (val: string) => {
        setSingle(val); // 将base64字符串保存到状态中
    };
    // 多图
    const handleImageUploads=(val:string)=>{
        setSingles(val)
    }
    return(
        <div>
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
                    <CmpImageUploader onImageUpload={handleImageUpload}/>
                </Form.Item>
                <Form.Item label="多图">
                    <CmpImageUploader onImageUpload={handleImageUploads}/>
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
        </div>
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