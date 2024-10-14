import {Button, Form, Input, message, Select} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import {connect,history} from 'umi'
import {useEffect, useState} from "react";
import * as StaffService from "@/services/staff";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditRename=(props)=>{
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    const [form] = Form.useForm();
    // 原名字
    const [oldName,setOldName]=useState('');
    // 原手机号
    const [oldPhone,setOldPhone]=useState('');
    // 审核后的合同列表
    const [hetongList,setHetongList]=useState([]);
    // 租户ID
    const [tenantId,setTenantID]=useState(0);
    const change=(e)=>{
        StaffService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setOldName(res.Data.tenant_name);
                setOldPhone(res.Data.tenant_phone);
                setTenantID(res.Data.tenantId);
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id)
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
                <Form.Item label='原名字'>
                    <Input placeholder='原名字' value={oldName} disabled/>
                </Form.Item>
                <Form.Item label='原手机号'>
                    <Input placeholder='原手机号' value={oldPhone} disabled/>
                </Form.Item>
                <Form.Item label='更改后的名字' name='name' rules={[ {required: true, message: '请填写更改后的名字'}]}>
                    <Input placeholder='更改后的名字'/>
                </Form.Item>
                <Form.Item label='更改后的手机号' name='phone' rules={[ {required: true, message: '请填写更改后的手机号'},{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                    <Input placeholder='更改后的手机号'/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确定编辑
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
export default connect(mapStateToProps) (EditRename)