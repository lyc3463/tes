import {Button, DatePicker, Form, Input, InputNumber, message, Select} from "antd";
import {connect} from "umi";
import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as StaffServer from "@/services/staff";
import dayjs from "dayjs";

const ContracteInfo=(props:any)=>{
    const formRef=useRef();
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getOneStaff(id);
        filterAndUpdateList(props.CheckCompanyList, 'custom_name', 'id', setKehuList);
        filterAndUpdateList(props.UnitList, 'unit_name', 'id', setUnitList);
    }, []);
    const getOneStaff= (id:string)=>{
        StaffServer.one(id).then((res:any)=>{
            if (res.ErrorCode==0){
                console.log(res)
                setEndDate(dayjs(res.Data.eendtime).format('YYYY-MM-DD'));
                setStartDate(dayjs(res.Data.estarttime).format('YYYY-MM-DD'));
                formRef.current.setFieldsValue(res.Data);
            }else {
                message.error(res.Data)
            }
        });
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
                <Form.Item label='日期'>
                    {startDate&&endDate? <DatePicker.RangePicker defaultValue={[dayjs(startDate), dayjs(endDate)]}/>:''}
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
export default  connect(mapStateToProps)(ContracteInfo)