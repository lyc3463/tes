import {connect,useLocation,history,useNavigate} from 'umi';
import * as HouseServer from "@/services/house";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, message, Space, Spin} from "antd";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditHouse=(props:any)=>{
    const navigate=useNavigate();
    const location=useLocation()
    const [isLoading,setIsLoading]=useState(false);
    const [form] = Form.useForm();
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 可租面积
    const [rentable_area,setrentable_area]=useState(0);
    // 原可租面积
    const [oldrentable_area,setoldrentable_area]=useState(0);
    // 剩余可租面积
    const [residue_add_area,setresidue_add_area]=useState(0);
    // 原剩余可增加面积
    const [oldresidue_add_area,setoldresidue_add_area]=useState(0);
    // 不能低于租金
    const [noRents,setnoRents]=useState(0);
    // 单价
    const [price,setprice]=useState(0);
    // 获取单个房屋详情
    const getOneBanner=async (id:string)=>{
        let res:any=await  HouseServer.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
            setrentable_area(res.Data.rentable_area);
            setoldrentable_area(res.Data.rentable_area);
            setresidue_add_area(res.Data.residue_add_area);
            setoldresidue_add_area(res.Data.residue_add_area);
            setprice(res.Data.price);
        }else {
            message.error(res.Data);
        }
    };
    // 编辑提交
    const onFinish=async (values:any)=>{
        setIsLoading(true);
        let res=await props.dispatch({
            type:'House/edit',
            payload:{...values,uid,rentable_area,residue_add_area,price}
        })
        if (res.ErrorCode==0){
            setIsLoading(false);
            message.success('修改成功');
            history.push('/houseManage/houseList');
        }else {
            message.error(res.Data);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneBanner(id)
    }, []);
    const changeRentableArea=(e)=>{
        setrentable_area(e);
    };
    const hdblur=()=>{
        let sumadd_area :number=oldresidue_add_area+(rentable_area-oldrentable_area);
        if (sumadd_area<0){
            message.error('剩余可增加面积低于0');
            setrentable_area(oldrentable_area);
            setresidue_add_area(oldresidue_add_area);
        }else {
            setresidue_add_area(+sumadd_area);
        }
    };
    useEffect(() => {
        setnoRents(rentable_area*price);
    }, [rentable_area,price]);
    // 监听单价
    const changeprice=(e)=>{
        setprice(e);
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
                ref={formRef}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='房屋名称' name='house_name' rules={[{required: true, message: '请填写房屋名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area' rules={[{required: true, message: '请填写建筑面积'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡'>
                    <InputNumber value={rentable_area} onBlur={(val)=>hdblur(val)} onChange={changeRentableArea}/>
                </Form.Item>
                <Form.Item label='单价/(元)'>
                    <InputNumber value={price} onChange={changeprice}/>
                </Form.Item>
                <Form.Item label='总租金/(元)' name='rents' rules={[
                    { required: true, message: '请填写总租金' },
                    {
                        validator: (_, value) => {
                            if (value < noRents) {
                                return Promise.reject(`不能低于 ${noRents}元`);
                            }
                            return Promise.resolve();
                        },
                    },
                ]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='注意'>
                    <span style={{fontSize:'12px',color:'#555'}}>总租金不能低于{noRents}元=单价*可租面积</span>
                </Form.Item>
                <Form.Item label='详细地址' name='address' rules={[{required: true, message: '请填写详细地址'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='总楼层/(层)' name='floors' rules={[{required: true, message: '请填写总楼层'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='剩余可增加面积㎡'>
                    <InputNumber value={residue_add_area} disabled/>
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
export default connect()(EditHouse)