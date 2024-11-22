import {Button, Form, Pagination, Table, Modal, Select, DatePicker, Input, InputNumber, message} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
const tailLayout = {
    wrapperCol: { offset: 3 },
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
    const [formItems, setFormItems] = useState([{ key: 1, beginTime: null, endTime: null, rentBeginTime: null,rentEndTime:null,incremental:0}]);
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
        let jsonDate=JSON.stringify(formItems);
        props.dispatch({
            type:'Staff/add',
            payload:{...values,endDate,startDate,jsonDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/enter/staff');
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        filterAndUpdateList(props.CheckCompanyList, 'custom_name', 'id', setKehuList);
        getUnitList();
        getCheckCompanyList();
    }, []);
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
    const handleSearch = (value:any) =>{
        props.dispatch({
            type: 'CheckCompany/fetch',
            payload: {page: 1, name:value, startDate: '2000-01-01', endDate: '2099-01-01'}
        })
    };
    // 获取单元列表
    const getUnitList=()=>{
        props.dispatch({
            type:'Unit/fetch'
        })
    };
    // 获取客户列表
    const getCheckCompanyList=()=>{
        props.dispatch({
            type:'CheckCompany/fetch'
        })
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
                    <Select showSearch  onSearch={handleSearch}>
                        {props.CheckCompanyList?props.CheckCompanyList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.custom_name}
                                </Select.Option>
                            )
                        }):""
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='身份证' name='customCard'>
                    <Input/>
                </Form.Item>
                <Form.Item label='单元' name='unit_id'>
                    <Select placeholder='单元'>
                        {props.UnitList?props.UnitList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.unit_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='起租日'>
                    <DatePicker.RangePicker onChange={changeData}/>
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