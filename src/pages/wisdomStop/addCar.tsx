import {connect, useNavigate,history} from "umi";
import {Form, Input, Select, Radio, Image, Space, Button, message, Spin} from "antd";
import {useEffect, useState} from "react";
import CmpImageUploader from "@/components/ImageUploader";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCar=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [appId,setAppID]=useState(0);
    const [driversLicense,setDriversLicense]=useState('');// 驾驶证图片名字
    const [vehicleLicense,setVehicleLicense]=useState('');// 行驶证图片名字
    const [driversLicenseBase64,setDriversLicenseBase64]=useState('');// 驾驶证base64
    const [vehicleLicenseBase64,setVehicleLicenseBase64]=useState('');// 行驶证base64
    const [carType,setCarType]=useState('');// 车辆类型
    const [carColor,setCarColor]=useState('');// 车辆颜色
    const [carNo,setCarNo]=useState('');// 车牌号
    const [spinning,setSpinning]=useState(false);// loading
    const [remark,setRemark]=useState('');// loading
    const onFinish=()=>{
        if (appId==0) return message.warning('请选择用户');
        if (carNo==='') return message.warning('请输入车牌号');
        if (carColor==='') return message.warning('请输入车辆颜色');
        if (carType==='') return message.warning('请输入车辆类型');
        setSpinning(true);
        props.dispatch({
            type:'UserCar/add',
            payload:{appId, carNo, carColor, carType, driversLicense, vehicleLicense,remark}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/wisdomStop/carManage/');
                setSpinning(false);
            }else {
                setSpinning(false);
                message.error(res.Data);
            }
        })
    };
    const getUserList=()=>{
        props.dispatch({
            type:'Users/fetch',
        })
    }
    // 选择用户
    const changeSelect=(e)=>{
        setAppID(e);
    };
    const changeColor=(e)=>{
        setCarColor(e.target.value);
    };
    const changeType=(e)=>{
        setCarType(e.target.value);
    };
    // 驾驶证图片名字
    const handleDriversLicenseUpload=(e)=>{
        setDriversLicense(e);
    };
    // 驾驶证base64
    const getImgDriversLicense=(val:string)=>{
        setDriversLicenseBase64(val);
    };
    // 行驶证图片名字
    const handleVehicleLicenseUpload=(e)=>{
        setVehicleLicense(e);
    };
    // 行驶证base64
    const getImgVehicleLicense=(val:string)=>{
        setVehicleLicenseBase64(val);
    };
    useEffect(() => {
        getUserList();
    }, []);
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='选择用户'>
                    <Select
                        style={{width:'100%'}}
                        onChange={changeSelect}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =props.UsersList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.user_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.user_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='车牌号'>
                    <Input placeholder='请输入车牌号' value={carNo} onChange={(e)=>setCarNo(e.target.value)}/>
                </Form.Item>
                <Form.Item label='备注'>
                    <Input placeholder='选填' value={remark} onChange={(e)=>setRemark(e.target.value)}/>
                </Form.Item>
                <Form.Item label='选择车辆颜色'>
                    <Radio.Group onChange={changeColor}>
                        <Radio value='BLUE'>蓝色</Radio>
                        <Radio value='GREEN'>绿色</Radio>
                        <Radio value='WHITE'>白色</Radio>
                        <Radio value='YELLOW'>黄色</Radio>
                        <Radio value='BLACK'>黑色</Radio>
                        <Radio value='UNKNOW'>其余颜色</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='车辆类型'>
                    <Radio.Group onChange={changeType}>
                        <Radio value='CAR'>小车</Radio>
                        <Radio value='LARGE'>大车</Radio>
                        <Radio value='EXTRA_LARGE'>超大车</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='驾驶证'>
                    <CmpImageUploader onImageUpload={handleDriversLicenseUpload} oldBase64={getImgDriversLicense}/>
                    {driversLicenseBase64?<Image src={driversLicenseBase64} style={{width:'80px',height:"80px"}}/>:''}
                </Form.Item>
                <Form.Item label='行驶证'>
                    <CmpImageUploader onImageUpload={handleVehicleLicenseUpload} oldBase64={getImgVehicleLicense}/>
                    {vehicleLicenseBase64?<Image src={vehicleLicenseBase64} style={{width:'80px',height:"80px"}}/>:''}
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary"  htmlType="submit">
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
const mapStateToProps = (state: any) => {
    return {
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (AddCar)