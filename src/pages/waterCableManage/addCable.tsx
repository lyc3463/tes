import {connect,history,useNavigate} from 'umi'
import {Button, Form, Input, InputNumber, message, Select, Space, Spin, Tag} from "antd";
import {useEffect, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as CollectorService from '@/services/collector';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddCable=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 采集器列表
    const [collectorList,setCollectorList]=useState([])
    // 价格列表
    const [cable,setCable]=useState([])
    // 采集器编号
    const [collectorid,setCollectorNuber]=useState('')
    const [spinning,setspinning]=useState(false);
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [priceType,setPriceType]=useState(0);
    // 1水价 2电价 0全部
    const [we_type,setwe_type]=useState(2);
    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'Cable/add',
            payload:{...values,collectorid}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功')
            history.push('/waterCableManage/cable')
        }
        else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    useEffect(() => {
        getPriceList();
        getCollectorList();
    }, []);
    const ChangeOps=(e)=>{
        const selectedItem = collectorList.find(item => item.id === e);
        setCollectorNuber(selectedItem.collectorid)
    };
    // 采集器列表
    const getCollectorList=()=>{
        CollectorService.fetchCtr().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCollectorList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
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
                form={form}
                layout="horizontal"
                size={'large'}
                initialValues={{rate:1}}
                onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='电表地址' name='address'>
                    <Input placeholder='标号/表地址'/>
                </Form.Item>
                <Form.Item label='采集器id' name='cid'>
                    <Select
                        onChange={ChangeOps}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = collectorList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.remark?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {collectorList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.collectorid}-{item.remark}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='选择价格' name='priceid'>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = cable.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.price_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
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
                <Form.Item label='电表类型' name='electricity_type'>
                    <Select options={[
                        // {label:'单相单费率2020Z款远程预付费',value:'16225'},
                        // {label:'三相单费率2020Z款远程预付费',value:'16226'},
                        {label:'单相单费率07抄表',value:'65361'},
                        {label:'三相单费率07抄表',value:'65362'}
                    ]}>
                    </Select>
                </Form.Item>
                <Form.Item label='倍率' name='rate' rules={[{required: true, message: '必须填表备注'}]}>
                    <InputNumber min={1}/>
                </Form.Item>
                <Form.Item label='电表描述' name='remark' rules={[{required: true, message: '必须填表描述'}]}>
                    <Input placeholder='电表描述(不能为空)'/>
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
        CollectorList: state.Collector.list,
        CableParameterList: state.CableParameter.list,

    }
};
export default connect(mapStateToProps) (AddCable)