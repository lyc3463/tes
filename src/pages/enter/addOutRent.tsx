import {Button, DatePicker, Form, Input, message, Select, Spin, Radio, Space} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {history,connect,useNavigate} from "umi";
import {useEffect, useState} from "react";
import * as StaffService from "@/services/staff";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddOutRent=(props)=>{
    const navigate=useNavigate();
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
    // 1正常退租,2强制退租
    const [type,settype]=useState(2);
    const onFinish=(vals:any)=>{
        setspinning(true);
        props.dispatch({
            type:'OutRent/add',
            payload:{...vals,tenantId,startDate,type}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
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
        setspinning(true);
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                setOldName(res.Data[0].tenant_name);
                setTenantID(res.Data[0].tenantId);
                settenant_phone(res.Data[0].tenant_phone);
            }else {
                message.error(res.Data);
                setspinning(false);
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
            type:'SeleHetong/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
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
    const changeType=(e)=>{
        settype(e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                initialValues={{reason:''}}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='选择合同' name='contractId'>
                    <Select
                        onChange={change}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =hetongList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {hetongList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.identifier}-{item.tenant_name}
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
                <Form.Item label='退租原因' name='reason' rules={[{required: true, message: '请输入' }]}>
                    <Input.TextArea placeholder='退租原因'/>
                </Form.Item>
                <Form.Item label='退租类型'>
                    <Radio.Group value={type} onChange={changeType}>
                        <Radio value={1}>正常退租</Radio>
                        <Radio value={2}>强制退租</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...tailLayout}>
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
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.SeleHetong.list,
    }
};
export default connect(mapStateToProps) (AddOutRent)