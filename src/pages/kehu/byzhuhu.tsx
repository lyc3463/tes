import {useEffect, useRef, useState} from "react";
import * as ZuhuServer from "@/services/zuhu";
import dayjs from "dayjs";
import {connect,history} from "umi";
import {Button, DatePicker, Form, Input, InputNumber, Select, Radio, message, Spin} from "antd";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Byzhuhu=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    const [isSpinning,setIsSpinning]=useState(false);
    const [unit_idz,setUnit_id]=useState([]);
    const [electricity_idz,setElectricity_id]=useState([]);
    const [water_idz,setWater_id]=useState([]);
    const [item_idz,setItem_idz]=useState([]);
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data[0])
            setUnit_id(data[1]);
            setElectricity_id(data[2]);
            setWater_id(data[3]);
            let newArr=data[4].map((item:any)=>{
                return item.id
            });
            if (newArr.length<1){
                setItem_idz([0]);
            }else {
                setItem_idz(newArr);
            }
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id);
    },[]);
    const onFinish=(valus:any)=>{
        let unit_id=unit_idz.join('|');
        let water_id=water_idz.join('|');
        let electricity_id=electricity_idz.join('|');
        let item_id=item_idz.join('|');
        setIsSpinning(true);
        props.dispatch({
            type:'Zuhu/byzhuhu',
            payload:{...valus,uid,unit_id,water_id,electricity_id,item_id}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('绑定成功');
                history.push('/kehu/zuhuguanlian');
                setIsSpinning(false);
            }else {
                setIsSpinning(false);
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getUnitList();
        getWatertList();
        getCableList();
        getGongsiList();
        getAppUserList();
    }, []);
    // 获取水表列表
    const getWatertList=()=>{
        props.dispatch({
            type:'Watert/fetch'
        })
    };
    // 获取电表列表
    const getCableList=()=>{
        props.dispatch({
            type:'Cable/fetch'
        })
    };
    // 获取小程序用户列表
    const getAppUserList=()=>{
        props.dispatch({
            type:'AppUser/fetch'
        })
    };
    // 获取收费项目列表
    const getGongsiList=()=>{
        props.dispatch({
            type:'Gongsi/fetch'
        })
    };
    // 获取单元列表
    const getUnitList=()=>{
        props.dispatch({
            type:'Unit/fetch'
        })
    };
    const changeEle=(e)=>{
        if (e.includes(0)){
            setElectricity_id([0]);
        }else {
            setElectricity_id(e);
        }
    };
    const changeUint=(e)=>{
        if (e.includes(0)){
            setUnit_id([0]);
        }else {
            setUnit_id(e);
        }
    };
    const changeWater=(e)=>{
        if (e.includes(0)){
            setWater_id([0]);
        }else {
            setWater_id(e);
        }
    };
    const changeitem=(e)=>{
        if (e.includes(0)){
            setItem_idz([0]);
        }else {
            setItem_idz(e);
        }
    };
    return(
        <Spin spinning={isSpinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='单元'>
                    <Select  mode="multiple" value={unit_idz} onChange={changeUint}>
                        <Select.Option value={0} key="no-unit-associated">
                            暂不关联
                        </Select.Option>
                        {props.UnitList?props.UnitList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.unit_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='电表' >
                    <Select mode="multiple" value={electricity_idz} onChange={changeEle}>
                        <Select.Option value={0} key="no-unit-associated">
                            暂不关联
                        </Select.Option>
                        {props.CableList?props.CableList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={item.id}>
                                    {item.remark}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='水表'>
                    <Select mode="multiple" value={water_idz} onChange={changeWater}>
                        <Select.Option value={0} key="no-unit-associated">
                            暂不关联
                        </Select.Option>
                        {props.WatertList?props.WatertList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={item.id}>
                                    {item.remark}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='小程序用户' name='open_id'>
                    <Select>
                        {props.AppUserList?props.AppUserList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.openId} key={item.id}>
                                    {item.appUser_phone}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='收费项目' >
                    <Select  mode="multiple" value={item_idz} onChange={changeitem}>
                        <Select.Option value={0} key="no-unit-associated">
                            暂不关联
                        </Select.Option>
                        {props.GongsiList?props.GongsiList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.item_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='预留金额' name='reserved_amount'>
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label='警告金额' name='warn_amount'>
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label='最低充值' name='minimum_recharge'>
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label='是否自动扣款' name='is_deduction'>
                   <Radio.Group>
                       <Radio value={1}>是</Radio>
                       <Radio value={0}>否</Radio>
                   </Radio.Group>
                </Form.Item>
                <Form.Item label='备注' name='reamrk'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定关联
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list,
        UnitList: state.Unit.list,
        GongsiList: state.Gongsi.list,
        WatertList: state.Watert.list,
        CableList: state.Cable.list
    }
};
export default connect(mapStateToProps) (Byzhuhu)