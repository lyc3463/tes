import {Button, DatePicker, Form, Input, message, Select, Spin} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddOutRent=(props)=>{
    const [form] = Form.useForm();
    // 租户名字
    const [oldName,setOldName]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    // 退租时间
    const [startDate,setStartDate]=useState('');
    // 租户手机号
    const [tenant_phone,settenant_phone]=useState('');
    const [spinning,setspinning]=useState(false);
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'OutRent/add',
            payload:{...vals,tenantId,startDate}
        }).then((res)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('提交成功');
                history.push("/enter/afterSales");
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const change=(e)=>{
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                console.log('租户ID',res);
                setOldName(res.Data[0].tenant_name);
                setTenantID(res.Data[0].tenantId);
                settenant_phone(res.Data[0].tenant_phone);
            }else {
                message.error(res.Data)
            }
        })
    };
    const changeDate=(_:any,data:string)=>{
      setStartDate(data);
    };
    // 合同列表
    const getContntList=()=>{
        setspinning(true);
        props.dispatch({
            type:'CheckHetong/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res',res);
                setHetongList(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    useEffect(() => {
        getContntList();
    }, []);
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
                <Form.Item label='选择合同' name='contractId'>
                    <Select onChange={change}>
                        {hetongList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.identifier}-{item.customName}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='租户手机号'>
                    <Input  value={tenant_phone} disabled/>
                </Form.Item>
                <Form.Item label='租户名字'>
                    <Input  value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='退租时间'>
                   <DatePicker onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='退租原因' name='reason'>
                    <Input.TextArea placeholder='退租原因'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.CheckHetong.list,
    }
};
export default connect(mapStateToProps) (AddOutRent)