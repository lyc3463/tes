import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as StaffServer from "@/services/staff";
import {connect,history} from "umi";
import {Button, DatePicker, Form, Input, InputNumber, message, Select} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const ContracteInfo=(props:any)=>{
    const formRef=useRef();
    const [formItems, setFormItems] = useState([]);

    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    // 路由参数
    const [uid,setUid]=useState('');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneStaff(id);
        filterAndUpdateList(props.CheckCompanyList, 'custom_name', 'id', setKehuList);
        filterAndUpdateList(props.UnitList, 'unit_name', 'id', setUnitList);
    }, []);
    const getOneStaff= (id:string)=>{
        StaffServer.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                formRef.current.setFieldsValue(res.Data[0]);
                setEndDate(dayjs(res.Data[0].endTime).format('YYYY-MM-DD'));
                setStartDate(dayjs(res.Data[0].beginTime).format('YYYY-MM-DD'));
                setFormItems(res.Data[1]);
            }else {
                message.error(res.Data);
            }
        });
    };

    // 获取当前时间
    const getCurrentDate=()=>{
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
    };
    // 更新起租日
    const updateqizuDate = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };
    // 更新免租期
    const updatemz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };
    // 更新递增
    const updatedz = (key, updates) => {
        console.log(updates)
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };

    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}

                layout="horizontal"
                size={'large'}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='合同编号' name='identifier'>
                    <Input/>
                </Form.Item>
                <Form.Item label='日期'>
                    {startDate&&endDate? <DatePicker.RangePicker defaultValue={[dayjs(startDate), dayjs(endDate)]}/>:''}
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
                <Form.Item label='合同类型' name='contractType'>
                    <Select>
                        <Select.Option value={1}>
                            定金合同
                        </Select.Option>
                        <Select.Option value={2}>
                            正式合同
                        </Select.Option>
                    </Select>
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
                <Form.Item {...tailLayout}>
                    {formItems.map((item:any,index:number) => (
                        <div style={{ display: 'flex'}} key={item.id}>
                            <Form.Item label="起租日">
                                <DatePicker.RangePicker
                                    defaultValue={[dayjs(item.beginTime), dayjs(item.endTime)]}
                                    onChange={(dates,data) => updateqizuDate(item.id,{beginTime: data[0], endTime: data[1]})}
                                />
                            </Form.Item>
                            <Form.Item label="免租期" >
                                <DatePicker.RangePicker
                                    defaultValue={[dayjs(item.rentBeginTime), dayjs(item.rentEndTime)]}
                                    onChange={(dates,data) => updatemz(item.id,{rentBeginTime: data[0], rentEndTime: data[1]})}
                                />
                            </Form.Item>
                            <Form.Item label="递增">
                                <InputNumber
                                    value={item.incremental}
                                    onChange={(value) => updatedz(item.id,{incremental:value})}
                                />
                            </Form.Item>
                        </div>

                    ))}

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
export default  connect(mapStateToProps) (ContracteInfo)