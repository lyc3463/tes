import {connect,history} from "umi";
import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as StaffServer from "@/services/staff";
import {Button, DatePicker, Form, Image, Input, InputNumber, message, Select, Space} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const EditDjContract=(props:any)=>{
    const formRef=useRef();
    // 路由参数
    const [uid,setUid]=useState('');
    // 签订日期
    const [dayDate,setDayDate]=useState('');
    const [contractTypeid,setcontractTypeid]=useState(0);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneStaff(id);
        getUnitList();
        getCheckCompanyList();
    }, []);
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
    const getOneStaff= (id:string)=>{
        StaffServer.onedj(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                formRef.current.setFieldsValue(res.Data);
                setDayDate(dayjs(res.Data.beginTime).format("YYYY-MM-DD"));
                setcontractTypeid(res.Data.contractType);
            }else {
                message.error(res.Data)
            }
        })
    };
    const onFinish=(val:any)=>{
        props.dispatch({
            type:'Staff/editdj',
            payload:{...val,uid,contractTypeid,dayDate}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改定金合同成功');
                history.push('/enter/staff');
            }else {
                message.error(res.Data);
            }
        })
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                onFinish={onFinish}
                layout="horizontal"
                size={'large'}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='合同编号' name='identifier'>
                    <Input/>
                </Form.Item>
                <Form.Item label='合同类型'>
                   <Input value='定金合同' disabled/>
                </Form.Item>
                <Form.Item label='客户' name='clientId'>
                    <Select>
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
                <Form.Item label='租金' name='zuMoney'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='押金' name='deposit' >
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='签正式合同日期'>
                    <DatePicker value={dayjs(dayDate)}/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
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
export default connect(mapStateToProps) (EditDjContract)