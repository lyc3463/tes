import {connect,useNavigate} from "umi";
import {Button, Form, Input, message, Select, Space, Spin} from "antd";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const WorkOrderAdd=(props)=>{
    const navigate=useNavigate();
    const [spinning,setSpinning]=useState(false);
    const [form] = Form.useForm();
    const [workGood,setWorkGood]=useState('');// 工单名称
    const [workMoney,setWorkMoney]=useState(0);// 工单金额
    const [workType,setWorkType]=useState(0);// 工单类型
    const [goodsList,setGoodsList]=useState([]);
    const onFinish=(values)=>{
        if (!workGood) return message.warning('请选择物品');
        setSpinning(true);
        props.dispatch({
            type:'WorkOrder/add',
            payload:{...values, workGood, workMoney, workType}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('添加成功');
                navigate('/workOrderManage/worlOrder/');
                setSpinning(false);
            }else {
                message.error(res.ErrorCode+res.Data);
                setSpinning(false);
            }
        })
    };
    const getGoodsList=()=>{
        props.dispatch({
            type:'Goods/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setGoodsList(res.Data);
            }else {
                message.error(res.ErrorCode+res.Data);
            }
        })
    };
    useEffect(() => {
        getGoodsList();
    }, []);
    const changeGoods=(e)=>{
        const selectedItem = goodsList.find(item => item.id === e);
        if (selectedItem) {
            // 可以在这里将物品信息设置到对应的state中
            setWorkGood(selectedItem.goodName);
            // 如果物品有金额字段，假设字段名为money
            setWorkMoney(selectedItem.goodMoney || 0);
            // 如果物品有类型字段，假设字段名为type
            setWorkType(selectedItem.goodType || 0);
        } else {
            // 清空已选信息
            setWorkGood('');
            setWorkMoney(0);
            setWorkType(0);
        }
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='选择物品'>
                    <Select
                        notFoundContent={false}
                        showSearch
                        onChange={changeGoods}
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = goodsList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.goodName?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {goodsList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.goodName}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='工单内容' name='workContent' rules={[{required: true, message: '请输入工单内容'}]}>
                    <Input.TextArea placeholder='工单内容'/>
                </Form.Item>
                <Form.Item  {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    );
}
const mapStateToProps = (state: any) => {
    return {
        GoodsList: state.Goods.list,
        count: state.Goods.count
    }
};
export default connect(mapStateToProps) (WorkOrderAdd);
