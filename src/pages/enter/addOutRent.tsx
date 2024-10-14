import {Button, DatePicker, Form, Input, message, Select} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as StaffService from "@/services/staff";
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
    const onFinish=(vals:any)=>{
        props.dispatch({
            type:'OutRent/add',
            payload:{...vals,tenantId,startDate}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('提交成功');
                history.push("/enter/afterSales")
            }else {
                message.error(res.Data)
            }
        })
    };
    const change=(e)=>{
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setOldName(res.Data.tenant_name);
                setTenantID(res.Data.tenantId);
            }else {
                message.error(res.Data)
            }
        })
    };
    const changeDate=(_:any,data:string)=>{
      setStartDate(data);
    };
    useEffect(() => {
        filterAndUpdateList(props.CheckHetongList, 'identifier', 'id', setHetongList);
    }, []);
    return(
        <div>
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
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='租户名字'>
                    <Input placeholder='原名字' value={oldName} disabled/>
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
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckHetongList: state.CheckHetong.list,

    }
};
export default connect(mapStateToProps) (AddOutRent)