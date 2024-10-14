import {connect,history} from 'umi'
import {Button, Form, Input, message, Select} from "antd";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddWater=(props:any)=>{
    const [form] = Form.useForm();
    // 采集器列表
    const [collectorList,setCollectorList]=useState([]);
    // 价格列表
    const [cable,setCable]=useState([]);
    // 采集器编号
    const [collectorid,setCollectorNuber]=useState('');
    const onFinish=async (values:any)=>{
        let res=await props.dispatch({
            type:'Watert/add',
            payload:values
        })
        if (res.ErrorCode==0){
            message.success('添加成功')
            history.push('/waterCableManage/water')
        }else {
            message.error(res.Data)
        }
    };
    const ChangeOps=(e)=>{
        const selectedItem = collectorList.find(item => item.value === e);
        setCollectorNuber(selectedItem.label)
    };
    useEffect(() => {
        filterAndUpdateList(props.CollectorList, 'collectorid', 'id', setCollectorList);
        filterAndUpdateList(props.CableParameterList, 'price_name', 'id', setCable);
    }, []);
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='水表地址/表号' name='biaohao'>
                    <Input placeholder='表号/表地址'/>
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
                <Form.Item label='水表类型' name='type'>
                    <Select/>
                </Form.Item>
                <Form.Item label='水表备注' name='remarks'>
                    <Input placeholder='水表备注(不能为空)'/>
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
export default connect(mapStateToProps) (AddWater)