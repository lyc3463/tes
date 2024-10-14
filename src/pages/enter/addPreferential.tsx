import {Button, Form, Input, InputNumber, message, Select} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import * as StaffService from "@/services/staff";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddPreferential=(props)=>{
    const [form] = Form.useForm();
    // 租户名字
    const [oldName,setOldName]=useState('');
    // 租户手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    // 原租金
    const [zuMoney,setZuMoney]=useState(0);
    const onFinish=(vals:any)=>{
        props.dispatch({
            type:'Preferential/add',
            payload:{...vals,tenantId}
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
                setOldPhone(res.Data.tenant_phone);
                setTenantID(res.Data.tenantId);
                setZuMoney(res.Data.zuMoney);
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        console.log(props)
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
                    <Input placeholder='租户名字' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='租户手机号'>
                    <Input placeholder='租户手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='原租金'>
                    <InputNumber placeholder='原租金' value={zuMoney} disabled/>元
                </Form.Item>
                <Form.Item label='申请优惠租金(元)' name='preRen'>
                    <InputNumber/>
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
export default connect(mapStateToProps) (AddPreferential)