import {connect,history} from 'umi'
import {Button, Form, Input, InputNumber, message, Select} from "antd";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCable=(props:any)=>{
    const [form] = Form.useForm();
    // 采集器列表
    const [collectorList,setCollectorList]=useState([])
    // 价格列表
    const [cable,setCable]=useState([])
    // 采集器编号
    const [collectorid,setCollectorNuber]=useState('')

    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Cable/add',
            payload:{...values,collectorid}
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/waterCableManage/cable')
        }else {
            message.error(res.Data);
        }
    };
    useEffect(() => {
        filterAndUpdateList(props.CollectorList, 'collectorid', 'id', setCollectorList);
        filterAndUpdateList(props.CableParameterList, 'price_name', 'id', setCable);
        console.log('props',props)
    }, []);
    const ChangeOps=(e)=>{
        const selectedItem = collectorList.find(item => item.value === e);
        setCollectorNuber(selectedItem.label)
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='电表地址' name='address'>
                    <Input placeholder='标号/表地址'/>
                </Form.Item>
                <Form.Item label='采集器id' name='cid'>
                    <Select onChange={ChangeOps}>
                        {collectorList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
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
                <Form.Item label='电表类型' name='electricity_type'>
                    <Select options={[
                        {label:'单相单费率07抄表',value:'65361'},
                        {label:'三相单费率07抄表',value:'65362'}
                    ]}>
                    </Select>
                </Form.Item>
                <Form.Item label='倍率' name='rate'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='电表备注' name='remark'>
                    <Input placeholder='电表备注(不能为空)'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CollectorList: state.Collector.list,
        CableParameterList: state.CableParameter.list,

    }
};
export default connect(mapStateToProps) (AddCable)