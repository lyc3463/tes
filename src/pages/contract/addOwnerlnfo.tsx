import {Button, Form, Pagination, Table, Modal, Select, DatePicker, Input, InputNumber, message,Spin} from "antd";
import {useState} from "react";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const AddOwnerlnfo=(props)=>{
    const [isSpinning,setIsSpinning]=useState(false);
    const [form] = Form.useForm();
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    const [formItems, setFormItems] = useState([{ key: 1, beginTime: null, endTime: null, rentBeginTime: null,rentEndTime:null,incremental:0}]);
    const onFinish= (values)=>{
        let jsonDate=JSON.stringify(formItems);
        props.dispatch({
            type:'Ownerlnfo/add',
            payload:{...values,endDate,startDate,jsonDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/contract/ownerInfo');
            }else {
                message.error(res.Data);
            }
        })
    };
    const changeData=(_,item)=>{
        setStartDate(item[0]);
        setEndDate(item[1]);
    };
        // 更新起租日
    const updateqizuDate = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 更新免租期
    const updatemz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
     // 更新递增
    const updatedz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 添加新表单项
    const addFormItem = () => {
        const newKey = formItems.length ? Math.max(...formItems.map(item => item.key)) + 1 : 1;
        setFormItems([...formItems, { key: newKey, beginTime: null, endTime: null, rentBeginTime: null,rentEndTime:null, incremental:0}]);
    };
    const removeFormItemByKey = key => {
        setFormItems(prevItems => prevItems.filter(item => item.key !== key));
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
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='合同编号' name='identifier'>
                    <Input/>
                </Form.Item>
                <Form.Item label='租户名称' name='tenantName'>
                    <Input/>
                </Form.Item>
                 <Form.Item label='甲方名称' name='ownerName'>
                    <Input/>
                </Form.Item>
                <Form.Item label='起租日'>
                    <DatePicker.RangePicker onChange={changeData}/>
                </Form.Item>
                <Form.Item label='租金' name='zuMoney'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='押金' name='deposit' >
                    <InputNumber/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    {formItems.map((item:any,index:number) => (

                        <div style={{ display: 'flex'}} key={item.key}>
                            <Form.Item label="起租日">
                                <DatePicker.RangePicker
                                    onChange={(dates,data) => updateqizuDate(item.key,{beginTime: data[0], endTime: data[1]})}
                                />
                            </Form.Item>
                            <Form.Item label="免租期" >
                                <DatePicker.RangePicker
                                    onChange={(dates,data) => updatemz(item.key,{rentBeginTime: data[0], rentEndTime: data[1]})}
                                />
                            </Form.Item>
                            <Form.Item label="递增" >
                                <InputNumber
                                    value={item.incremental}
                                    onChange={(value) => updatedz(item.key,{incremental:value})}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => removeFormItemByKey(item.key)} type="link" style={{ marginLeft: 'auto' }}>
                                    删除
                                </Button>
                            </Form.Item>
                        </div>

                    ))}
                    <Button type="primary" onClick={addFormItem} style={{ marginTop: '16px' }}>
                        新增
                    </Button>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        录入合同
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddOwnerlnfo)