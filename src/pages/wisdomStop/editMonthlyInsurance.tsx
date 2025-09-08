import {useEffect, useState} from "react";
import {Button, Form, Input, message, Select, Spin} from "antd";
import * as UserCarServer from "@/services/userCar";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const EditMonthlyInsurance=(props)=>{
    const [list,setList]=useState([]);
    const [loading,setLoading]=useState(false);
    const [form] = Form.useForm();
    const [item,setItem]=useState([]);
    const [tcid,setTcid]=useState(''); // 套餐id
    const [parkServiceId,setParkServiceId]=useState(''); // 月卡园区id
    const [carNo,setCarNo]=useState('');// 车牌
    const [carType,setCarType]=useState('');// 车辆类型
    const [placeNum,setPlaceNum]=useState(0);// 车位号
    const [carColor,setCarColor]=useState('');// 车辆颜色
    const [carID,setCarID]=useState(0);// 车辆id
    useEffect(() => {
        // 数据加载完成后初始化表单
        if (props) {
            setParkServiceId(props.data[0].parkServiceList[0].parkServiceId);
            setPlaceNum(props.data[0].parkServiceList[0].placeNum);
            setCarNo(props.data[0].parkServiceList[0].carList[0].carNo);
            setCarColor(props.data[0].parkServiceList[0].carList[0].carNoColor);
            setCarType(props.data[0].parkServiceList[0].carList[0].carType);
            setCarID(0);
        }
    }, [props]);
    const getUserCarList=()=>{
        UserCarServer.fetch({page:1,carNo:'',name:'',stutes:2,pageSize:1000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getUserCarList();
    }, []);
    const onFinish=()=>{
        if (carID==0) return message.warning('请选择车辆');
        setLoading(true);
        UserCarServer.edityuebao(tcid,parkServiceId,placeNum,carID).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('变更成功');
                setLoading(false);
                props.onSuccess?.()
            }else {
                message.error(res.Data);
                setLoading(false);
            }
        })
    };
    return(
        <Spin spinning={loading}>
             <Form
                 form={form}
                 onFinish={onFinish}
             >
                 <Form.Item label='更换的车辆'>
                     <Select
                         placeholder="请选择车辆"
                         style={{ width: 300 }}
                         onChange={(value)=>{
                             setCarID(value);
                         }}
                     >
                         {list.map(carItem => (
                             <Select.Option key={carItem.id} value={carItem.id}>
                                 {carItem.carNo}
                             </Select.Option>
                         ))}
                     </Select>
                 </Form.Item>
                 <Form.Item label='车牌号'>
                     <Input value={carNo}/>
                 </Form.Item>
                 <Form.Item label='车辆颜色'>
                     {carColor === 'BLUE' && '蓝色'}
                     {carColor === 'GREEN' && '绿色'}
                     {carColor === 'WHITE' && '白色'}
                     {carColor === 'YELLOW' && '黄色'}
                     {carColor === 'BLACK' && '黑色'}
                 </Form.Item>
                 <Form.Item label='车辆类型'>
                     {carType === 'CAR' && '小车'}
                     {carType === 'LARGE' && '大车'}
                     {carType === 'EXTRA_LARGE' && '超大车'}
                 </Form.Item>
                 <Form.Item>
                     <Button type="primary" htmlType="submit">
                         提交
                     </Button>
                 </Form.Item>
             </Form>
        </Spin>
    )
}
export default EditMonthlyInsurance
