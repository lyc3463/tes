import {connect,useLocation,history} from 'umi'
import {Button, Form, Input, InputNumber, message, Radio, Select, Spin, Tag} from "antd";
import {useEffect, useRef, useState} from "react";
import * as CableServer from "@/services/cable";
import {filterAndUpdateList} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
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
    const [cable,setCable]=useState([]);
    const [spinning,setspinning]=useState(false);
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [priceType,setPriceType]=useState(0);
    // 1水价 2电价 0全部
    const [we_type,setwe_type]=useState(2);
    const onFinish=async (values)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Cable/edit',
            payload:{...values,uid}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            history.push('/waterCableManage/cable');
            message.success('修改成功');
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    // 获取单个电表信息详情
    const getOneCable=async (id:string)=>{
        let res=await  CableServer.one(id);
        if (res?.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data)
        }else {
            message.error(res.Data);
        }
    };
    useEffect(()=>{
        // filterAndUpdateList(props.CollectorList, 'collectorid', 'id', setCollectorList);
        // filterAndUpdateList(props.CableParameterList, 'price_name', 'id', setCable);
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCable(id);
        getPriceList()
    },[]);
    // 价格列表
    const getPriceList=()=>{
        props.dispatch({
            type:'CableParameter/fetch',
            payload:{cname,priceType,we_type}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCable(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                initialValues={{rate:1}}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='电表地址' name='address'>
                    <Input placeholder='标号/表地址' disabled/>
                </Form.Item>
                <Form.Item label='采集器id' name='collectorid'>
                    <Select disabled>
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
                    <Select disabled options={[
                        {label:'单相单费率2020Z款远程预付费',value:'16225'},
                        {label:'三相单费率2020Z款远程预付费',value:'16226'},
                        {label:'单相单费率07抄表',value:'65361'},
                        {label:'三相单费率07抄表',value:'65362'}
                    ]}>
                    </Select>
                </Form.Item>
                <Form.Item label='倍率' name='rate'  rules={[{required: true, message: '必填'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='选择价格' name='priceid'>
                    <Select>
                        {cable.map((item:any,index:any)=>{
                            let displayText;
                            switch (item.price_type) {
                                case 1:
                                    displayText = <Tag color='green'>水价</Tag>;
                                    break;
                                case 2:
                                    displayText =  <Tag color='lime'>阶梯水价</Tag>;
                                    break;
                                case 3:
                                    displayText = <Tag color='cyan'>单费率电价</Tag>;
                                    break;
                                case 4:
                                    displayText = <Tag color='red'>多费率电价</Tag>;
                                    break;
                                case 5:
                                    displayText = <Tag color='blue'>阶梯电价</Tag>;
                                    break;
                                default:
                                    displayText = item || <Tag color='red'>未知类型</Tag>;
                            }
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.price_name}-{displayText}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='电表备注' name='remark'   rules={[{required: true, message: '必须填表备注'}]}>
                    <Input placeholder='电表备注(不能为空)'/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        编辑
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableParameterList: state.CableParameter.list,
        CollectorList: state.Collector.list
    }
};
export default connect(mapStateToProps) (EditCable)