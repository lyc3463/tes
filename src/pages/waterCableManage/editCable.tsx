import {connect,useLocation,history} from 'umi'
import {Button, Form, Input, InputNumber, message, Radio, Select} from "antd";
import {useEffect, useRef, useState} from "react";
import * as CableServer from "@/services/cable";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditCable=(props:any)=>{
    const location=useLocation();
    const formRef =useRef();
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    // 采集器列表
    const [collectorList,setCollectorList]=useState([]);
    // 价格列表
    const [cable,setCable]=useState([])
    const onFinish=async (values)=>{
        let res=await props.dispatch({
            type:'Cable/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            history.push('/waterCableManage/cable')
            message.success('修改成功')
        }else {
            message.error(res.Data)
        }
    };
    // 获取单个电表信息详情
    const getOneCable=async (id:string)=>{
        let res=await  CableServer.one(id);
        if (res?.ErrorCode==0){
            console.log(res)
            formRef.current.setFieldsValue(res?.Data)
        }else {
            message.error(res.Data);
        }
    };

    useEffect(()=>{
        filterAndUpdateList(props.CollectorList, 'collectorid', 'id', setCollectorList);
        filterAndUpdateList(props.CableParameterList, 'price_name', 'id', setCable);
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
        getOneCable(id)
    },[]);
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
                <Form.Item label='电表地址' name='address'>
                    <Input placeholder='标号/表地址'/>
                </Form.Item>
                <Form.Item label='采集器id' name='collectorid'>
                    <Select>
                        {collectorList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='电表类型' name='electricity_type'>
                    <Select options={[
                        {label:'单相单费率07抄表',value:'65361'},
                        // {label:'三相单费率07抄表',value:'65362'}
                    ]}>
                    </Select>
                </Form.Item>
                <Form.Item label='倍率' name='rate'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='选择价格' name='priceid'>
                    <Select>
                        {cable.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='电表备注' name='remark'>
                    <Input placeholder='电表备注(不能为空)'/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableParameterList: state.CableParameter.list,
        CollectorList: state.Collector.list
    }
};
export default connect(mapStateToProps) (EditCable)