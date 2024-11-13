import {useEffect, useRef, useState} from "react";
import * as ZuhuServer from "@/services/zuhu";
import dayjs from "dayjs";
import {connect,history} from "umi";
import {Button, DatePicker, Form, Input, InputNumber, Select, Radio, message} from "antd";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const Byzhuhu=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const formRef=useRef();
    // 小程序列表
    const [appUserList,setAppUserList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 收费项目列表
    const [itemList,setItemList]=useState([]);
    // 水表
    const [watertList,setWatertList]=useState([]);
    // 电表
    const [cableList,setCableList]=useState([]);
    const getOneCustom=async (id:string)=>{
        let res:any=await  ZuhuServer.one(id);
        if (res.ErrorCode==0){
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            console.log('data',data);
        }else {
            message.error(res.Data)
        }
    };
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCustom(id);
    },[]);
    const onFinish=(valus:any)=>{
        valus.water_id?valus.water_id:valus.water_id=0;
        console.log(valus);
        props.dispatch({
            type:'Zuhu/byzhuhu',
            payload:{...valus,uid}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('绑定成功');
                history.push('/kehu/zuhuguanlian')
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        filterAndUpdateList(props.AppUserList, 'appUser_phone', 'openId', setAppUserList);
        filterAndUpdateList(props.UnitList, 'unit_name', 'id', setUnitList);
        filterAndUpdateList(props.GongsiList, 'item_name', 'id', setItemList);
        filterAndUpdateList(props.CableList, 'remark', 'id', setCableList);
        filterAndUpdateList(props.WatertList, 'remark', 'id', setWatertList);
    }, []);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='单元' name='unit_id'>
                    <Select>
                        {unitList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='电表' name='electricity_id'>
                    <Select>
                        {cableList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='水表' name='water_id'>
                    <Select>
                        {watertList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='小程序用户' name='open_id'>
                    <Select>
                        {appUserList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='收费项目' name='item_id'>
                    <Select>
                        {itemList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
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
        </div>
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