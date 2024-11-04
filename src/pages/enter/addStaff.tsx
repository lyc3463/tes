import {Button, Form, Pagination, Table, Modal, Select, DatePicker, Input, InputNumber, message} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const ops= [
    {
        value: '3',
        label: '诚意合同',
    },
    {
        value: '2',
        label: '定金合同',
    },
    {
        value: '1',
        label: '正式合同',
    }
]
interface FormItemType {
    type: 'rental' | 'freePeriod' | 'increment' | string;
    key: string;

}
const AddStaff=(props:any)=>{
    const [form] = Form.useForm();
    const [formItems, setFormItems] = useState([{ key: 1, startDate: null, freePeriod: null, increment: null }]); // 初始状态，可以包含默认项

    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');


    // 删除表单项
    const removeFormItemByKey = key => {
        setFormItems(prevItems => prevItems.filter(item => item.key !== key));
    };

    const onFinish= (values)=>{
      let jsonDate= JSON.stringify(formItems.map(item => ({
            key: item.key,
            qizuStartDate: item.startDate ? item.startDate[0].toISOString().split('T')[0] : '',
            qizuEndDate: item.startDate ? item.startDate[1].toISOString().split('T')[0] : '',
            mianzuStartDate: item.freePeriod ? item.freePeriod[0].toISOString().split('T')[0] : '',
            mianzuEndDate: item.freePeriod ? item.freePeriod[1].toISOString().split('T')[0] : '',
            dizneg: item.increment,
        })), null, 2)
        console.log(formItems)
        props.dispatch({
            type:'Staff/add',
            payload:{...values,endDate,startDate,jsonDate}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/enter/staff');
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        filterAndUpdateList(props.CheckCompanyList, 'custom_name', 'id', setKehuList);
        filterAndUpdateList(props.UnitList, 'unit_name', 'id', setUnitList);
    }, []);
    const changeData=(_,item)=>{
        setStartDate(item[0]);
        setEndDate(item[1]);
    };
    // 更新表单项
    const updateFormItem = (key, fieldName, value) => {
        setFormItems(prevItems =>
            prevItems.map(item =>
                item.key === key ? { ...item, [fieldName]: value } : item
            )
        );
    };
    // 添加新表单项
    const addFormItem = () => {
        const newKey = formItems.length ? Math.max(...formItems.map(item => item.key)) + 1 : 1;
        setFormItems([...formItems, { key: newKey, startDate: null, freePeriod: null, increment: null }]);
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
                <Form.Item label='合同编号' name='identifier'>
                    <Input/>
                </Form.Item>
                <Form.Item label='客户' name='clientId'>
                    <Select>
                        {kehuList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='身份证' name='customCard'>
                    <Input/>
                </Form.Item>
                <Form.Item label='单元' name='unit_id'>
                    <Select placeholder='单元'>
                        {unitList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='租金' name='zuMoney'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='管理费(元)' name='manageFee'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='押金' name='deposit' >
                    <InputNumber/>
                </Form.Item>
                {/*<Form.Item label='递增' >*/}
                {/*    <Input/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label='日期'>*/}
                {/*    <DatePicker.RangePicker onChange={changeData}/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label='选择合同'>*/}
                {/*    <Select options={ops} onChange={onSelect}/>*/}
                {/*</Form.Item>*/}

                {formItems.map(item => (
                    <div style={{ display: 'flex', marginBottom: '16px' }} key={item.key}>
                        <Form.Item label="起租日" key={`start-date-${item.key}`}>
                            <DatePicker.RangePicker
                                value={item.startDate}
                                onChange={(dates) => updateFormItem(item.key, 'startDate', dates)}
                            />
                        </Form.Item>
                        <Form.Item label="免租期" key={`free-period-${item.key}`}>
                            <DatePicker.RangePicker
                                value={item.freePeriod}
                                onChange={(dates) => updateFormItem(item.key, 'freePeriod', dates)}
                            />
                        </Form.Item>
                        <Form.Item label="递增" key={`increment-${item.key}`}>
                            <InputNumber
                                value={item.increment}
                                onChange={(value) => updateFormItem(item.key, 'increment', value)}
                            />
                        </Form.Item>
                        <Form.Item key={`delete-button-${item.key}`}>
                            <Button onClick={() => removeFormItemByKey(item.key)} type="link" style={{ marginLeft: 'auto' }}>
                                删除
                            </Button>
                        </Form.Item>
                    </div>
                ))}
                <Button type="primary" onClick={addFormItem} style={{ marginTop: '16px' }}>
                    新增
                </Button>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        录入合同
                    </Button>
                </Form.Item>
            </Form>
            <pre></pre>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckCompanyList: state.CheckCompany.list,
        UnitList: state.Unit.list,
    }
};
export default connect(mapStateToProps) (AddStaff)