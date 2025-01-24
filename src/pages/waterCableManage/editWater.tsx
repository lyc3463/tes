import {connect,useLocation,history} from 'umi'
import {Button, Form, Input, InputNumber, message, Radio, Select, Spin, Tag} from "antd";
import {useEffect, useRef, useState} from "react";
import * as WatertServer from "@/services/watert";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditWater=(props)=>{
    const formRef =useRef();
    const [form] = Form.useForm();
    const [isSpinning,setIsSpinning]=useState(false);
    const [uid,setUid]=useState('');
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [priceType,setPriceType]=useState(0);
    // 1水价 2电价 0全部
    const [we_type,setwe_type]=useState(1);
    // 获取单个水表信息详情
    const getOneCable=async (id:string)=>{
        let res:any=await  WatertServer.one(id);
        if (res.ErrorCode==0){
            formRef.current.setFieldsValue(res?.Data);
        }else {
            message.error(res.Data);
        }
    };
    const onFinish=async (values)=>{
        setIsSpinning(true);
        props.dispatch({
            type:'Watert/edit',
            payload:{...values,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setIsSpinning(false);
                history.push('/waterCableManage/water');
                message.success('修改成功');
            }else {
                message.error(res.Data);
                setIsSpinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneCable(id);
        getCableParameterList();
        getCollectorList();
    }, []);
    // 获取采集器列表
    const getCollectorList=()=>{
      props.dispatch({
          type:'Collector/fetch'
      })
    };
    // 获取价格列表
    const getCableParameterList=()=>{
      props.dispatch({
          type:'CableParameter/fetch',
          payload:{cname,priceType,we_type}
      })
    };
    return(
        <Spin spinning={isSpinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                ref={formRef}
                initialValues={{remark:'',rate:1}}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='水表地址/表号' name='address'>
                    <Input placeholder='表号/表地址' disabled/>
                </Form.Item>
                <Form.Item label='采集器id' name='cid'>
                    <Select disabled>
                        {props.CollectorList?props.CollectorList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.collectorid}-{item.remark}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='水表类型' name='water_type'>
                    <Select disabled options={[
                        {label:'无线无预付',value:'13301'}
                    ]}/>
                </Form.Item>
                <Form.Item label='选择价格' name='priceid'>
                    <Select>
                        {props.CableParameterList?props.CableParameterList.map((item:any,index:any)=>{
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
                        }):''}
                    </Select>
                </Form.Item>
                {/*<Form.Item label='倍率' name='rate'>*/}
                {/*    <InputNumber/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='水表备注' name='remark' rules={[{required: true, message: '必须填表备注'}]}>
                    <Input placeholder='水表备注(不能为空)' />
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
export default connect(mapStateToProps) (EditWater)